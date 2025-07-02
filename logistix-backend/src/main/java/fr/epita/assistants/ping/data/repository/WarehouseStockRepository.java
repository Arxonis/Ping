package fr.epita.assistants.ping.data.repository;

import fr.epita.assistants.ping.data.model.WarehouseStockModel;
import io.quarkus.hibernate.orm.panache.PanacheRepositoryBase;
import jakarta.enterprise.context.ApplicationScoped;

import java.util.List;
import java.util.UUID;

@ApplicationScoped
public class WarehouseStockRepository implements PanacheRepositoryBase<WarehouseStockModel, UUID> {

    public Integer findAllCount(UUID usedId) {
        Integer count = 0;
        List<WarehouseStockModel> warehouseStockModels = find("user.id", usedId).list();
        for (WarehouseStockModel warehouseStockModel : warehouseStockModels) {
            count += warehouseStockModel.getQuantity();
        }
        return count;
    }

    public List<WarehouseStockModel> findAllByUserId(UUID userId) {
        return find("user.id", userId).list();
    }
}
