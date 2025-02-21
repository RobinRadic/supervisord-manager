import { run } from '../run.js';

export default run(import.meta.url, app => {
    app.program.name('serve')
       .option('-p, --port', 'Use a specific port')
       .action(function (opts) {
            this.out.success('serve')
       });
});
