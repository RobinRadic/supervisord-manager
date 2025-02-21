import shelljs from 'shelljs';
import { run } from '../run.js';
import { writeFileSync } from 'fs';

export default run(import.meta.url, app => {
    app.program.name('install')

       .action(function (opts) {
           const nodePath = shelljs.which('node').toString()
       let template = `
[Unit]
Description=supervisord-monitor
Documentation=https://github.com/robinradic/supervisord-monitor

[Service]
Type=simple
ExecStart=${nodePath} ${app.path.app('bin/supervisord-monitor.mjs')} serve --no-interaction --silent
WorkingDirectory=${app.path.app()}

#User=nobody
#Group=nogroup
Restart=on-failure

[Install]
WantedBy=multi-user.target
       `
           const outputPath=app.path.app('supervisord-monitor.service');
           writeFileSync(outputPath,template, 'utf-8');
           this.out.success(`File written to ${outputPath}`)

       });

});
