import type { ConfigInfo, ProcessInfo, State } from 'node-supervisord/dist/interfaces.js';
import type { ConfigResponse } from '../../../shared/api.js';


export interface SupervisorData {
    config: ConfigResponse['config'];
    files: ConfigResponse['files'];
    version?: string;
    apiVersion?: string;
    configs: ConfigInfo[];
    processes: ProcessInfo[];
    identification?: string;
    state?: State;
    methods: string[];
}
