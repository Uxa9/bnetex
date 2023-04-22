


export class ApiError {
    public code: number;
    public message: string;
    constructor(code: number, message: string){
        this.code = code;
        this.message = message;
    }

    static badRequest(message:string){
        return new ApiError(500, message);
    }

    static nonAuth(message:string){
        return new ApiError(403, message)
    }

    static notFound(message:string){
        return new ApiError(404, message)
    }
}
