package fr.epita.assistants.ping.data.repository;

import fr.epita.assistants.ping.data.model.CompanyModel;
import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;

import java.util.UUID;

@ApplicationScoped
public class CompanyRepository implements PanacheRepository<CompanyModel> {

    public CompanyModel findById(UUID id) {
        return find("id", id).firstResult();
    }

    public CompanyModel findByName(String name) {
        return find("name", name).firstResult();
    }

    public boolean existsByName(String name) {
        return count("name", name) > 0;
    }
}
