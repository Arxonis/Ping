package fr.epita.assistants.ping.data.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.GenericGenerator;

import java.util.UUID;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
@Entity @Table(name = "securities")
public class SecurityModel {

    @Id
    @GeneratedValue(generator = "uuid2")
    @GenericGenerator(name = "uuid2", strategy = "uuid2")
    private UUID id;

    @Column(name = "is_fireable", nullable = false)
    private Boolean isFireable;

    @Column(name = "is_waterproof", nullable = false)
    private Boolean isWaterproof;

    @Column(nullable = false)
    private Integer fragility;
}
