package fr.epita.assistants.ping.presentation.rest;

import fr.epita.assistants.ping.data.model.UserModel;
import fr.epita.assistants.ping.data.repository.ProjectRepository;
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
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Path("/api/user")
@Consumes(MediaType.APPLICATION_JSON)
@Produces(MediaType.APPLICATION_JSON)
public class UserResource {

    public record NewUserRequest(@NotBlank String login, @NotBlank String password, Boolean isAdmin) {}
    public record UpdateUserRequest(String password, String displayName, String avatar) {}
    public record UserResponse(String id, String login, String displayName, Boolean isAdmin, String avatar) {
        public static UserResponse fromModel(UserModel u) { return new UserResponse(u.getId().toString(), u.getLogin(), u.getDisplayName(), u.getIsAdmin(), u.getAvatar()); }
    }

    @Inject UserRepository users;
    @Inject ProjectRepository projects;

    private UUID uid(SecurityContext sec) { return sec == null || sec.getUserPrincipal() == null ? null : UUID.fromString(sec.getUserPrincipal().getName()); }

    @POST
    @RolesAllowed("admin")
    @Transactional
    public Response createUser(@Valid NewUserRequest req, @Context SecurityContext sec) {
        Logger.info("req uid=%s login=%s isAdmin=%s", uid(sec), req.login(), req.isAdmin());
        String login = req.login();
        boolean hasSep = false;
        for (char c : login.toCharArray()) {
            if (!Character.isLetterOrDigit(c) && c != '.' && c != '_') { Logger.error("ko uid=%s login=%s", uid(sec), login); ErrorsCode.BAD_REQUEST.throwException("invalid char"); }
            if (c == '.' || c == '_') hasSep = true;
        }
        if (!hasSep) { Logger.error("ko uid=%s login=%s", uid(sec), login); ErrorsCode.BAD_REQUEST.throwException("need sep"); }
        if (users.existsByLogin(login)) { Logger.error("ko uid=%s login=%s", uid(sec), login); ErrorsCode.USER_ALREADY_EXISTS.throwException(); }
        StringBuilder name = new StringBuilder(); boolean up = true;
        for (char c : login.toCharArray()) {
            if (Character.isLetterOrDigit(c)) { name.append(up ? Character.toUpperCase(c) : c); up = false; }
            else { name.append(' '); up = true; }
        }
        UserModel user = UserModel.builder().login(login).password(req.password()).displayName(name.toString()).isAdmin(Boolean.TRUE.equals(req.isAdmin())).build();
        users.persist(user);
        Logger.info("ok uid=%s newId=%s", uid(sec), user.getId());
        return Response.ok(UserResponse.fromModel(user)).build();
    }

    @GET
    @Path("/all")
    @RolesAllowed("admin")
    @Transactional
    public Response all(@Context SecurityContext sec) {
        Logger.info("req uid=%s", uid(sec));
        List<UserResponse> res = users.findAll().stream().map(UserResponse::fromModel).toList();
        Logger.info("ok uid=%s count=%s", uid(sec), res.size());
        return Response.ok(res).build();
    }

    @GET
    @Path("/{id}")
    public Response getUser(@PathParam("id") UUID id, @Context SecurityContext sec) {
        Logger.info("req uid=%s target=%s", uid(sec), id);
        UserModel u = users.findById(id);
        if (u == null) { Logger.error("ko uid=%s target=%s", uid(sec), id); ErrorsCode.NOT_FOUND.throwException(); }
        if (!sec.isUserInRole("admin") && !uid(sec).equals(id)) { Logger.error("ko uid=%s target=%s", uid(sec), id); ErrorsCode.FORBIDDEN.throwException(); }
        Logger.info("ok uid=%s target=%s", uid(sec), id);
        return Response.ok(UserResponse.fromModel(u)).build();
    }

    @PUT
    @Path("/{id}")
    @Transactional
    public Response updateUser(@PathParam("id") UUID id, UpdateUserRequest req, @Context SecurityContext sec) {
        Logger.info("req uid=%s target=%s pass=%s name=%s avatar=%s", uid(sec), id, req.password, req.displayName, req.avatar);
        UserModel u = users.findById(id);
        if (u == null) { Logger.error("ko uid=%s target=%s", uid(sec), id); ErrorsCode.NOT_FOUND.throwException(); }
        if (!sec.isUserInRole("admin") && !uid(sec).equals(id)) { Logger.error("ko uid=%s target=%s", uid(sec), id); ErrorsCode.FORBIDDEN.throwException(); }
        if (req.password != null && !req.password.isBlank()) u.setPassword(req.password);
        if (req.displayName != null && !req.displayName.isBlank()) u.setDisplayName(req.displayName);
        if (req.avatar != null) u.setAvatar(req.avatar);
        Logger.info("ok uid=%s target=%s", uid(sec), id);
        return Response.ok(UserResponse.fromModel(u)).build();
    }

    @DELETE
    @Path("/{id}")
    @RolesAllowed("admin")
    @Transactional
    public Response deleteUser(@PathParam("id") UUID id, @Context SecurityContext sec) {
        Logger.info("req uid=%s target=%s", uid(sec), id);
        UserModel u = users.findById(id);
        if (u == null) { Logger.error("ko uid=%s target=%s", uid(sec), id); ErrorsCode.NOT_FOUND.throwException(); }
        if (projects.count("owner.id", id) > 0) { Logger.error("ko uid=%s target=%s", uid(sec), id); ErrorsCode.FORBIDDEN.throwException("owns projects"); }
        users.delete(u);
        Logger.info("ok uid=%s target=%s", uid(sec), id);
        return Response.noContent().build();
    }
}