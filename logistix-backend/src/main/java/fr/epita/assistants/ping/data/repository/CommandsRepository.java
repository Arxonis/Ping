package fr.epita.assistants.ping.data.repository;

import fr.epita.assistants.ping.data.model.CommandsModel;
import fr.epita.assistants.ping.data.model.UserModel;
import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;

import java.util.List;
import java.util.UUID;

@ApplicationScoped
public class CommandsRepository implements PanacheRepository<CommandsModel> {

    public CommandsModel findById(UUID id) {
        return find("id", id).firstResult();
    }

    public List<CommandsModel> findByUser(UserModel user) {
        return list("user", user);
    }

    public List<CommandsModel> findByUserId(UUID userId) {
        return list("user.id", userId);
    }

    public List<CommandsModel> findByState(CommandsModel.State state) {
        return list("state", state);
    }

    public boolean existsById(UUID id) {
        return count("id", id) > 0;
    }
}
