package fr.epita.assistants.ping.errors;

import fr.epita.assistants.ping.utils.HttpError;
import fr.epita.assistants.ping.utils.IHttpError;
import jakarta.ws.rs.core.Response.Status;
import lombok.Getter;

@Getter
public enum ErrorsCode implements IHttpError {
    NOT_FOUND              (Status.NOT_FOUND,    "Not found"),
    BAD_REQUEST            (Status.BAD_REQUEST,  "Bad request: %s"),
    INVALID_LOGIN          (Status.UNAUTHORIZED, "Invalid login/password"),
    RESOURCE_NOT_FOUND     (Status.NOT_FOUND,    "Resource not found"),
    FORBIDDEN              (Status.FORBIDDEN,    "Forbidden"),
    USER_ALREADY_EXISTS    (Status.CONFLICT,     "Login already used: %s"),
    PROJECT_ALREADY_MEMBER (Status.CONFLICT,     "User already a member of this project"),
    EXAMPLE_ERROR          (Status.BAD_REQUEST,  "Example error: %s"),
    SERVER_ERROR           (Status.INTERNAL_SERVER_ERROR, "Internal server error");
    private final HttpError error;

    ErrorsCode(Status status, String message) {
        this.error = new HttpError(status, message);
    }

    @Override
    public RuntimeException get(Object... args) {
        return error.get(args);
    }

    @Override
    public void throwException(Object... args) {
        error.throwException(args);
    }
}