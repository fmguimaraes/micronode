const responses = {
    DATABASE_ERROR : { message: "mongodb communication error" },
    UNKNOW_USER: { message: "unknow user" },
    USER_ALREADY_EXISTS: { message: "user already registered" },
    UNABLE_TO_CREATE_USER: { message: "unable to create user" },
    INVALID_PASSWORD: { error: { code:401, message: "invalid username or password"} },
    TOKEN_NOT_PROVIDED: { message: "token not provided", auth: false, token: null },
    INVALID_TOKEN: { message: "invalid token", auth: false, token: null }
};

module.exports = responses;