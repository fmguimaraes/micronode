const responses = {
    DATABASE_ERROR : { message: "mongodb communication error" },
    TOKEN_NOT_PROVIDED: { message: "token not provided", auth: false, token: null },
    INVALID_TOKEN: { message: "invalid token", auth: false, token: null },
    INVALID_CHARACTER: { message : "invalid character" },
    UNKNOW_ERROR: { message : "unknow error"},

    UNKNOW_USER: { message: "unknow user" },
    VALIDATION_PROBLEM_USER : { message: "validation error during user creation"},
    INVALID_CREDENTIAL: { message: "invalid username or password" },

    HTTP_STATUS : {
        OK : 200,
        BAD_REQUEST : 400,
        UNAUTHORIZED : 401,
        NOT_FOUND : 404,
        CONFLICT : 409,
        INTERNAL_SERVER_ERROR : 500,
    },
};

module.exports = responses;