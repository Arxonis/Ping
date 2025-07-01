package fr.epita.assistants.ping.presentation.rest;
import fr.epita.assistants.ping.data.model.ProjectModel;
import fr.epita.assistants.ping.data.model.UserModel;
import fr.epita.assistants.ping.data.repository.ProjectRepository;
import fr.epita.assistants.ping.data.repository.UserRepository;
import fr.epita.assistants.ping.errors.ErrorsCode;
import fr.epita.assistants.ping.utils.Logger;
import jakarta.annotation.security.RolesAllowed;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.Context;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.core.SecurityContext;
import java.io.IOException;
import java.nio.file.*;
import java.nio.file.Path;
import java.util.*;

@jakarta.ws.rs.Path("/api/projects")
@Consumes(MediaType.APPLICATION_JSON)
@Produces(MediaType.APPLICATION_JSON)
public class ProjectResource {

    public static class UserSummaryResponse {
        public String displayName;
        public String avatar;
        public UserSummaryResponse(String d, String a) { this.displayName = d; this.avatar = a; }
    }

    public static class ProjectResponse {
        public UUID id;
        public String name;
        public List<UserSummaryResponse> members;
        public UserSummaryResponse owner;
        public ProjectResponse(UUID id, String name, List<UserSummaryResponse> m, UserSummaryResponse o) { this.id = id; this.name = name; this.members = m; this.owner = o; }
    }

    public static class UpdateProjectRequest { public String name; public UUID newOwnerId; }
    public static class UserProjectRequest { public UUID userId; }
    public static class NewProjectRequest { public String name; }

    @Inject ProjectRepository projectRepository;
    @Inject UserRepository userRepository;

    private boolean isAdmin(SecurityContext sec) { return sec != null && sec.isUserInRole("admin"); }
    private UUID getUid(SecurityContext sec) { return sec == null || sec.getUserPrincipal() == null ? null : UUID.fromString(sec.getUserPrincipal().getName()); }

    private void ensureAccess(ProjectModel p, SecurityContext sec) {
        UUID me = getUid(sec);
        if (me == null) { Logger.error("ko uid=null"); ErrorsCode.INVALID_LOGIN.throwException("Not Authorized"); }
        boolean owner = p.getOwner().getId().equals(me);
        boolean mem = p.getMembers().stream().anyMatch(u -> u.getId().equals(me));
        if (!(isAdmin(sec) || owner || mem)) { Logger.error("ko uid=%s proj=%s", me, p.getId()); ErrorsCode.FORBIDDEN.throwException(); }
    }

    private void ensureOwnerOrAdmin(ProjectModel p, SecurityContext sec) {
        UUID me = getUid(sec);
        boolean owner = p.getOwner().getId().equals(me);
        if (!(isAdmin(sec) || owner)) { Logger.error("ko uid=%s proj=%s", me, p.getId()); ErrorsCode.FORBIDDEN.throwException(); }
    }

    @GET
    @jakarta.ws.rs.Path("/all")
    @RolesAllowed("admin")
    public List<ProjectResponse> getAllProjects() {
        Logger.info("ok uid=admin");
        return projectRepository.listAll().stream().map(pr -> new ProjectResponse(
                pr.getId(), pr.getName(),
                pr.getMembers().stream().map(m -> new UserSummaryResponse(m.getDisplayName(), m.getAvatar())).toList(),
                new UserSummaryResponse(pr.getOwner().getDisplayName(), pr.getOwner().getAvatar())
        )).toList();
    }

    @GET
    @jakarta.ws.rs.Path("/{id}")
    @Transactional
    public ProjectResponse getOne(@PathParam("id") UUID id, @Context SecurityContext sec) {
        Logger.info("req uid=%s proj=%s", getUid(sec), id);
        ProjectModel p = projectRepository.findByUUID(id);
        if (p == null) { Logger.error("ko uid=%s proj=%s", getUid(sec), id); ErrorsCode.NOT_FOUND.throwException("Project introuvable"); }
        ensureAccess(p, sec);
        List<UserSummaryResponse> mems = p.getMembers().stream().map(u -> new UserSummaryResponse(u.getDisplayName(), u.getAvatar())).toList();
        Logger.info("ok uid=%s proj=%s", getUid(sec), id);
        return new ProjectResponse(p.getId(), p.getName(), mems, new UserSummaryResponse(p.getOwner().getDisplayName(), p.getOwner().getAvatar()));
    }

