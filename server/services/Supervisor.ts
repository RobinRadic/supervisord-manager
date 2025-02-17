import { inject, injectable } from 'inversify';
import { groupBy } from 'lodash-es';
import { SupervisordClient } from 'node-supervisord';
import type { ConfigResponse, FullResponse, Group, ReloadResponse, StatusResponse } from '../../shared/api.js';
import type { Configuration } from '../Server.js';
import { SupervisorFiles } from './SupervisorFiles.js';

@injectable()
export class Supervisor {
    @inject(SupervisorFiles) fs: SupervisorFiles;
    @inject(SupervisordClient) api: SupervisordClient;

    async full():Promise<FullResponse>{
        const status = await this.status();
        const config = await this.fs.getAllConfig();
        let _groups  = {}
        config.files.forEach(f => {
            Object.keys(f.config).forEach(key => {
                let name = key.replace('program:','')
                _groups[name] = f.config[key]
                _groups[name].hasProcesses = false;
                _groups[name].name = name;
                _groups[name].processes = [];
                _groups[name].configs = [];
            })
        })
        Object.entries(groupBy(status.processes,'group')).forEach(([group, processes]) => {
            _groups[group].hasProcesses = processes.length > 0
            _groups[group].processes = processes
        })
        Object.entries(groupBy(status.configs,'group')).map(([group, configs]) => {
            _groups[group].configs = configs;
        })
        let groups = Object.values(_groups) as Group[];
        return {groups,  status,  config};
    }

    async status(): Promise<StatusResponse> {
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
}

