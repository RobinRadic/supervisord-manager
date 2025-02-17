import type { ConfigInfo, ProcessInfo, State } from 'node-supervisord/dist/interfaces.js';

export interface StatusResponse {
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
    files: Array<{ content: string, config: any, path: string }>;
}

export interface FullResponse {
    groups: Group[];
    status: StatusResponse;
    config: ConfigResponse;
}


export interface Group {
    [ key: string ]: any;

    name: string;
    hasProcesses: boolean;
    configs: ConfigInfo[];
    processes: ProcessInfo[];
    process_name?: string;
    command: string;
    autostart?: boolean;
    autorestart?: boolean;
    numprocs?: string;
    redirect_stderr?: boolean;
    logfile?: string;
    stdout_logfile?: string;
    stderr_logfile?: string;
}
