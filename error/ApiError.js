class ApiError {
    constructor(code,message) {
        this.code = code;
        this.message;
    }

    static badrequest(msg) {
        return new ApiError(400,msg);
    }

    static internal(msg) {
        return new ApiError(500,msg);
    }
}

module.exports = ApiError;