package fr.epita.assistants.ping.data.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.GenericGenerator;

import java.util.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
@Entity @Table(name = "projects")
public class ProjectModel {

    @Id
    @GeneratedValue(generator = "uuid2")
    @GenericGenerator(name="uuid2", strategy="uuid2")
    @Column(columnDefinition = "uuid", updatable = false, nullable = false)
    private UUID id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, unique=true)
    private String path = "/var/www/projects";

    @ManyToOne(optional = false)
    @JoinColumn(name="owner_id")
    private UserModel owner;

   @ManyToMany
   @JoinTable(name="project_members",
                       joinColumns        = @JoinColumn(name="project_id"),
                       inverseJoinColumns = @JoinColumn(name="user_id"))
   private List<UserModel> members = new ArrayList<>();
}