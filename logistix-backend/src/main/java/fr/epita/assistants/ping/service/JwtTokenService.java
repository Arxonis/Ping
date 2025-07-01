package fr.epita.assistants.ping.service;

import fr.epita.assistants.ping.data.model.UserModel;
import io.smallrye.jwt.build.Jwt;
import jakarta.enterprise.context.ApplicationScoped;

import org.eclipse.microprofile.config.inject.ConfigProperty;

import java.time.Duration;
import java.time.Instant;

@ApplicationScoped
public class JwtTokenService implements TokenService {



    @ConfigProperty(name = "jwt.expiration-hours", defaultValue = "12")
    int ttl;

    @Override
    public String generate(UserModel u) {
        Instant now = Instant.now();

        return Jwt.issuer("ping-backend")
                .subject(u.getId().toString())
                .groups(u.getIsAdmin() ? "admin" : "user")
                .issuedAt(now)
                .expiresAt(now.plus(Duration.ofHours(ttl)))
                .sign();
    }
}
