import jwt from 'jsonwebtoken'
import type e from 'express';
import { inject } from 'inversify';
import { Controller, Get, Post, Request, Response } from '../decorators';
import { LogRequestMiddleware } from '../middleware/LogRequestMiddleware.js';
import type { Configuration } from '../Server.js';
import { Supervisor } from '../services/Supervisor.js';
import { BaseController } from './BaseController.js';

@Controller('/', [ LogRequestMiddleware ])
export class RootController extends BaseController {
    @inject(Supervisor) supervisor: Supervisor;
    @inject('config') config: Configuration;

    @Get('/')
    async index(
        @Response() res: e.Response,
        @Request() req: e.Request,
    ) {

        const data = {
            title: 'Supervisord Manager',
            server_port: this.config.port
        };

        res.render('index', data);
    }

    @Post('/login')
    async login(
        @Response() res: e.Response,
        @Request() req: e.Request,
    ) {

        if ( !req.body.email || !req.body.password ) {
            return this.respondWithError('No email or password set');
        }
        let user = this.config.users.find(user => user.email === req.body.email && user.password === req.body.password);
        if ( user ) {
            const accessToken = jwt.sign({ email: user.email },
                this.config.secret,
                {
                    algorithm: 'HS256',
                    allowInsecureKeySizes: true,
                    expiresIn: 86400, // 24 hours
                });

            return this.respondWithSuccess({ accessToken,user: {accessToken, email: user.email, name: user.name } });

        }
        return this.respondWithError('Invalid credentials');
    }


    @Get('/me')
    async me(
        @Response() res: e.Response,
        @Request() req: e.Request,
    ) {

        if ( !req.session[ 'user' ] ) {
            return this.respondWithError('Not logged in');
        }
        let user = this.config.users.find(user => user.email === req.session[ 'user' ].email);
        if ( user ) {
            return this.respondWithSuccess({ user: { email: user.email, name: user.name } });
        }
        return this.respondWithError('Unknown error');
    }
}
