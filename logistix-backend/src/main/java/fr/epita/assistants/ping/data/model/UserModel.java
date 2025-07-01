package fr.epita.assistants.ping.data.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.GenericGenerator;

import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
@Entity @Table(name = "users")
public class UserModel {

    @Id
    @GeneratedValue(generator = "uuid2")
    @GenericGenerator(name="uuid2", strategy="uuid2")
    private UUID id;

    @Column(nullable = false, unique = true)
    private String login;

    @Column(nullable = false)
    private String password;

    @Column(name="display_name", nullable=false)
    private String displayName;
    
    private String avatar;

    @JsonProperty("isAdmin")
    @Column(name="is_admin", nullable=false)
    @Builder.Default private Boolean isAdmin = false;

    @OneToMany(mappedBy="owner", cascade=CascadeType.ALL, orphanRemoval = true)
    private Set<ProjectModel> ownedProjects = new HashSet<>();

    @ManyToMany(mappedBy="members")
    private Set<ProjectModel> memberProjects = new HashSet<>();

    public void setIsAdmin(Boolean isAdmin) {
        this.isAdmin = isAdmin;
    }

    public Boolean getIsAdmin() {
        return this.isAdmin;
    }
}