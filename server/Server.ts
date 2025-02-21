import { defaults } from '@radicjs/utils';

import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import session from 'express-session';
import findupSync from 'findup-sync';
import { SupervisordClient, SupervisordClientOptions } from 'node-supervisord';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { join } from 'path';
import createFilestore from 'session-file-store';
import { Container } from './Container.js';
import { attachControllers, ERROR_MIDDLEWARE } from './decorators';
import { ErrorMiddleware } from './middleware/ErrorMiddleware.js';
import { Supervisor } from './services/Supervisor.js';
import { SupervisorFiles } from './services/SupervisorFiles.js';

const _dirname = dirname(fileURLToPath(import.meta.url));
const rootDir  = dirname(findupSync('package.json', { cwd: _dirname }));
export interface SupervisorClientConfiguration extends SupervisordClientOptions {
    host: string;
}

export interface Configuration {
    port?: number;
    supervisor?: {
        client?: {
            host?:string
            username?:string
            password?:string
        };
        server?: {
            configurationFilePath?: string;
        }
    };
    secret?: string;
    allowed_ips?: string[];
    users?: Array<{ name: string, email: string, password: string }>;
}

export class Server {
    protected static controllers: any[] = [];
    public readonly di: Container;

    constructor(options: Configuration = {}) {
        this.di = Container.instance;
        options = defaults(options, {
            port: 3035,
            supervisor: {
                client: {
                    host: 'http://127.0.0.1:9005',
                    username: '',
                    password: '',
                },
                server: {
                    configurationFilePath: '/etc/supervisor/supervisord.conf',
                },
            },
            secret: 'foobar',
            users: [],
        });
        this.di.bind('config').toConstantValue(options);
        this.di.bind('app').toConstantValue(express()).onActivation((ctx, app: express.Express) => {
            app.use(ctx.container.get('router'));
            app.use(cors({
                origin: [
                    'http://localhost:3000',
                    'http://localhost:' + options.port,
                ],
                credentials: true,
            }));
            app.use(cookieParser());
            app.use(bodyParser.text());
            app.use(bodyParser.json());
            app.use(bodyParser.urlencoded({ extended: true }));
            app.set('trust proxy', true);
            app.use('/assets', express.static(join(rootDir, 'dist/frontend/assets')));
            app.set('views', join(_dirname, 'views'));
            app.set('view engine', 'hbs');
            app.use(express.urlencoded({ extended: true }));
            const Filestore = createFilestore(session);

            app.use((req, res, next) => {
                res.header('Access-Control-Allow-Headers', 'x-access-token, Origin, Content-Type, Accept');
                next();
            });
            return app;
        });
        this.di.bind('router').toConstantValue(express.Router());
        this.di.bind(Supervisor).toSelf().inSingletonScope();
        this.di.bind(SupervisorFiles).toSelf().inSingletonScope().onActivation((ctx, config: SupervisorFiles) => {
            config.reload();
            return config;
        });
        this.di.bind(SupervisordClient).toDynamicValue(ctx => {
            const config: Configuration = ctx.container.get('config');
            let { host, ...options }    = config.supervisor.client;
            return new SupervisordClient(host, options);
        }).inSingletonScope();
        this.di.bind(ERROR_MIDDLEWARE).to(ErrorMiddleware);
    }

    static create(options: Configuration = {}): Server {
        return new Server(options);
    }

    static async run(options: Configuration = {}): Promise<void> {
        return this.create(options).start();
    }

    static registerControllers(controllers: any[]) {
        this.controllers.push(...controllers);
        return this;
    }

    static beforeListen:Array<(di:Container)=>any> = [];

    async start() {
        await attachControllers(this.di.app, Server.controllers);
        Server.beforeListen.forEach(cb => cb(this.di));
        this.di.app.listen(this.di.config.port, () => {
            console.log('Server is running on port ' + this.di.config.port);
        });
    }
}
