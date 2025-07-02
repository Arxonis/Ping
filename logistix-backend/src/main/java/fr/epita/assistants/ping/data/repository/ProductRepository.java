package fr.epita.assistants.ping.data.repository;

import fr.epita.assistants.ping.data.model.ProductModel;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;

public interface ProductRepository extends JpaRepository<ProductModel, UUID> {}