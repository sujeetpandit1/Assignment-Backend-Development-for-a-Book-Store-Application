class ApiError extends Error {
    statusCode;
    data;
    message;
    success;
    errors;

    constructor(
        statusCode,
        message = "Opps! Something Went Wrong.",
        errors = [],
        stack = ""
    ) {
        super(message);

        this.statusCode = statusCode;
        this.data = null;
        this.message = message;
        this.success = false;
        this.errors = errors;

        if (stack) {
            this.stack = stack;
        } else {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}

function sendErrorResponse(res, code, message) {
    const error = new ApiError(code, message);
    res.status(code).json({
        status: "failed",
        message: error.message,
    });
}


module.exports = sendErrorResponse