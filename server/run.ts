import { Server } from './Server.js';

const server = Server.create({

})
const di = server.di

async function run(){
const state = await di.supervisor.state();
await    di.supervisor.api.reloadConfig()
const log2 = await di.supervisor.api.readLog(-1000,0);
const log = await di.supervisor.api.readProcessStdoutLog('supervisor-rest-server:supervisor-rest-server_00',-1000,0);
return {...state, log}
}

run()
