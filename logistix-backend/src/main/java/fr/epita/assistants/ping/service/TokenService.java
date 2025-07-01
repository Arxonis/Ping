package fr.epita.assistants.ping.service;

import fr.epita.assistants.ping.data.model.UserModel;

public interface TokenService {
    String generate(UserModel user);
}