package fr.epita.assistants.ping.data.repository;

import fr.epita.assistants.ping.data.model.WarehouseStockModel;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;

public interface WarehouseStockRepository extends JpaRepository<WarehouseStockModel, UUID> {}