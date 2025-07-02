package fr.epita.assistants.ping.config;

import fr.epita.assistants.ping.data.model.*;
import fr.epita.assistants.ping.data.repository.*;
import io.quarkus.runtime.StartupEvent;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.enterprise.event.Observes;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.*;

@ApplicationScoped
public class DataInitializer {

    @Inject CompanyRepository      companyRepo;
    @Inject UserRepository         userRepo;
    @Inject ProductRepository      productRepo;
    @Inject WareHouseRepository    wareHouseRepo;
    @Inject WarehouseStockRepository stockRepo;
    @Inject CommandsRepository     cmdRepo;

    private final Random rand = new Random();

    @Transactional
    void onStart(@Observes StartupEvent ev) {
        // 1) Sociétés
        CompanyModel barjo = CompanyModel.builder()
                .name("BarjoCorp").emplacement("Paris").build();
        companyRepo.persist(barjo);

        CompanyModel ping = CompanyModel.builder()
                .name("PingLogistics").emplacement("Lyon").build();
        companyRepo.persist(ping);

        // 2) Utilisateurs
        UserModel admin = UserModel.builder()
                .displayName("Alice Admin")
                .password("admin123").company(barjo).isAdmin(true).build();
        userRepo.persist(admin);

        UserModel bob = UserModel.builder()
                .displayName("Bob Worker")
                .password("worker123").company(ping).isAdmin(false).build();
        userRepo.persist(bob);

        List<UserModel> users = List.of(admin, bob);

        // 3) Produits (20)
        List<ProductModel> products = new ArrayList<>();
        for (int i = 1; i <= 20; i++) {
            ProductModel p = ProductModel.builder()
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
                    .build();
            productRepo.persist(p);
            products.add(p);
        }

        // 4) Entrepôts (5)
        String[] villes = {"Toulouse","Marseille","Nantes","Bordeaux","Lille"};
        List<WareHouseModel> warehouses = new ArrayList<>();
        for (int i = 0; i < villes.length; i++) {
            WareHouseModel w = WareHouseModel.builder()
                    .name("Entrepôt " + (char)('A'+i))
                    .surface(200.0 + rand.nextInt(800))
                    .hauteur(4.0 + rand.nextDouble()*3)
                    .emplacement(villes[i])
                    .build();
            wareHouseRepo.persist(w);
            warehouses.add(w);
        }

        // 5) Stocks initiaux
        for (WareHouseModel wh : warehouses) {
            for (ProductModel p : products) {
                WarehouseStockModel s = WarehouseStockModel.builder()
                        .warehouse(wh)
                        .product(p)
                        .user(rand.nextBoolean() ? admin : bob)
                        .quantity(10 + rand.nextInt(200))
                        .build();
                stockRepo.persist(s);
            }
        }

        // 6) Commandes (100)
        String[] lieux = {"Paris","Lyon","Marseille","Nice","Toulouse","Bordeaux","Lille","Nantes"};
        CommandsModel.State[] states = CommandsModel.State.values();
        for (int i = 1; i <= 100; i++) {
            String dep, dest;
            do {
                dep = lieux[rand.nextInt(lieux.length)];
                dest = lieux[rand.nextInt(lieux.length)];
            } while (dep.equals(dest));

            LocalDateTime when = LocalDateTime.now()
                    .minus(rand.nextInt(90), ChronoUnit.DAYS)
                    .minus(rand.nextInt(24), ChronoUnit.HOURS)
                    .minus(rand.nextInt(60), ChronoUnit.MINUTES);

            CommandsModel cmd = CommandsModel.builder()
                    .user(users.get(rand.nextInt(users.size())))
                    .date(when)
                    .nom("Commande #" + i)
                    .io(rand.nextBoolean())
                    .state(states[rand.nextInt(states.length)])
                    .destPlace(dest)
                    .departurePlace(dep)
                    .product(products.get(rand.nextInt(products.size())))
                    .nbProducts(5 + rand.nextInt(50))
                    .build();
            cmdRepo.persist(cmd);
        }
    }
}