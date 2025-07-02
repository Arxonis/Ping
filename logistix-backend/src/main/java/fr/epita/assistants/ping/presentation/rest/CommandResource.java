package fr.epita.assistants.ping.presentation.rest;

import fr.epita.assistants.ping.data.repository.WarehouseStockRepository;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

import java.util.UUID;

@Path("/commands")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class CommandResource {

    @Inject
    WarehouseStockRepository warehouseStockRepository;

    @GET
    @Path("/stock-count/{userId}")
    public Response getStockCount(@PathParam("userId") String userIdStr) {
        try {
            UUID userId = UUID.fromString(userIdStr);
            Integer totalQuantity = warehouseStockRepository.findAllCount(userId);

            return Response.ok()
                    .entity(new StockCountResponse(totalQuantity))
                    .build();

        } catch (IllegalArgumentException e) {
            return Response.status(Response.Status.BAD_REQUEST)
                    .entity("Invalid UUID format for userId")
                    .build();
        }
    }

    public static class StockCountResponse {
        public Integer totalQuantity;

        public StockCountResponse(Integer totalQuantity) {
            this.totalQuantity = totalQuantity;
        }
    }
}
