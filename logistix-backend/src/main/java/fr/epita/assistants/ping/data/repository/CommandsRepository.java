package fr.epita.assistants.ping.data.repository;

import fr.epita.assistants.ping.data.model.CommandsModel;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;

public interface CommandsRepository extends JpaRepository<CommandsModel, UUID> {}