package fr.epita.assistants.ping.data.repository;

import fr.epita.assistants.ping.data.model.ProductModel;
import io.quarkus.hibernate.orm.panache.PanacheRepositoryBase;
import jakarta.enterprise.context.ApplicationScoped;

import java.util.UUID;

@ApplicationScoped
public class ProductRepository implements PanacheRepositoryBase<ProductModel, UUID> {}