import {ResponseType} from "@/lib/responseType";

export class ResponseHelper<T> {
    status: ResponseType
    message: string
    data: T | null

    private constructor(status: ResponseType, data: T | null, message: string) {
        this.status = status
        this.message = message
        this.data = data
    }

    public static Success<T>(data: T| null, message: string){
        return new ResponseHelper<T>(ResponseType.Success, data, message);
    }

    public static Fail( message: string){
        return new ResponseHelper(ResponseType.Fail, null, message);
    }

    public static NotFound(message: string){
        return new ResponseHelper(ResponseType.NotFound, null, message);
    }

    public static Invalid( message: string){
        return new ResponseHelper(ResponseType.Invalid, null, message);
    }

    public static ServerErr( message: string){
        return new ResponseHelper(ResponseType.ServerError, null, message);
    }
}

