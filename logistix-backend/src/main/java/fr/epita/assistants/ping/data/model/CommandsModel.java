package fr.epita.assistants.ping.data.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.GenericGenerator;

import java.time.LocalDateTime;
import java.util.UUID;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
@Entity
@Table(name = "commands")
public class CommandsModel {

    public static enum State {
        PENDING,
        IN_PROGRESS,
        COMPLETED,
        CANCELLED
    }

    // commands(id, userId, date, nom, io, state, dest_place, departure_place, productId, nbProducts)

    @Id
    @GeneratedValue(generator = "uuid2")
    @GenericGenerator(name = "uuid2", strategy = "uuid2")
    private UUID id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "user_id")
    private UserModel user;

    @Column(nullable = false)
    private LocalDateTime date;

    @Column(nullable = false)
    private String nom;

    // io: true for input, false for output
    @Column(nullable = false)
    private Boolean io;

    @Column(nullable = false)
    private State state;

    @Column(name = "dest_place", nullable = false)
    private String destPlace;

    @Column(name = "departure_place", nullable = false)
    private String departurePlace;

    @ManyToOne(optional = false)
    @JoinColumn(name = "product_id")
    private ProductModel product;

    @Column(name = "nb_products", nullable = false)
    private Integer nbProducts;
}
