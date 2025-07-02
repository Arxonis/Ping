package fr.epita.assistants.ping.presentation.rest;

import fr.epita.assistants.ping.data.model.CompanyModel;
import fr.epita.assistants.ping.data.model.UserModel;
import fr.epita.assistants.ping.data.repository.CompanyRepository;
import fr.epita.assistants.ping.data.repository.UserRepository;
import fr.epita.assistants.ping.errors.ErrorsCode;
import fr.epita.assistants.ping.utils.Logger;
import jakarta.annotation.security.RolesAllowed;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.*;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.UUID;

@jakarta.ws.rs.Path("/api/user")
@Consumes(MediaType.APPLICATION_JSON)
@Produces(MediaType.APPLICATION_JSON)
public class UserResource {

    public record NewUserRequest(
            @NotBlank String name,
            @NotBlank String password,
            Boolean isAdmin,
            UUID companyId
    ) {}

    public record UpdateUserRequest(
            String password,
            String displayName
    ) {}

    public record UserResponse(
            String id,
            String displayName,
            Boolean isAdmin,
            String avatarPath,
            String companyName
    ) {
        public static UserResponse fromModel(UserModel u) {
            String comp = u.getCompany() != null ? u.getCompany().getName() : null;
            return new UserResponse(
                    u.getId().toString(),
                    u.getDisplayName(),
                    u.getIsAdmin(),
                    u.getAvatarPath(),
                    comp
            );
        }
    }

    @Inject UserRepository userRepo;
    @Inject CompanyRepository companyRepo;

    private UUID uid(SecurityContext sec) {
        if (sec == null || sec.getUserPrincipal() == null) return null;
        return UUID.fromString(sec.getUserPrincipal().getName());
    }

    @POST
    @RolesAllowed("admin")
    @Transactional
    public Response createUser(
            @Valid NewUserRequest req,
            @Context SecurityContext sec
    ) {
        Logger.info("createUser by=%s name=%s admin=%s",
                uid(sec), req.name(), req.isAdmin());

        CompanyModel cmp = companyRepo.findByIdOptional(req.companyId())
                .orElseThrow(() -> new WebApplicationException("Société introuvable", 404));

        UserModel u = UserModel.builder()
                .displayName(req.name())
                .password(req.password())
                .isAdmin(Boolean.TRUE.equals(req.isAdmin()))
                .company(cmp)
                .build();
        userRepo.persist(u);

        return Response.ok(UserResponse.fromModel(u)).build();
    }

    @GET
    @jakarta.ws.rs.Path("/all")
    @RolesAllowed("admin")
    public Response all(@Context SecurityContext sec) {
        List<UserResponse> list = userRepo.listAll().stream()
                .map(UserResponse::fromModel)
                .toList();
        return Response.ok(list).build();
    }

    @GET
    @jakarta.ws.rs.Path("/{id}")
    public Response getUser(
            @PathParam("id") UUID id,
            @Context SecurityContext sec
    ) {
        UserModel u = userRepo.findByIdOptional(id)
                .orElseThrow(() -> new WebApplicationException("Utilisateur introuvable", 404));
        if (!sec.isUserInRole("admin") && !uid(sec).equals(id)) {
            throw new WebApplicationException("Accès refusé", 403);
        }
        return Response.ok(UserResponse.fromModel(u)).build();
    }

    @PUT
    @jakarta.ws.rs.Path("/{id}")
    @Transactional
    public Response updateUser(
            @PathParam("id") UUID id,
            UpdateUserRequest req,
            @Context SecurityContext sec
    ) {
        UserModel u = userRepo.findByIdOptional(id)
                .orElseThrow(() -> new WebApplicationException("Utilisateur introuvable", 404));
        if (!sec.isUserInRole("admin") && !uid(sec).equals(id)) {
            throw new WebApplicationException("Accès refusé", 403);
        }
        if (req.password() != null && !req.password().isBlank()) {
            u.setPassword(req.password());
        }
        if (req.displayName() != null && !req.displayName().isBlank()) {
            u.setDisplayName(req.displayName());
        }
        userRepo.persist(u);
        return Response.ok(UserResponse.fromModel(u)).build();
    }

    @DELETE
    @jakarta.ws.rs.Path("/{id}")
    @RolesAllowed("admin")
    @Transactional
    public Response deleteUser(
            @PathParam("id") UUID id,
            @Context SecurityContext sec
    ) {
        if (userRepo.findByIdOptional(id).isEmpty()) {
            throw new WebApplicationException("Utilisateur introuvable", 404);
        }
        userRepo.deleteById(id);
        return Response.noContent().build();
    }

    @POST
    @jakarta.ws.rs.Path("/{id}/uploadAvatar")
    @Consumes(MediaType.MULTIPART_FORM_DATA)
    @Transactional
    public Response uploadAvatar(
            @PathParam("id") UUID id,
            @FormParam("file") InputStream in,
            @FormParam("fileName") String fn,
            @Context SecurityContext sec
    ) {
        UserModel u = userRepo.findByIdOptional(id)
                .orElseThrow(() -> new WebApplicationException("Utilisateur introuvable", 404));
        if (!sec.isUserInRole("admin") && !uid(sec).equals(id)) {
            throw new WebApplicationException("Accès refusé", 403);
        }
        try {
            Path dir = Paths.get("uploads/avatars");
            Files.createDirectories(dir);
            String unique = UUID.randomUUID() + "_" + fn;
            Path file = dir.resolve(unique);
            Files.copy(in, file);
            u.setAvatarPath("/avatars/" + unique);
            userRepo.persist(u);
            return Response.ok(UserResponse.fromModel(u)).build();
        } catch (IOException e) {
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity("Error uploading file").build();
        }
    }
}