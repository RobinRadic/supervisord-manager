import { start } from '../../server/index.js';
import { run } from '../run.js';

export default run(import.meta.url, app => {
    app.program.name('serve')
       .option('-p, --port <port>', 'Use a specific port',process.env.SERVER_PORT)
       .action(function (opts) {
           if(opts.port){
               process.env.SERVER_PORT = opts.port
           }
           import('../../server/start.ts')
       });
});
