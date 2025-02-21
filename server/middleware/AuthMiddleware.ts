import e from 'express';
import { injectable,inject } from 'inversify';
import { MiddlewareClass } from '../decorators/index.js';

@injectable()
export class AuthMiddleware implements MiddlewareClass {
    @inject('router') router: e.Router;
    public use(req: e.Request, res: e.Response, next: e.NextFunction): void {
        if(req.session['user']){
            return next();
        }

        var err = new Error("Not logged in!");
        console.error('Not logged in',req.session['user']);
        next(err);

    }

}
