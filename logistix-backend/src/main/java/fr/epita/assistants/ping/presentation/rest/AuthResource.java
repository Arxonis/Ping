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
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.*;

import java.util.UUID;

@Path("/api/auth")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class AuthResource {

    public record LoginRequest(String login, String password) {}
    public record LoginResponse(String token) {}

    @Inject
    UserRepository userRepo;

    @Inject
    TokenService tokenService;

    @POST
    @Path("/login")
    @PermitAll
    @Transactional
    public Response login(@Valid LoginRequest req) {
        Logger.info("login attempt %s", req.login());
        if (req.login().isBlank() || req.password().isBlank()) {
            ErrorsCode.BAD_REQUEST.throwException("Missing credentials");
        }
        UserModel u = userRepo.findByLogin(req.login())
                .orElseThrow(() -> new WebApplicationException("User not found", 404));
        if (!u.getPassword().equals(req.password())) {
            ErrorsCode.INVALID_LOGIN.throwException();
        }
        String jwt = tokenService.generate(u);
        return Response.ok(new LoginResponse(jwt)).build();
    }

    @GET
    @Path("/refresh")
    @Authenticated
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
                .orElseThrow(() -> new WebApplicationException("User not found", 404));
        String jwt = tokenService.generate(u);
        return Response.ok(new LoginResponse(jwt)).build();
    }
}