import 'reflect-metadata';
import { gopts, run as _run } from '@radicjs/command';
import { configDotenv } from 'dotenv';
import { Systemd } from './Systemd.js';

export const run: typeof _run = (dirname, cb) => {
    // either clear all options
    // gopts.clearOptions();
    // or remove some options
    // gopts.removeOption('json');
    gopts.removeOption('verbose');

    // then add some options. the GlobalOptionsCommand has this helper method to add the global options
    gopts.add('-v, --version', 'output the version number', false)
         .conflicts('V')
         .callback((value, option, command, app) => {
             if ( value === true ) {
                 console.log(app.version);
                 process.exit(0);
             }
         });

    return _run(dirname, async app => {
        const dotenv = configDotenv({
            path: app.path.app('.env'),
        }).parsed;
        app.set('dotenv',dotenv)
        app.bind('dotenv')
        app.set(Systemd).to(Systemd);
        app.bind('systemd', Systemd);
        await cb(app);
        app.program.updateGlobalOptions();
    });
};
