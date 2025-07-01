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
import jakarta.ws.rs.core.Context;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.core.SecurityContext;
import org.jboss.resteasy.annotations.providers.multipart.MultipartForm;

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

    public record NewUserRequest(@NotBlank String name, @NotBlank String password, Boolean isAdmin, UUID companyId) {}
    public record UpdateUserRequest(String password, String displayName) {}
    public record UserResponse(String id, String displayName, Boolean isAdmin, String avatarPath, String companyName) {
        public static UserResponse fromModel(UserModel u) {
            String companyName = u.getCompany() != null ? u.getCompany().getName() : null;
            return new UserResponse(u.getId().toString(), u.getDisplayName(), u.getIsAdmin(), u.getAvatarPath(), companyName);
        }
    }

    @Inject UserRepository users;
    @Inject CompanyRepository companies;

    private UUID uid(SecurityContext sec) {
        return sec == null || sec.getUserPrincipal() == null ? null : UUID.fromString(sec.getUserPrincipal().getName());
    }

    @POST
    @RolesAllowed("admin")
    @Transactional
    public Response createUser(@Valid NewUserRequest req, @Context SecurityContext sec) {
        Logger.info("req uid=%s name=%s isAdmin=%s", uid(sec), req.name(), req.isAdmin());

        CompanyModel company = companies.findById(req.companyId());
        if (company == null) {
            Logger.error("ko uid=%s companyId=%s", uid(sec), req.companyId());
            ErrorsCode.BAD_REQUEST.throwException("Company not found");
        }

        UserModel user = UserModel.builder()
                .displayName(req.name())
                .password(req.password())
                .isAdmin(Boolean.TRUE.equals(req.isAdmin()))
                .company(company)
                .build();

        users.persist(user);

        Logger.info("ok uid=%s newId=%s", uid(sec), user.getId());
        return Response.ok(UserResponse.fromModel(user)).build();
    }

    @GET
    @jakarta.ws.rs.Path("/all")
    @RolesAllowed("admin")
    @Transactional
    public Response all(@Context SecurityContext sec) {
        Logger.info("req uid=%s", uid(sec));
        List<UserResponse> res = users.findAll().stream().map(UserResponse::fromModel).toList();
        Logger.info("ok uid=%s count=%s", uid(sec), res.size());
        return Response.ok(res).build();
    }

    @GET
    @jakarta.ws.rs.Path("/{id}")
    public Response getUser(@PathParam("id") UUID id, @Context SecurityContext sec) {
        Logger.info("req uid=%s target=%s", uid(sec), id);
        UserModel u = users.findById(id);
        if (u == null) {
            Logger.error("ko uid=%s target=%s", uid(sec), id);
            ErrorsCode.NOT_FOUND.throwException();
        }
        if (!sec.isUserInRole("admin") && !uid(sec).equals(id)) {
            Logger.error("ko uid=%s target=%s", uid(sec), id);
            ErrorsCode.FORBIDDEN.throwException();
        }
        Logger.info("ok uid=%s target=%s", uid(sec), id);
        return Response.ok(UserResponse.fromModel(u)).build();
    }

    @PUT
    @jakarta.ws.rs.Path("/{id}")
    @Transactional
    public Response updateUser(@PathParam("id") UUID id, UpdateUserRequest req, @Context SecurityContext sec) {
        Logger.info("req uid=%s target=%s pass=%s name=%s", uid(sec), id, req.password, req.displayName);
        UserModel u = users.findById(id);
        if (u == null) {
            Logger.error("ko uid=%s target=%s", uid(sec), id);
            ErrorsCode.NOT_FOUND.throwException();
        }
        if (!sec.isUserInRole("admin") && !uid(sec).equals(id)) {
            Logger.error("ko uid=%s target=%s", uid(sec), id);
            ErrorsCode.FORBIDDEN.throwException();
        }
        if (req.password != null && !req.password.isBlank()) u.setPassword(req.password);
        if (req.displayName != null && !req.displayName.isBlank()) u.setDisplayName(req.displayName);
        Logger.info("ok uid=%s target=%s", uid(sec), id);
        return Response.ok(UserResponse.fromModel(u)).build();
    }

    @DELETE
    @jakarta.ws.rs.Path("/{id}")
    @RolesAllowed("admin")
    @Transactional
    public Response deleteUser(@PathParam("id") UUID id, @Context SecurityContext sec) {
        Logger.info("req uid=%s target=%s", uid(sec), id);
        UserModel u = users.findById(id);
        if (u == null) {
            Logger.error("ko uid=%s target=%s", uid(sec), id);
            ErrorsCode.NOT_FOUND.throwException();
        }
        users.delete(u);
        Logger.info("ok uid=%s target=%s", uid(sec), id);
        return Response.noContent().build();
    }

    @POST
    @jakarta.ws.rs.Path("/{id}/uploadAvatar")
    @Consumes(MediaType.MULTIPART_FORM_DATA)
    @Transactional
    public Response uploadAvatar(@PathParam("id") UUID id,
                                 @FormParam("file") InputStream uploadedInputStream,
                                 @FormParam("fileName") String fileName,
                                 @Context SecurityContext sec) {
        Logger.info("req uid=%s target=%s uploading avatar", uid(sec), id);

        UserModel u = users.findById(id);
        if (u == null) {
            Logger.error("ko uid=%s target=%s", uid(sec), id);
            ErrorsCode.NOT_FOUND.throwException();
        }

        if (!sec.isUserInRole("admin") && !uid(sec).equals(id)) {
            Logger.error("ko uid=%s target=%s", uid(sec), id);
            ErrorsCode.FORBIDDEN.throwException();
        }

        try {
            String uploadDir = "uploads/avatars/";
            String uniqueFileName = UUID.randomUUID() + "_" + fileName;
            Path filePath = Paths.get(uploadDir + uniqueFileName);

            Files.createDirectories(filePath.getParent());
            Files.copy(uploadedInputStream, filePath);

            u.setAvatarPath("/avatars/" + uniqueFileName);
            Logger.info("ok uid=%s target=%s avatar saved", uid(sec), id);

            return Response.ok(UserResponse.fromModel(u)).build();

        } catch (IOException e) {
            Logger.error("ko uid=%s target=%s error saving avatar", uid(sec), id);
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity("Error uploading file").build();
        }
    }

    // Formulaire multipart
    public static class AvatarForm {
        @FormParam("file") public byte[] fileData;
        @FormParam("fileName") public String fileName;
    }
}
