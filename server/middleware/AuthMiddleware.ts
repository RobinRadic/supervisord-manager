import { HttpStatusCode } from 'axios';
import e from 'express';
import { injectable,inject } from 'inversify';
import jwt from 'jsonwebtoken';
import { MiddlewareClass } from '../decorators/index.js';
import type { Configuration } from '../Server.js';

@injectable()
export class AuthMiddleware implements MiddlewareClass {
    @inject('router') router: e.Router;
    @inject('config') config:Configuration

    public use(req: e.Request, res: e.Response, next: e.NextFunction) {
        let token = req.headers[ 'x-access-token' ] as string;

        if ( !token ) {
            return res.status(HttpStatusCode.Forbidden).send({
                message: 'No token provided!',
            });
        }

        jwt.verify(token,
            this.config.secret,
            (err, decoded) => {
                if ( err ) {
                    return res.status(HttpStatusCode.Unauthorized).send({
                        message: 'Unauthorized!',
                    });
                }
                req['email'] = decoded['email'];
                next();
            });
    }

}
