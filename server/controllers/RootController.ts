import type e from 'express';
import {inject } from 'inversify';
import { Response, Controller, Get, Params,Request, Post } from '../decorators';
import { LogRequestMiddleware } from '../middleware/LogRequestMiddleware.js';
import { Supervisor } from '../services/Supervisor.js';

@Controller('/',[LogRequestMiddleware])
export class RootController {
    @inject(Supervisor) supervisor: Supervisor;

    @Get('/')
    async index() {
       let pid = await this.supervisor.pid();
        return `Hello World
pid: ${pid}
        `;
    }

    @Get('/config')
    async config(@Response() res:e.Response) {
        return this.supervisor.fs.getAllConfig();
    }

    @Get('/state')
    async status(@Response() res:e.Response) {
        return this.supervisor.state();
    }

    @Get('/reload')
    async reload(@Response() res:e.Response) {
        return this.supervisor.reload();
    }

    @Get('/start-process-group/:name')
    async startProcessGroup(@Response() res:e.Response, @Params('name') name:string) {
        return this.supervisor.startProcessGroup(name);
    }
    @Get('/start-process/:name')
    async startProcess(@Response() res:e.Response, @Params('name') name:string) {
        return this.supervisor.startProcess(name);
    }

    @Post('/save-config/:group')
    async saveConfig(@Response() res:e.Response, @Request() req:e.Request, @Params('group') group:string) {
        return this.supervisor.fs.saveConfig(group, req.body);
    }


    @Get('/log/:offset/:length')
    async log(
        @Response() res:e.Response,
        @Request() req:e.Request,
        @Params('offset') offset: number,
        @Params('length') length: number ) {
        return this.supervisor.readLog(offset, length)
    }

    @Get('/process-out-log/:name/:offset/:length')
    async processStdoutLog(
        @Response() res:e.Response,
        @Request() req:e.Request,
        @Params('name') name: string,
        @Params('offset') offset: number,
        @Params('length') length: number
    ) {
        return this.supervisor.readProcessStdoutLog(name,offset, length)
    }
    @Get('/process-err-log/:name/:offset/:length')
    async processStderrLog(
        @Response() res:e.Response,
        @Request() req:e.Request,
        @Params('name') name: string,
        @Params('offset') offset: number,
        @Params('length') length: number ) {
        return this.supervisor.readProcessStderrLog(name,offset, length)
    }
}
