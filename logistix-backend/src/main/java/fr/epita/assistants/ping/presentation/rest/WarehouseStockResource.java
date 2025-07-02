package fr.epita.assistants.ping.presentation.rest;

import fr.epita.assistants.ping.data.repository.CommandsRepository;
import fr.epita.assistants.ping.data.repository.WarehouseStockRepository;
import fr.epita.assistants.ping.data.model.CommandsModel;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import fr.epita.assistants.ping.data.model.ProductModel;
import fr.epita.assistants.ping.data.model.WareHouseModel;
import fr.epita.assistants.ping.data.model.WarehouseStockModel;


@Path("/warehouse-stock")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class WarehouseStockResource {

    @Inject
    WarehouseStockRepository warehouseStockRepository;

    @Inject
    CommandsRepository commandsRepository;

    public static class StockedResponse {
        public List <WarehouseStockModel> stockedProducts;

        public StockedResponse(List<WarehouseStockModel> totalQuantity) {
            this.stockedProducts = totalQuantity;
        }
    }

    @GET
    @Path("/stock-products/{userId}")
    public Response getStockCount(@PathParam("userId") String userIdStr) {
        try {
            UUID userId = UUID.fromString(userIdStr);
            List<WarehouseStockModel> warehouseStockModels = warehouseStockRepository.findAllByUserId(userId);
            if (warehouseStockModels.isEmpty()) {
                return Response.status(Response.Status.NOT_FOUND)
                        .entity("No stocked products found for userId: " + userId)
                        .build();
            }
            return Response.ok()
                    .entity(new StockedResponse(warehouseStockModels))
                    .build();
        } catch (IllegalArgumentException e) {
            return Response.status(Response.Status.BAD_REQUEST)
                    .entity("Invalid UUID format for userId")
                    .build();
        }   
    }
}
