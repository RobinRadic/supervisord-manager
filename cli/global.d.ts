import type { Env } from '../shared/env.js';


declare global {
    namespace NodeJS {
        interface ProcessEnv extends Env {}
    }
}
