package fr.epita.assistants.ping.data.repository;

import fr.epita.assistants.ping.data.model.WareHouseModel;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;

public interface WareHouseRepository extends JpaRepository<WareHouseModel, UUID> {}