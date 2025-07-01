package fr.epita.assistants.ping.data.repository;

import com.ping.logistix.data.model.ProjectModel;
import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;

import java.util.List;
import java.util.UUID;

@ApplicationScoped
public class ProjectRepository implements PanacheRepository<ProjectModel> {

    public ProjectModel findByUUID(UUID id) {
        return find("id = ?1", id).firstResult();
    }

    public long deleteByUUID(UUID id) {
        return delete("id = ?1", id);
    }

    public List<ProjectModel> findByOwnerId(UUID ownerId) {
        return list("owner.id = ?1", ownerId);
    }

    public List<ProjectModel> findByMemberId(UUID memberId) {
        return list("select p from ProjectModel p join p.members m where m.id = ?1 or p.owner.id = ?1", memberId);
    }
}