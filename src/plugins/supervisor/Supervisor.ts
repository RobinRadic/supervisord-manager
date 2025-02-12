import type { SupervisorData } from '@/plugins/supervisor/types.js';
import { strStripLeft } from '@radicjs/utils';
import type { AxiosInstance } from 'axios';
import type { StateResponse } from '../../../shared/api.js';

export class Supervisor {
    public data: SupervisorData;

    constructor(
        private axios: AxiosInstance,
    ) {
        this.data = reactive({
            config: null,
            files: null,
            state: {
                version: null,
                apiVersion: null,
                configs: [],
                processes: [],
                identification: null,
                state: null,
                methods: [],
            },
        });
    }

    findConfigForGroup(group: string) {
        let config = this.data.files.find(f => {
            return Object.keys(f.config).map(key => strStripLeft(key, 'program:')).find(k => k === group) !== undefined;
        });
        return config;
    }

    async updateConfig() {
        const response   = await this.axios.get<{ config: any, files: any }>('/config');
        this.data.config = response.data.config;
        this.data.files  = response.data.files;
        return true;
    }

    async updateState() {
        const response = await this.axios.get<StateResponse>('/state');
        Object.entries(response.data).forEach(([ key, value ]) => {
            if ( this.data[ key ] !== value ) {
                this.data[ key ] = value;
            }
        });
        return true;
    }

    async status(): Promise<StateResponse> {
        const response = await this.axios.get('/status');
        return response.data;
    }

    async startProcessGroup(name: string) {
        const res = await this.axios.get(`/start-process-group/${name}`);
        return res.data;
    }

    async startProcess(name: string) {
        const res = await this.axios.get(`/start-process/${name}`);
        return res.data;
    }


    async stopProcess(name: string) {
        const res = await this.axios.get(`/stop-process/${name}`);
        return res.data;
    }

    async reload() {
        const res = await this.axios.get(`/reload`);
        return res.data;
    }

    async saveConfig(group: string, content: any) {
        const data = typeof content === 'string' ? content : String(content);
        const res  = await this.axios.post(`/save-config/${group}`, data, {
            headers: {
                'Content-Type': 'text/plain',
            },
        });
        return res.data;
    }


    async readLog(offset: number, length: number) {
        const res = await this.axios.get(`/log/${offset}/${length}`);
        return res.data;
    }

    async readProcessStdoutLog(name: string, offset: number, length: number) {
        const res = await this.axios.get(`/process-out-log/${name}/${offset}/${length}`);
        return res.data;
    }

    async readProcessStderrLog(name: string, offset: number, length: number) {
        const res = await this.axios.get(`/process-err-log/${name}/${offset}/${length}`);
        return res.data;
    }

    post() {
        console.log('post');
    }
}
