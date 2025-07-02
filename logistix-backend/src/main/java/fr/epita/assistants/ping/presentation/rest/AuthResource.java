package fr.epita.assistants.ping.presentation.rest;

import fr.epita.assistants.ping.data.model.UserModel;
import fr.epita.assistants.ping.data.repository.UserRepository;
import fr.epita.assistants.ping.errors.ErrorsCode;
import fr.epita.assistants.ping.service.TokenService;
import fr.epita.assistants.ping.utils.Logger;
import io.quarkus.security.Authenticated;
import jakarta.annotation.security.PermitAll;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.*;

import java.util.UUID;

@Path("/api/auth")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class AuthResource {

    public record UserInfo(
            String id,
            String displayName,
            Boolean isAdmin,
            String avatarPath,
            String companyName
    ) {
        public static UserInfo fromModel(UserModel u) {
            return new UserInfo(
                    u.getId().toString(),
                    u.getDisplayName(),
                    u.getIsAdmin(),
                    u.getAvatarPath(),
                    u.getCompany() != null ? u.getCompany().getName() : null
            );
        }
    }

    public record LoginRequest(
            @NotBlank String login,
            @NotBlank String password
    ) {}

    public record LoginResponse(
            String token,
            UserInfo user
    ) {}

    @Inject
    UserRepository userRepo;

    @Inject
    TokenService tokenService;

    @POST
    @Path("/login")
    @PermitAll
    @Transactional
    public Response login(@Valid LoginRequest req) {
        Logger.info("/login attempt %s", req.login());

        UserModel u = userRepo.findByLogin(req.login())
                .orElseThrow(() -> new WebApplicationException("User not found", Response.Status.NOT_FOUND));

        if (!u.getPassword().equals(req.password())) {
            Logger.error("/login ko %s", req.login());
            throw new WebApplicationException("Invalid credentials", Response.Status.UNAUTHORIZED);
        }

        String jwt = tokenService.generate(u);
        Logger.info("/login ok %s", u.getId());

        UserInfo info = UserInfo.fromModel(u);
        LoginResponse resp = new LoginResponse(jwt, info);
        return Response.ok(resp).build();
    }

    @GET
    @Path("/refresh")
    @Authenticated
    @Transactional
    public Response refresh(@Context SecurityContext sec) {
        String sid = sec.getUserPrincipal().getName();
        UUID id;
        try {
            id = UUID.fromString(sid);
        } catch (IllegalArgumentException e) {
            ErrorsCode.BAD_REQUEST.throwException("Invalid token user id");
            return Response.status(Response.Status.BAD_REQUEST).build();
        }

        UserModel u = userRepo.findByIdOptional(id)
                .orElseThrow(() -> new WebApplicationException("User not found", Response.Status.NOT_FOUND));

        String jwt = tokenService.generate(u);
        UserInfo info = UserInfo.fromModel(u);
        LoginResponse resp = new LoginResponse(jwt, info);
        return Response.ok(resp).build();
    }
}