    @PUT
    @jakarta.ws.rs.Path("/{id}")
    @Transactional
    public ProjectResponse update(@PathParam("id") UUID id, UpdateProjectRequest req, @Context SecurityContext sec) {
        Logger.info("req uid=%s proj=%s name=%s newOwner=%s", getUid(sec), id, req == null ? null : req.name, req == null ? null : req.newOwnerId);
        ProjectModel p = projectRepository.findByUUID(id);
        if (p == null) { Logger.error("ko uid=%s proj=%s", getUid(sec), id); ErrorsCode.NOT_FOUND.throwException("Project introuvable"); }
        ensureAccess(p, sec);
        if ((req == null) || (req.name == null && req.newOwnerId == null)) { Logger.error("ko uid=%s proj=%s", getUid(sec), id); ErrorsCode.BAD_REQUEST.throwException("Rien à mettre à jour"); }
        if (req.name != null && !req.name.isBlank()) p.setName(req.name);
        if (req.newOwnerId != null && !req.newOwnerId.equals(p.getOwner().getId())) {
            UserModel nu = userRepository.findById(req.newOwnerId);
            if (nu == null) { Logger.error("ko uid=%s proj=%s", getUid(sec), id); ErrorsCode.NOT_FOUND.throwException("Nouvel owner introuvable"); }
            if (p.getMembers().stream().noneMatch(u -> u.getId().equals(req.newOwnerId))) { Logger.error("ko uid=%s proj=%s", getUid(sec), id); ErrorsCode.NOT_FOUND.throwException("Owner doit être membre"); }
            p.setOwner(nu);
        }
        List<UserSummaryResponse> mems = p.getMembers().stream().map(u -> new UserSummaryResponse(u.getDisplayName(), u.getAvatar())).toList();
        Logger.info("ok uid=%s proj=%s", getUid(sec), id);
        return new ProjectResponse(p.getId(), p.getName(), mems, new UserSummaryResponse(p.getOwner().getDisplayName(), p.getOwner().getAvatar()));
    }

    @POST
    @jakarta.ws.rs.Path("/{id}/add-user")
    @Transactional
    public Response addUserToProject(@PathParam("id") UUID projectId, UserProjectRequest req, @Context SecurityContext sec) {
        Logger.info("req uid=%s proj=%s newUser=%s", getUid(sec), projectId, req == null ? null : req.userId);
        if (req == null || req.userId == null) { Logger.error("ko uid=%s proj=%s", getUid(sec), projectId); ErrorsCode.BAD_REQUEST.throwException("L'identifiant de l'utilisateur est invalide."); }
        ProjectModel project = projectRepository.findByUUID(projectId);
        if (project == null) { Logger.error("ko uid=%s proj=%s", getUid(sec), projectId); ErrorsCode.NOT_FOUND.throwException("Projet introuvable"); }
        UserModel user = userRepository.findById(req.userId);
        if (user == null) { Logger.error("ko uid=%s proj=%s", getUid(sec), projectId); ErrorsCode.NOT_FOUND.throwException("Utilisateur introuvable"); }
        if (project.getMembers().stream().anyMatch(u -> u.getId().equals(user.getId()))) { Logger.error("ko uid=%s proj=%s", getUid(sec), projectId); ErrorsCode.PROJECT_ALREADY_MEMBER.throwException("L'utilisateur est déjà membre du projet"); }
        ensureOwnerOrAdmin(project, sec);
        project.getMembers().add(user);
        projectRepository.persist(project);
        Logger.info("ok uid=%s proj=%s", getUid(sec), projectId);
        return Response.noContent().build();
    }

    @GET
    @Transactional
    public List<ProjectResponse> listProjects(@QueryParam("onlyOwned") Boolean onlyOwned, @Context SecurityContext sec) {
        Logger.info("req uid=%s onlyOwned=%s", getUid(sec), onlyOwned);
        UUID me = getUid(sec);
        List<ProjectModel> projects = (onlyOwned != null && onlyOwned) ? projectRepository.findByOwnerId(me) : projectRepository.findByMemberId(me);
        List<ProjectResponse> res = projects.stream().map(p -> new ProjectResponse(
                p.getId(), p.getName(),
                p.getMembers().stream().map(u -> new UserSummaryResponse(u.getDisplayName(), u.getAvatar())).toList(),
                new UserSummaryResponse(p.getOwner().getDisplayName(), p.getOwner().getAvatar())
        )).toList();
        Logger.info("ok uid=%s count=%s", me, res.size());
        return res;
    }

