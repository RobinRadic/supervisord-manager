import type e from 'express';
import {inject } from 'inversify';
import { Response, Controller, Get, Params,Request, Post } from '../decorators';
import { LogRequestMiddleware } from '../middleware/LogRequestMiddleware.js';
import { Supervisor } from '../services/Supervisor.js';

@Controller('/files',[LogRequestMiddleware])
export class FileController {
    @inject(Supervisor) supervisor: Supervisor;

    @Get('/exist')
    async index() {
       let pid = await this.supervisor.pid();
        return `Hello World
pid: ${pid}
        `;
    }

}
