class ApiResponse {
    status;
    message;
    data;

    constructor(status = "success", message , data) {
        this.status = status;
        this.message = message; // Empty string initially; will be set dynamically later
        this.data = data;
    }
}

module.exports = ApiResponse 