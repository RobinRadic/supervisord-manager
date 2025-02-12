import type { ConfigInfo, ProcessInfo, State } from 'node-supervisord/dist/interfaces.js';

export interface StateResponse {
    version: string;
    apiVersion: string;
    configs: ConfigInfo[];
    processes: ProcessInfo[];
    identification: string;
    state: State;
    methods: string[];
}

export interface ReloadResponse {
    added: string[];
    changed: string[];
    removed: string[];
}

export interface ConfigResponse {
    config: any;
    files:Array<{content:string, config:any, path:string}>;
}
