import { defaults } from '@radicjs/utils';
import cors from 'cors';
import express from 'express';
import { SupervisordClient, SupervisordClientOptions } from 'node-supervisord';
import { Container } from './Container.js';
import { attachControllers, ERROR_MIDDLEWARE } from './decorators';
import { ErrorMiddleware } from './middleware/ErrorMiddleware.js';
import { LogRequestMiddleware } from './middleware/LogRequestMiddleware.js';
import { Supervisor } from './services/Supervisor.js';
import { SupervisorFiles } from './services/SupervisorFiles.js';

import bodyParser from 'body-parser';

export interface SupervisorClientConfiguration extends SupervisordClientOptions {
    host: string;
}

export interface Configuration {
    port?: number;
    supervisor?: {
        client?: SupervisorClientConfiguration;
        server?: {
            configurationFilePath?: string;
        }
    };
    allowed_ips?:string[]
    users?:Array<{name:string,email:string,password:string}>
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
        });
        this.di.bind('config').toConstantValue(options);
        this.di.bind('app').toConstantValue(express()).onActivation((ctx, app: express.Express) => {
            app.use(ctx.container.get('router'));
            app.use(cors());
            app.use(bodyParser.text());
            app.use(bodyParser.json());
            app.use(bodyParser.urlencoded({ extended: true }));
            app.set('trust proxy', true)
            return app;
        });
        this.di.bind('router').toConstantValue(express.Router());
        this.di.bind(Supervisor).toSelf().inSingletonScope();
        this.di.bind(SupervisorFiles).toSelf().inSingletonScope().onActivation((ctx, config: SupervisorFiles) => {
          config.reload()
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

    async start() {
        await attachControllers(this.di.app, Server.controllers);

        this.di.app.listen(this.di.config.port, () => {
            console.log('Server is running on port ' + this.di.config.port);
        });
    }
}
