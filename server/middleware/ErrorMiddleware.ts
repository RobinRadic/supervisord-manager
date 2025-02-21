import { injectable } from 'inversify';
import type { ErrorMiddlewareClass } from '../decorators/index.js';
import e from 'express';

@injectable()
export class ErrorMiddleware implements ErrorMiddlewareClass {
    public use(error: Error, request: e.Request, response: e.Response, next: e.NextFunction): void {
        response.status(500)
        console.log(error);
        response.send({success:false,error: error.message});
    }

}
