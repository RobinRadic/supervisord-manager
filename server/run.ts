import {config} from 'dotenv';
import { fileURLToPath } from 'node:url';
import {dirname ,join} from 'path';
import { Server } from './Server.js';

const _dirname = dirname(fileURLToPath(import.meta.url))

config({
    debug:true,
path:join(_dirname,'..','.env')
})

async function run() {

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
    const state  = await di.supervisor.state();
    await di.supervisor.api.reloadConfig();
    const log2 = await di.supervisor.api.readLog(- 1000, 0);
    const log  = await di.supervisor.api.readProcessStdoutLog('supervisor-rest-server:supervisor-rest-server_00', - 1000, 0);
    return { ...state, log };
}

run();
