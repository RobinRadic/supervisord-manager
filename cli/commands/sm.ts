import { run } from '../run.js';

export default run(import.meta.url, app => {
    app.program.name('supervisord-monitor')
       .executableDir(import.meta.url)
       .addSubCommand('init', 'Install as systemd service')
       .addSubCommand('serve', 'Start the server')
    ;
});
