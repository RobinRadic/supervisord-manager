import express from 'express';
import { Container as BaseContainer } from 'inversify';
import { SupervisordClient } from 'node-supervisord';
import type { Configuration } from './Server.js';
import { Supervisor } from './services/Supervisor.js';
import { SupervisorFiles } from './services/SupervisorFiles.js';


export class Container extends BaseContainer {
    protected static _instance: Container;
    public static get instance(): Container {
        if ( !this._instance ) {
            this._instance = new Container();
        }
        return this._instance;
    }

    protected constructor() {
        super();

    }

    get app(): express.Express {return this.get('app');}

    get config(): Configuration {return this.get('config');}

    get router(): express.Router {return this.get('router');}

    get supervisor(): Supervisor {return this.get(Supervisor);}

    get supervisorConfig(): SupervisorFiles {return this.get(SupervisorFiles);}

    get supervisordClient(): SupervisordClient {return this.get(SupervisordClient);}
}

