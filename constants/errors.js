const errors = {
    INVALID_SETTINGS : { message: "please add a valid settings" },
    INVALID_ACTIONS : { message: "please add a valid actions list" },
    INVALID_ROUTES : { message: "please add a valid routes list" },
    
    MONGO : {
        CAST : "CastError",
        VALIDATION : "ValidationError"
    },
};

module.exports = errors;