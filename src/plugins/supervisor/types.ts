import type { ConfigInfo, ProcessInfo } from 'node-supervisord/dist/interfaces.js';
import type { ConfigResponse, Group } from '../../../shared/api.js';


export interface SupervisorData {
    config: ConfigResponse['config'];
    files: ConfigResponse['files'];
    version?: string;
    apiVersion?: string;
    configs: ConfigInfo[];
    processes: ProcessInfo[];
    identification?: string;
    state?: {
        statecode: number;
        statename: string;
    };
    methods: string[];
    groups: Group;
}

export interface MeResponseData {
    success: boolean;
    error?: string;
    user?: {
        email: string
        name: string
    };
}


export interface LoginResponseData {
    success: boolean;
    error?: string;
    user?: {
        email: string
        name: string
        accessToken:string
    };
}
