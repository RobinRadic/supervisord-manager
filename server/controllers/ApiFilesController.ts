import type e from 'express';
import { inject } from 'inversify';
import { Controller, Get, Params, Post, Request, Response } from '../decorators';
import { AuthMiddleware } from '../middleware/AuthMiddleware.js';
import { LogRequestMiddleware } from '../middleware/LogRequestMiddleware.js';
import { Supervisor } from '../services/Supervisor.js';
import { BaseController } from './BaseController.js';

@Controller('/api/files', [ AuthMiddleware,LogRequestMiddleware ])
export class ApiFilesController extends BaseController {
    @inject(Supervisor) supervisor: Supervisor;

    @Get('/exists/:path')
    async exists(
        @Response() res: e.Response,
        @Request() req: e.Request,
        @Params('path') path: string,
    ) {
        path         = decodeURIComponent(path);
        const exists = await this.supervisor.fs.canReadFrom(path);
        return this.respondWithSuccess({ exists });
    }

    @Post('/link')
    async link(
        @Response() res: e.Response,
        @Request() req: e.Request,
    ) {
        return {success: await this.supervisor.fs.link(req.body.path, req.body.filename)};
    }


    @Post('/config/:group')
    async saveConfig(@Response() res:e.Response, @Request() req:e.Request, @Params('group') group:string) {
        return this.respond(await this.supervisor.fs.saveConfig(group, req.body));
    }


    @Get('/config')
    async config(@Response() res:e.Response) {
        return this.respondWithSuccess(await this.supervisor.fs.getAllConfig());
    }

}
