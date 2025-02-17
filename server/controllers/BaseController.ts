import { isString } from '@radicjs/utils';

export abstract class BaseController {
    protected respondWithSuccess(data:any ={}){
        return this.respond(true,data);
    }
    protected respondWithError(error?:any){
        if(error instanceof Error){
            error = error.message;
        }
        if(!isString( error) ){
            error = '';
        }
        return this.respond(false, {error});
    }

    protected respond(success:boolean, data:any ={}){
        return {success, ...data}
    }
}