    @POST
    @Transactional
    public ProjectResponse createProject(NewProjectRequest req, @Context SecurityContext sec) throws IOException {
        Logger.info("req uid=%s name=%s", getUid(sec), req == null ? null : req.name);
        if (req == null || req.name == null || req.name.isBlank()) { Logger.error("ko uid=%s", getUid(sec)); ErrorsCode.BAD_REQUEST.throwException("Le nom du projet est obligatoire"); }
        UUID ownerId = getUid(sec);
        UserModel owner = userRepository.findById(ownerId);
        if (owner == null) { Logger.error("ko uid=%s", ownerId); ErrorsCode.INVALID_LOGIN.throwException("Utilisateur introuvable"); }
        String root = System.getenv("PROJECT_DEFAULT_PATH");
        if (root == null || root.isBlank()) { Logger.error("ko uid=%s", ownerId); ErrorsCode.SERVER_ERROR.throwException("PROJECT_DEFAULT_PATH non défini"); }
        ProjectModel project = new ProjectModel();
        project.setName(req.name); project.setOwner(owner); project.getMembers().add(owner); project.setPath(root);
        projectRepository.persist(project); projectRepository.flush();
        project.setPath(root + project.getId()); projectRepository.persist(project); projectRepository.flush();
        Files.createDirectories(Paths.get(root, project.getId().toString()));
        List<UserSummaryResponse> members = project.getMembers().stream().map(u -> new UserSummaryResponse(u.getDisplayName(), u.getAvatar())).toList();
        Logger.info("ok uid=%s proj=%s", ownerId, project.getId());
        return new ProjectResponse(project.getId(), project.getName(), members, new UserSummaryResponse(owner.getDisplayName(), owner.getAvatar()));
    }

    @DELETE
    @jakarta.ws.rs.Path("/{id}")
    @Transactional
    public Response delete(@PathParam("id") UUID id, @Context SecurityContext sec) {
        Logger.info("req uid=%s proj=%s", getUid(sec), id);
        ProjectModel p = projectRepository.findByUUID(id);
        if (p == null) { Logger.error("ko uid=%s proj=%s", getUid(sec), id); ErrorsCode.NOT_FOUND.throwException("Project introuvable"); }
        ensureOwnerOrAdmin(p, sec);
        long removed = projectRepository.deleteByUUID(id);
        if (removed == 0) { Logger.error("ko uid=%s proj=%s", getUid(sec), id); ErrorsCode.NOT_FOUND.throwException("Échec de la suppression"); }
        if (p.getPath() != null) {
            Path dir = Paths.get(p.getPath());
            try { if (Files.exists(dir)) Files.walk(dir).sorted(Comparator.reverseOrder()).forEach(path -> { try { Files.deleteIfExists(path); } catch (IOException ignored) {} }); } catch (IOException ignored) {}
        }
        Logger.info("ok uid=%s proj=%s", getUid(sec), id);
        return Response.noContent().build();
    }

    @POST
    @jakarta.ws.rs.Path("/{id}/remove-user")
    @Transactional
    public Response removeUserFromProject(@PathParam("id") UUID pid, UserProjectRequest req, @Context SecurityContext sec) {
        Logger.info("req uid=%s proj=%s target=%s", getUid(sec), pid, req == null ? null : req.userId);
        if (req == null || req.userId == null) { Logger.error("ko uid=%s proj=%s", getUid(sec), pid); ErrorsCode.BAD_REQUEST.throwException("Utilisateur invalide."); }
        ProjectModel p = projectRepository.findByUUID(pid);
        if (p == null) { Logger.error("ko uid=%s proj=%s", getUid(sec), pid); ErrorsCode.NOT_FOUND.throwException("Projet introuvable."); }
        UserModel u = userRepository.findById(req.userId);
        if (u == null) { Logger.error("ko uid=%s proj=%s", getUid(sec), pid); ErrorsCode.NOT_FOUND.throwException("Utilisateur introuvable."); }
        if (p.getOwner().getId().equals(u.getId())) { Logger.error("ko uid=%s proj=%s", getUid(sec), pid); ErrorsCode.FORBIDDEN.throwException("Impossible de supprimer le propriétaire."); }
        ensureOwnerOrAdmin(p, sec);
        boolean removed = p.getMembers().removeIf(m -> m.getId().equals(u.getId()));
        if (!removed) { Logger.error("ko uid=%s proj=%s", getUid(sec), pid); ErrorsCode.NOT_FOUND.throwException("Utilisateur non membre."); }
        projectRepository.persist(p);
        Logger.info("ok uid=%s proj=%s target=%s", getUid(sec), pid, req.userId);
        return Response.noContent().build();
    }
}