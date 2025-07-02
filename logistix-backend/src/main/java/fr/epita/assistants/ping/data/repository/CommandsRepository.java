package fr.epita.assistants.ping.data.repository;

import fr.epita.assistants.ping.data.model.CommandsModel;
import fr.epita.assistants.ping.data.model.UserModel;
import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;

import java.time.LocalDate;
import java.time.YearMonth;
import java.util.List;
import java.util.UUID;

@ApplicationScoped
public class CommandsRepository implements PanacheRepository<CommandsModel> {

    public Integer countSoldMonth(UUID userId) {
        Integer count = 0;
        List<CommandsModel> commandsModels = find("user.id", userId).list();
        LocalDate firstDayOfMonth = YearMonth.now().atDay(1);
        LocalDate lastDayOfMonth = YearMonth.now().atEndOfMonth();
        for (CommandsModel commandsModel : commandsModels) {
            LocalDate commandDate = commandsModel.getDate().toLocalDate();
            if ((commandDate.isEqual(firstDayOfMonth) || commandDate.isAfter(firstDayOfMonth)) &&
                    (commandDate.isEqual(lastDayOfMonth) || commandDate.isBefore(lastDayOfMonth))) {
                if (commandsModel.getIo() == Boolean.FALSE) {
                    count += commandsModel.getNbProducts();
                }
            }
        }
        return count;
    }

    public CommandsModel findById(UUID id) {
        return find("id", id).firstResult();
    }

    public List<CommandsModel> findByUser(UserModel user) {
        return list("user", user);
    }

    public List<CommandsModel> findByUserId(UUID userId) {
        return list("user.id", userId);
    }

    public List<CommandsModel> findByState(CommandsModel.State state) {
        return list("state", state);
    }

    public boolean existsById(UUID id) {
        return count("id", id) > 0;
    }
}
