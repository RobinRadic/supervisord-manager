import type e from 'express';
import {inject } from 'inversify';
import { groupBy } from 'lodash-es';
import { Response, Controller, Get, Params,Request, Post } from '../decorators';
import { AuthMiddleware } from '../middleware/AuthMiddleware.js';
import { LogRequestMiddleware } from '../middleware/LogRequestMiddleware.js';
import { Supervisor } from '../services/Supervisor.js';
import { BaseController } from './BaseController.js';

@Controller('/api',[AuthMiddleware,LogRequestMiddleware])
export class ApiController extends BaseController {
    @inject(Supervisor) supervisor: Supervisor;

    @Get('/')
    async index() {
       let pid = await this.supervisor.api.getPID();
        return `Hello World
pid: ${pid}
        `;
    }

    @Get('/full')
    async full(@Response() res:e.Response) {
        return this.supervisor.status();
    }

    @Get('/status')
    async status(@Response() res:e.Response) {
        return this.supervisor.status();
    }

    @Get('/reload')
    async reload(@Response() res:e.Response) {
        return this.supervisor.reload();
    }

    @Get('/state')
    async state(@Response() res:e.Response) {
        return this.supervisor.api.getState()
    }

    @Get('/restart')
    async restart(@Response() res:e.Response) {
        return this.supervisor.api.restart()
    }

    @Get('/shutdown')
    async shutdown(@Response() res:e.Response) {
        return this.supervisor.api.shutdown()
    }


    @Get('/add-process-group/:name')
    async addProcessGroup(@Response() res:e.Response, @Params('name') name:string) {
        return this.supervisor.api.addProcessGroup(name);
    }

    @Get('/remove-process-group/:name')
    async removeProcessGroup(@Response() res:e.Response, @Params('name') name:string) {
        return this.supervisor.api.removeProcessGroup(name);
    }

    @Get('/start-process-group/:name')
    async startProcessGroup(@Response() res:e.Response, @Params('name') name:string) {
        return this.supervisor.api.startProcessGroup(name);
    }

    @Get('/stop-process-group/:name')
    async stopProcessGroup(@Response() res:e.Response, @Params('name') name:string) {
        return this.supervisor.api.stopProcessGroup(name);
    }

    @Get('/start-process/:name')
    async startProcess(@Response() res:e.Response, @Params('name') name:string) {
        return this.supervisor.api.startProcess(name);
    }

    @Get('/stop-process/:name')
    async stopProcess(@Response() res:e.Response, @Params('name') name:string) {
        return this.supervisor.api.stopProcess(name);
    }

    @Get('/start-all-processes')
    async startAll(@Response() res:e.Response) {
        return this.supervisor.api.startAllProcesses()
    }

    @Get('/stop-all-processes')
    async stopAll(@Response() res:e.Response) {
        return this.supervisor.api.stopAllProcesses()
    }


    @Get('/log/:offset/:length')
    async log(
        @Response() res:e.Response,
        @Request() req:e.Request,
        @Params('offset') offset: number,
        @Params('length') length: number ) {
        return this.supervisor.api.readLog(offset, length)
    }

    @Get('/process-out-log/:name/:offset/:length')
    async processStdoutLog(
        @Response() res:e.Response,
        @Request() req:e.Request,
        @Params('name') name: string,
        @Params('offset') offset: number,
        @Params('length') length: number
    ) {
        return this.supervisor.api.readProcessStdoutLog(name,offset, length)
    }
    @Get('/process-err-log/:name/:offset/:length')
    async processStderrLog(
        @Response() res:e.Response,
        @Request() req:e.Request,
        @Params('name') name: string,
        @Params('offset') offset: number,
        @Params('length') length: number ) {
        return this.supervisor.api.readProcessStderrLog(name,offset, length)
    }
}
