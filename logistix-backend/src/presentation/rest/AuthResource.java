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

@Path("/api/user")
@Consumes(MediaType.APPLICATION_JSON)
@Produces(MediaType.APPLICATION_JSON)
public class AuthResource {

    public record LoginRequest(
            @Valid @jakarta.validation.constraints.NotBlank String login,
            @Valid @jakarta.validation.constraints.NotBlank String password) {}

    public record LoginResponse(String token) {}

    @Inject
    UserRepository users;

    @Inject
    TokenService tokens;

    @POST
    @Path("/login")
    @PermitAll
    @Transactional
    public Response login(@Valid LoginRequest lreq) {
        Logger.info("/login attempt %s", lreq.login());
        if (lreq == null
                || lreq.login() == null || lreq.password() == null
                || lreq.login().isBlank() || lreq.password().isBlank()) {
            Logger.error("/login ko %s", lreq == null ? "null" : lreq.login());
            ErrorsCode.BAD_REQUEST.throwException("login/password missing or blank");
        }

        UserModel user = users.findByLogin(lreq.login());
        if (user == null || !user.getPassword().equals(lreq.password())) {
            Logger.error("/login ko %s", lreq.login());
            ErrorsCode.INVALID_LOGIN.throwException();
        }

        String jwt = tokens.generate(user);
        Logger.info("/login ok %s", user.getId());
        return Response.ok(new LoginResponse(jwt)).build();
    }

    @GET
    @Path("/refresh")
    @Authenticated
    public Response refresh(@Context SecurityContext sec) {
        String userId = sec.getUserPrincipal().getName();
        Logger.info("/refresh attempt %s", userId);

        UUID uuid;
        try {
            uuid = UUID.fromString(userId);
        } catch (IllegalArgumentException ex) {
            Logger.error("/refresh ko %s", userId);
            ErrorsCode.BAD_REQUEST.throwException("Invalid user ID in token");
            return Response.status(Response.Status.BAD_REQUEST).build();
        }

        UserModel user = users.findById(uuid);
        if (user == null) {
            Logger.error("/refresh ko %s", userId);
            ErrorsCode.NOT_FOUND.throwException("User not found");
        }

        String newJwt = tokens.generate(user);
        Logger.info("/refresh ok %s", userId);
        return Response.ok(new LoginResponse(newJwt)).build();
    }
}