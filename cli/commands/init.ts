import { writeFileSync } from 'fs';
import { join } from 'path';
import shelljs from 'shelljs';
import { run } from '../run.js';

export default run(import.meta.url, app => {
    app.program.name('install')

       .action(function (opts) {
           let configTemplate = `{
    "port": 4035,
    "supervisor": {
        "client": {
            "host": "http://localhost:9005",
            "username": "<username>",
            "password": "<password>"
        },
        "server": {
            "configurationFilePath": "/etc/supervisor/supervisord.conf"
        }
    },
    "users": [
        {"name": "Admin","email": "admin@admin.com","password": "test1234"}
    ]
}`;
           let configOutputPath = join(process.cwd(), 'config.json');
           writeFileSync(configOutputPath, configTemplate, 'utf-8');
           this.out.success(`Generated {bold config.json}`);


           const nodePath   = shelljs.which('node').toString();
           let serviceTemplate     = `
[Unit]
Description=supervisord-monitor
Documentation=https://github.com/robinradic/supervisord-monitor

[Service]
Type=simple
ExecStart=${nodePath} ${app.path.app('bin/supervisord-monitor.mjs')} serve --config ${process.cwd()}/config.json --no-interaction --silent
WorkingDirectory=${app.path.app()}

#User=nobody
#Group=nogroup
Restart=on-failure

[Install]
WantedBy=multi-user.target
       `;
           const serviceOutputPath = join(process.cwd(), 'supervisord-monitor.service');
           writeFileSync(serviceOutputPath, serviceTemplate, 'utf-8');
           this.out.success(`Generated {bold supervisord-monitor.service}`);


           const installTemplate = `#!/usr/bin/env bash
SERVICE=supervisord-monitor
MYDIR=$( cd "$( dirname "\${BASH_SOURCE[0]}" )" && pwd )

# link the service file into the systemd config
echo "sudo ln -s \${MYDIR}/supervisord-monitor.service /lib/systemd/system/supervisord-monitor.service"
sudo ln -s \${MYDIR}/supervisord-monitor.service /lib/systemd/system/supervisord-monitor.service

# Reload the daemon so it knows about the new file
echo "sudo systemctl daemon-reload"
sudo systemctl daemon-reload

# Enable our new service
echo "sudo systemctl enable $SERVICE"
sudo systemctl enable $SERVICE

# Start the service
echo "sudo systemctl start $SERVICE"
sudo systemctl start $SERVICE
           `;
           const installOutputPath = join(process.cwd(), 'install.sh');
           writeFileSync(installOutputPath, installTemplate, 'utf-8');
           this.out.success(`Generated {bold install.sh}`);

           this.out.success(`All done!`);

       });

});
