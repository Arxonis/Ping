package fr.epita.assistants.ping.config;

import fr.epita.assistants.ping.data.model.*;
import fr.epita.assistants.ping.data.repository.*;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.*;

@Component
@Profile("dev")
@RequiredArgsConstructor
public class DataInitializer {

    private final CompanyRepository companyRepo;
    private final UserRepository userRepo;
    private final ProductRepository productRepo;
    private final WareHouseRepository wareHouseRepo;
    private final WarehouseStockRepository stockRepo;
    private final CommandsRepository cmdRepo;

    private final Random rand = new Random();

    @PostConstruct     // appelé après le bootstrap Hibernate
    public void init() {

        /* ========= 1. sociétés ========== */
        CompanyModel barjo = companyRepo.save(
                CompanyModel.builder().name("BarjoCorp").emplacement("Paris").build());
        CompanyModel ping  = companyRepo.save(
                CompanyModel.builder().name("PingLogistics").emplacement("Lyon").build());

        /* ========= 2. utilisateurs ======= */
        UserModel admin = userRepo.save(UserModel.builder()
                .displayName("Alice Admin")
                .password("admin123")        // ⚠️ en réel : encoder le mot de passe
                .company(barjo)
                .isAdmin(true)
                .build());

        UserModel bob = userRepo.save(UserModel.builder()
                .displayName("Bob Worker")
                .password("worker123")
                .company(ping)
                .isAdmin(false)
                .build());

        List<UserModel> users = List.of(admin, bob);

        /* ========= 3. produits (20) ====== */
        List<ProductModel> products = new ArrayList<>();
        for (int i = 1; i <= 20; i++) {
            products.add(productRepo.save(ProductModel.builder()
                    .name("Produit-" + i)
                    .marque("Marque-" + (i % 5 + 1))
                    .width(0.3 + rand.nextDouble())
                    .height(0.3 + rand.nextDouble())
                    .weight(1 + rand.nextDouble() * 20)
                    .isFireable(rand.nextBoolean())
                    .isWaterproof(rand.nextBoolean())
                    .fragility(rand.nextInt(5) + 1)
                    .price(5 + rand.nextDouble() * 200)
                    .imageUrl("https://picsum.photos/seed/" + i + "/200")
                    .build()));
        }

        /* ========= 4. entrepôts (5) ====== */
        List<WareHouseModel> warehouses = new ArrayList<>();
        String[] villes = {"Toulouse", "Marseille", "Nantes", "Bordeaux", "Lille"};
        for (int i = 0; i < 5; i++) {
            warehouses.add(wareHouseRepo.save(WareHouseModel.builder()
                    .name("Entrepôt " + (char) ('A' + i))
                    .surface(200 + rand.nextInt(800))
                    .hauteur(4 + rand.nextDouble() * 3)
                    .emplacement(villes[i])
                    .build()));
        }

        /* ========= 5. stocks initiaux ==== */
        for (WareHouseModel wh : warehouses) {
            for (ProductModel p : products) {
                stockRepo.save(WarehouseStockModel.builder()
                        .warehouse(wh)
                        .product(p)
                        .user(rand.nextBoolean() ? admin : bob)
                        .quantity(10 + rand.nextInt(200))
                        .build());
            }
        }

        /* ========= 6. commandes (100) ==== */
        String[] lieux = {"Paris", "Lyon", "Marseille", "Nice", "Toulouse",
                "Bordeaux", "Lille", "Nantes"};
        CommandsModel.State[] states = CommandsModel.State.values();

        for (int i = 1; i <= 100; i++) {
            String dep = lieux[rand.nextInt(lieux.length)];
            String dest;
            do { dest = lieux[rand.nextInt(lieux.length)]; } while (dest.equals(dep));

            LocalDateTime when = LocalDateTime.now()
                    .minus(rand.nextInt(90), ChronoUnit.DAYS)
                    .minus(rand.nextInt(24), ChronoUnit.HOURS)
                    .minus(rand.nextInt(60), ChronoUnit.MINUTES);

            cmdRepo.save(CommandsModel.builder()
                    .user(users.get(rand.nextInt(users.size())))
                    .date(when)
                    .nom("Commande #" + i)
                    .io(rand.nextBoolean())
                    .state(states[rand.nextInt(states.length)])
                    .destPlace(dest)
                    .departurePlace(dep)
                    .product(products.get(rand.nextInt(products.size())))
                    .nbProducts(5 + rand.nextInt(50))
                    .build());
        }
    }
}