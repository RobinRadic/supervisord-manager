import {config} from 'dotenv';
import { groupBy } from 'lodash-es';
import { fileURLToPath } from 'node:url';
import {dirname ,join} from 'path';
import { Server } from './Server.js';

const _dirname = dirname(fileURLToPath(import.meta.url))

config({
    debug:true,
path:join(_dirname,'..','.env')
})

async function run() {
let encodedPath = encodeURIComponent(_dirname);
    const config = {
        port: parseInt(process.env.SERVER_PORT),
        supervisor: {
            client: {
                host: process.env.SUPERVISOR_RPC_HOST,
                username: process.env.SUPERVISOR_RPC_USERNAME,
                password: process.env.SUPERVISOR_RPC_PASSWORD,
            },
            server: {
                configurationFilePath: process.env.SUPERVISOR_CONFIG_PATH,
            },
        },
    };
    const server = Server.create(config);
    const di     = server.di;
    const state  = await di.supervisor.status();
    const configs  = await di.supervisor.fs.getAllConfig();
    let groups = {}
    configs.files.forEach(f => {
        Object.keys(f.config).forEach(key => {
            let name = key.replace('program:','')
            groups[name] = f.config[key]
            groups[name].hasProcesses = false;
            groups[name].name = name;
        })
    })
    Object.entries(groupBy(state.processes,'group')).forEach(([group, processes]) => {
        groups[group].hasProcesses = processes.length > 0
        groups[group].processes = processes
    })
    Object.entries(groupBy(state.configs,'group')).map(([group, configs]) => {
        groups[group].configs = configs;
    })
    let result = Object.values(groups);
    return { ...state,groups };
}

run();
