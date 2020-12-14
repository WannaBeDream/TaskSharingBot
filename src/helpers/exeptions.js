class CustomException extends Error {
    constructor(msg) {
        super(msg);
        this.message = msg;
    }
}

module.exports = CustomException;
