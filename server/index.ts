import { merge } from '@radicjs/utils';
import { config as dotenv } from 'dotenv';
import findupSync from 'findup-sync';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'node:url';
import { dirname } from 'path';
import { ApiController } from './controllers/ApiController.js';
import { ApiFilesController } from './controllers/ApiFilesController.js';
import { RootController } from './controllers/RootController.js';
import { type Configuration, Server } from './Server.js';

const _dirname = dirname(fileURLToPath(import.meta.url));

export async function start(config: Configuration = {}) {
    let configData = {};
    let configPath = findupSync('config.json', { cwd: _dirname });
    if ( configPath ) {
        configData = JSON.parse(readFileSync(configPath, 'utf-8'));
    }

    let dotEnvPath = findupSync('.env', { cwd: _dirname });
    if ( dotEnvPath ) {
        dotenv({
            // debug: true,
            path: dotEnvPath,
        });
    }

    Server.registerControllers([
        RootController,
        ApiController,
        ApiFilesController,
    ]);
    Server.beforeListen.push(({ app, config }) => {
        app.all('*', (req, res) => {
            const data = {
                title: 'Supervisord Manager',
                server_port: config.port,
            };
            res.render('index', data);
        });
    });
    return Server.run(merge({
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
    }, configData, config));
}
