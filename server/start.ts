import { config } from 'dotenv';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'path';
import { FileController } from './controllers/FileController.js';
import { RootController } from './controllers/RootController.js';
import { Server } from './Server.js';

const _dirname = dirname(fileURLToPath(import.meta.url))

config({
    debug:true,
    path:join(_dirname,'..','.env')
})

Server.registerControllers([
    RootController,
    FileController
]);

Server.run({
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
});
