package fr.epita.assistants.ping.data.repository;

import fr.epita.assistants.ping.data.model.CommandsModel;
import io.quarkus.hibernate.orm.panache.PanacheRepositoryBase;
import jakarta.enterprise.context.ApplicationScoped;

import java.util.UUID;

@ApplicationScoped
public class CommandsRepository implements PanacheRepositoryBase<CommandsModel, UUID> {}