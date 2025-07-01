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


    // user(id, name, password, company, isAdmin)

    @Id
    @GeneratedValue(generator = "uuid2")
    @GenericGenerator(name="uuid2", strategy="uuid2")
    private UUID id;

    @Column(name="name", nullable=false)
    private String displayName;

    @Column(nullable = false)
    private String password;

    
    private CompanyModel company;

    @JsonProperty("isAdmin")
    @Column(name="is_admin", nullable=false)
    @Builder.Default private Boolean isAdmin = false;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private Set<WarehouseStockModel> stocksManaged = new HashSet<>();

    @Column(name = "avatar_path")
    private String avatarPath;



    public void setIsAdmin(Boolean isAdmin) {
        this.isAdmin = isAdmin;
    }

    public Boolean getIsAdmin() {
        return this.isAdmin;
    }
}