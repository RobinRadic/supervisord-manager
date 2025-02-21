import { run } from '../run.js';

export default run(import.meta.url, app => {
    app.program.name('supervisord-monitor')
       .executableDir(import.meta.url)
       .addSubCommand('install', 'Install as systemd service')
       .addSubCommand('uninstall', 'Uninstall from systemd')
       .addSubCommand('serve', 'Start the server')
    ;
});
