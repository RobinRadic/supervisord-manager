import { inject, injectable } from 'inversify';
import { SupervisordClient } from 'node-supervisord';
import type { ConfigResponse, ReloadResponse, StateResponse } from '../../shared/api.js';
import type { Configuration } from '../Server.js';
import { SupervisorFiles } from './SupervisorFiles.js';

@injectable()
export class Supervisor {
    @inject(SupervisorFiles) fs: SupervisorFiles;
    @inject(SupervisordClient) api: SupervisordClient;


    async pid(): Promise<number> {
        return this.api.getPID();
    }

    async readLog(offset: number, length: number ) {
        return this.api.readLog(offset, length)
    }

    async readProcessStdoutLog(name:string,offset: number, length: number ) {
        return this.api.readProcessStdoutLog(name,offset, length)
    }

    async readProcessStderrLog(name:string,offset: number, length: number ) {
        return this.api.readProcessStderrLog(name,offset, length)
    }

    async state(): Promise<StateResponse> {
        const [version,apiVersion, configs, processes, identification, state, methods ] = await Promise.all([
            this.api.getSupervisorVersion(),
            this.api.getAPIVersion(),
            this.api.getAllConfigInfo(),
            this.api.getAllProcessInfo(),
            this.api.getIdentification(),
            this.api.getState(),
            this.api.listMethods(),
        ]);
        return {version,apiVersion, configs, processes, identification, state, methods };
    }

    async reload(): Promise<ReloadResponse> {
        const result = await this.api.reloadConfig();
        return {
            added: result[ 0 ][ 0 ],
            changed: result[ 0 ][ 1 ],
            removed: result[ 0 ][ 2 ],
        };
    }

    async startProcessGroup(name: string, wait: boolean = true) {
        return this.api.startProcessGroup(name, wait);
    }

    async startProcess(name: string, wait: boolean = true) {
        return this.api.startProcess(name, wait);
    }

}

