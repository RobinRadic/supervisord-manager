import e from 'express';
import { injectable,inject } from 'inversify';
import { MiddlewareClass } from '../decorators/index.js';

@injectable()
export class LogRequestMiddleware implements MiddlewareClass {
    @inject('router') router: e.Router;
    public use(req: e.Request, res: e.Response, next: e.NextFunction): void {
        console.log(`Request made to: ${req.url}`);
        this.router.trace(`Request made to: ${req.url}`);
        next();

        return;

    }

}
