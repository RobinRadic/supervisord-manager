import type { Env } from '../shared/env.js';
import type { Systemd } from './Systemd.js';

declare module '@radicjs/command' {

    interface ApplicationBindings {
        systemd: Systemd;
        dotenv: Env;
    }
}
export {};
