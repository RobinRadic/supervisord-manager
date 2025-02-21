import { readFileSync } from 'fs';
import { run } from '../run.js';
import { set } from '@radicjs/utils';
import {resolve } from 'path';

export default run(import.meta.url, app => {
    app.program
       .name('serve')
       .option('-p, --port <port>', 'Use a specific port', process.env.SERVER_PORT)
       .option('--host <host>', 'Use a specific host', '127.0.0.1')
       .option('--rpc-host <hostname>', '', 'http://localhost:9005')
       .option('--rpc-username <username>', '')
       .option('--rpc-password <password>', '')
       .option('--supervisor-config-path <path>', '', '/etc/supervisor/supervisord.config')
       .option('--admin-email <email>', '', 'admin@admin.com')
       .option('--admin-password <password>', '', 'test')
       .option('--admin-name <name>', '', 'Admin')
       .option('--config <path>', 'Path to config.json')
       .action(function (opts:any) {
           let config = {}
           if ( opts.port ) set(config,'port',opts.port)
           if ( opts.host ) set(config,'host',opts.host)
           if ( opts.rpcHost ) set(config,'supervisor.client.host', opts.rpcHost)
           if ( opts.rpcUsername ) set(config,'supervisor.client.username', opts.rpcUsername)
           if ( opts.rpcPassword ) set(config,'supervisor.client.password', opts.rpcPassword)
           if ( opts.supervisorConfigPath ) set(config,'supervisor.server.configurationFilePath', opts.supervisorConfigPath)
           if ( opts.adminEmail ) set(config,'users.0.email', opts.adminEmail)
           if ( opts.adminPassword ) set(config,'users.0.password', opts.adminPassword)
           if ( opts.adminName ) set(config,'users.0.name', opts.adminName)
           if ( opts.config ){
               config = JSON.parse(readFileSync(resolve(opts.config),'utf-8'));
           }
           import('../../server/index.js').then(r => r.start(config));
       });
});
