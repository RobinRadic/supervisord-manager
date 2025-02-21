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
            req.session[ 'user' ] = user;
            await new Promise((resolve, reject) => {

                // regenerate the session, which is good practice to help
                // guard against forms of session fixation
                req.session.regenerate(function (err) {
                    if (err) reject(err)

                    // store user information in session, typically a user id
                    req.session[ 'user' ] = user;

                    // save the session before redirection to ensure page
                    // load does not happen before session is saved
                    req.session.save(function (err) {
                        if (err) return reject(err)
                        resolve(user);
                    })
                })
            });
            return this.respondWithSuccess({ user: { email: user.email, name: user.name } });

        }
        return this.respondWithError('Invalid credentials');
    }

    @Get('/logout')
    async logout(
        @Response() res: e.Response,
        @Request() req: e.Request,
    ) {
        req.session.destroy(error => {
            if (error) {
                return res.json({ success: false, error });
            }
            return res.json({ success: true });
        });
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
