/**
 * Defines a throwable subclass of Error used for signaling an HTTP status code.
 */
class HTTPResponseStatus extends Error {
    /**
     * The HTTP status code.
     */
    readonly statusCode: number;

    /**
     * The body of the response.
     */
    readonly body: any;

    /**
     * The header fields
     */
    readonly headers: any;

    /**
     * Constructor for the HTTPResponseStatus class
     * @param statusCode the HTTP status code
     * @param error the error message
     */
    constructor(statusCode: number, body: any, headers?: any) {
        super();
        this.statusCode = statusCode;
        if(headers) this.headers = headers;
        this.body = body;
    }
}

export default HTTPResponseStatus;