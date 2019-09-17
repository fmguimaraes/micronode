const errors = {
    INVALID_SETTINGS : { message: "please add a valid settings" },
    INVALID_ACTIONS : { message: "please add a valid actions list" },
    INVALID_ROUTES : { message: "please add a valid routes list" },
    INVALID_PERMISSIONS : { message: "please add a valid permissions map" },
    
    MONGO : {
        CAST : "CastError",
        VALIDATION : "ValidationError"
    },

    MISSING_PASSWORD : "MissingPassword",
};

module.exports = errors;