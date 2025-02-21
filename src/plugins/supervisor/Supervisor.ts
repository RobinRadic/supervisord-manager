import type { SupervisorData } from '@/plugins/supervisor/types.js';
import { merge, strStripLeft } from '@radicjs/utils';
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { groupBy } from 'lodash-es';
import type { FullResponse, Group, StatusResponse } from '../../../shared/api.js';
import { type Auth, useAuth } from '../auth.js';

export class Supervisor {
    public data: SupervisorData;
    public groups: ComputedRef<Group[]>;
    private auth: Auth;

    constructor(
        private axios: AxiosInstance,
    ) {
        this.auth = useAuth();
        this.data = reactive({
            config: null,
            files: [],
            groups: [],
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

        this.groups = computed(() => {
            const state = this.data.state;
            const files = this.data.files;
            let _groups = {};
            this.data.files.forEach(f => {
                Object.keys(f.config).forEach(key => {
                    let name                     = key.replace('program:', '');
                    _groups[ name ]              = f.config[ key ];
                    _groups[ name ].hasProcesses = false;
                    _groups[ name ].name         = name;
                    _groups[ name ].processes    = [];
                    _groups[ name ].configs      = [];
                });
            });
            Object.entries(groupBy(this.data.processes, 'group')).forEach(([ group, processes ]) => {
                _groups[ group ].hasProcesses = processes.length > 0;
                _groups[ group ].processes    = processes;
            });
            Object.entries(groupBy(this.data.configs, 'group')).map(([ group, configs ]) => {
                _groups[ group ].configs = configs;
            });
            let groups = Object.values(_groups);
            return groups;
        });
    }

    async get<T = any, R = AxiosResponse<T>, D = any>(url: string, config: AxiosRequestConfig<D> = {}): Promise<R> {
        return this.axios.get('/api' + url, merge({ headers: this.auth.authHeader() }, config));
    }

    async post<T = any, R = AxiosResponse<T>, D = any>(url: string, data?: D, config: AxiosRequestConfig<D> = {}): Promise<R> {
        return this.axios.post('/api' + url, data, merge({ headers: this.auth.authHeader() }, config));
    }


    async updateStatus() {
        const response = await this.get<StatusResponse>('/status');
        Object.entries(response.data).forEach(([ key, value ]) => {
            if ( this.data[ key ] !== value ) {
                this.data[ key ] = value;
            }
        });
        return true;
    }

    async full(): Promise<FullResponse> {
        const response = await this.get('/full');
        return response.data;
    }

    async status(): Promise<StatusResponse> {
        const response = await this.get('/status');
        return response.data;
    }

    async reload() {
        const res = await this.get(`/reload`);
        return res.data;
    }


    async restart() {
        const res = await this.get(`/restart`);
        return res.data;
    }


    async shutdown() {
        const res = await this.get(`/shutdown`);
        return res.data;
    }


    async addProcessGroup(name: string) {
        const res = await this.get(`/add-process-group/${name}`);
        return res.data;
    }

    async removeProcessGroup(name: string) {
        const res = await this.get(`/remove-process-group/${name}`);
        return res.data;
    }

    async startProcessGroup(name: string) {
        const res = await this.get(`/start-process-group/${name}`);
        return res.data;
    }

    async startProcess(name: string) {
        const res = await this.get(`/start-process/${name}`);
        return res.data;
    }

    async stopProcess(name: string) {
        const res = await this.get(`/stop-process/${name}`);
        return res.data;
    }

    async stopAllProcesses() {
        const res = await this.get(`/stop-all-processes`);
        return res.data;
    }

    async startAllProcesses() {
        const res = await this.get(`/start-all-processes`);
        return res.data;
    }

    async readLog(offset: number, length: number) {
        const res = await this.get(`/log/${offset}/${length}`);
        return res.data;
    }

    async readProcessStdoutLog(name: string, offset: number, length: number) {
        const res = await this.get(`/process-out-log/${name}/${offset}/${length}`);
        return res.data;
    }

    async readProcessStderrLog(name: string, offset: number, length: number) {
        const res = await this.get(`/process-err-log/${name}/${offset}/${length}`);
        return res.data;
    }

    async fileExists(path: string) {
        const res = await this.get(`/files/exists/${encodeURIComponent(path)}`);
        return res.data.exists;
    }

    async link(path: string, filename: string) {
        const res = await this.post('/files/link', { path, filename });
        return res.status;
    }

    async create(filename: string, content: string) {
        const res = await this.post('/files/config', { content, filename });
        return res.status;
    }
    async delete(filename: string) {
        const res = await this.post('/files/delete', { filename });
        return res.status;
    }

    findConfigForGroup(group: string) {
        let config = this.data.files.find(f => {
            return Object.keys(f.config).map(key => strStripLeft(key, 'program:')).find(k => k === group) !== undefined;
        });
        return config;
    }


    async updateConfig() {
        const response   = await this.get<{ config: any, files: any }>('/files/config');
        this.data.config = response.data.config;
        this.data.files  = response.data.files;
        return true;
    }

    async saveConfig(group: string, content: any) {
        const data = typeof content === 'string' ? content : String(content);
        const res  = await this.post(`/files/config/${group}`, data, {
            headers: {
                'Content-Type': 'text/plain',
            },
        });
        return res.data;
    }

}
