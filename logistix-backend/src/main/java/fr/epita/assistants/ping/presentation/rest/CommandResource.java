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

@Path("/commands")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class CommandResource {

    @Inject
    WarehouseStockRepository warehouseStockRepository;

    @Inject
    CommandsRepository commandsRepository;

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

    @GET
    @Path("/sold-month/{userId}")
    public Response getSoldMonth(@PathParam("userId") String userIdStr) {
        try {
            UUID userId = UUID.fromString(userIdStr);
            Integer sold = commandsRepository.countSoldMonth(userId);
            return Response.ok()
                    .entity(new StockCountResponse(sold))
                    .build();

        } catch (IllegalArgumentException e) {
            return Response.status(Response.Status.BAD_REQUEST)
                    .entity("Invalid UUID format for userId")
                    .build();

        }
    }

    @GET
    @Path("/transit_in/{userId}")
    public Response getInProgress(@PathParam("userId") String userIdStr) {
        try {
            UUID userId = UUID.fromString(userIdStr);
            Integer inProgress = commandsRepository.countInProgress(userId);
            System.out.println(inProgress);
            return Response.ok()
                    .entity(new StockCountResponse(inProgress))
                    .build();
        }
        catch (IllegalArgumentException e) {
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



    @GET
    @Path("/user/{userId}")
    public Response listByUser(@PathParam("userId") String userIdStr) {
        UUID userId;
        try {
            userId = UUID.fromString(userIdStr);
        } catch (IllegalArgumentException ex) {
            return Response.status(Response.Status.BAD_REQUEST)
                    .entity("Invalid UUID format for userId")
                    .build();
        }

        List<CommandsModel> commandes = commandsRepository.findByUserId(userId);

        List<CommandDto> dtos = commandes.stream()
                .map(CommandDto::fromModel)
                .collect(Collectors.toList());

        return Response.ok(dtos).build();
    }

    /** DTO exposé au frontend **/
    public static class CommandDto {
        public String id;
        public String date;          // format ISO
        public String nom;
        public Boolean io;
        public String state;
        public String departurePlace;
        public String destPlace;
        public String productId;
        public Integer nbProducts;

        public static final DateTimeFormatter ISO = DateTimeFormatter.ISO_LOCAL_DATE_TIME;

        public static CommandDto fromModel(CommandsModel m) {
            CommandDto dto = new CommandDto();
            dto.id             = m.getId().toString();
            dto.date           = m.getDate().format(ISO);
            dto.nom            = m.getNom();
            dto.io             = m.getIo();
            dto.state          = m.getState().name();
            dto.departurePlace = m.getDeparturePlace();
            dto.destPlace      = m.getDestPlace();
            dto.productId      = m.getProduct().getId().toString();
            dto.nbProducts     = m.getNbProducts();
            return dto;
        }
    }
}
