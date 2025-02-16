import 'dotenv/config'
import { FileController } from './controllers/FileController.js';
import { RootController } from './controllers/RootController.js';
import { Server } from './Server.js';

Server.registerControllers([
    RootController,
    FileController
]);

Server.run({
    port: parseInt(process.env.SERVER_PORT),
    supervisor: {
        client: {
            host: process.env.SUPERVISOR_HOST,
            username: process.env.SUPERVISOR_USERNAME,
            password: process.env.SUPERVISOR_PASSWORD,
        },
        server: {
            configurationFilePath: process.env.SUPERVISOR_CONFIG_PATH,
        },
    },
});
