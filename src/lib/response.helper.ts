import {ResponseType} from "@/lib/responseType";
import {NextResponse} from "next/server";

export class ResponseHelper<T> {
    status: ResponseType
    message: string
    data: T | null
    error: boolean
    statusCode?: number

    private constructor(status: ResponseType, data: T | null, message: string, error: boolean, statusCode?: number) {
        this.status = status
        this.message = message
        this.data = data
        this.error = error
        this.statusCode = statusCode
    }

    public static Success<T>(data: T| null, message: string, statusCode?: number) {
        return new ResponseHelper<T>(ResponseType.Success, data, message, false, statusCode);
    }

    public static Fail( message: string, statusCode?: number){
        return new ResponseHelper(ResponseType.Fail, null, message, true, statusCode);
    }

    public static NotFound(message: string, statusCode?: number){
        return new ResponseHelper(ResponseType.NotFound, null, message, true, statusCode);
    }

    public static Invalid( message: string, statusCode?: number){
        return new ResponseHelper(ResponseType.Invalid, null, message, true, statusCode);
    }

    public static ServerErr( message: string, statusCode?: number){
        return new ResponseHelper(ResponseType.ServerError, null, message, true, statusCode);
    }
}

export function ReturnResponse(resHelper: ResponseHelper<any>){
    try{
        switch (resHelper.status){
            case ResponseType.Success:
                return NextResponse.json(resHelper, {status: resHelper.statusCode ?? 200})
            case ResponseType.Fail:
                return NextResponse.json(resHelper, {status: resHelper.statusCode ?? 400})
            case ResponseType.Invalid:
                return NextResponse.json(resHelper, {status: resHelper.statusCode ?? 400})
            case ResponseType.NotFound:
                return NextResponse.json(resHelper, {status: resHelper.statusCode ?? 404})
            case ResponseType.ServerError:
                return NextResponse.json(resHelper, {status: resHelper.statusCode ?? 500})
            default:
                return NextResponse.json({message: "Hey Developer, you haven't set up the status type here!"}, {status: 104})

        }
    }catch(e){
        console.error('Returning Response: ',e);
        return NextResponse.json({message: "Internal Server Error"}, {status: 500});
    }
}