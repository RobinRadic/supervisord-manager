import { Env } from '../shared/env.js';
import { Systemd } from './Systemd.js';

declare module '@radicjs/command' {

    interface ApplicationBindings {
        systemd: Systemd;
        dotenv: Env;
    }
}
export {};
