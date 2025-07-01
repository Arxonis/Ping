package fr.epita.assistants.ping.data.repository;

import fr.epita.assistants.ping.data.model.UserModel;
import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;

import java.util.UUID;

@ApplicationScoped
public class UserRepository implements PanacheRepository<UserModel> {

    public UserModel findByLogin(String login) { return find("login", login).firstResult(); }
    public UserModel findById(UUID id) { return find("id", id).firstResult(); }
    public boolean   existsByLogin(String login){ return count("login", login) > 0; }
}