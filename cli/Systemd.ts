import { type App, exec, ExecOptions, inject, injectable } from '@radicjs/command';
import { isArray, isNumber } from '@radicjs/utils';

@injectable()
 class Systemd {
    command = 'sudo systemctl';
    @inject('app') app: App;

    execRaw(command: string | string[], options: ExecOptions = {}) {
        command = this.command + ' ' + (isArray(command) ? command.join(' ') : command);
        try {
            const result = exec(command, {
                silent: true,
                ...options,
            });
            return result.stdout;
        } catch (e) {
            // this.app.log.error(e,`Systemd exec: ${command}`);
            e.message = `Systemd exec: ${command}`;
            throw e;
        }
    }

    exec(command: string | string[], options: ExecOptions = {}) {
        return this.execRaw(command, options).toString();
    }

    run(command: string, name: string, options: ExecOptions = {}) {
        return this.execRaw([ command, name ], options).toString();
    }

    all(filter = '.service'): string[] {
        return this.exec('list-units')
                   .split('\n')
                   .slice(1)
                   .map(l => l.trim().split(' ')[ 0 ])
                   .filter(s => s.endsWith(filter));
    }

    reload(name: string, force = false) {
        return this.exec([
            force ? 'force-reload' : 'reload',
            name,
        ]);
    }


    restart(name: string) {return this.exec([ 'restart', name ]); }

    start(name: string) {return this.exec([ 'start', name ]); }

    stop(name: string) {return this.exec([ 'stop', name ]); }

    status(name: string): Systemd.Status {
        return parseSystemdStatus(this.exec([ 'status', name ]));
    }

    show(name: string): Systemd.Show {
        return parseSystemdShow(this.exec([ 'show', name ]));
    }

    isStarted(name: string) {
        let status = this.status(name);
        return isNumber(status.mainPID) && status.active.startsWith('active');
    }
}

namespace Systemd {

    export interface ProcessInfo {
        pid: number;
        command: string;
    }

    export interface Status {
        name: string | null;
        unit: string | null;
        description: string | null;
        loaded: string | null;
        active: string | null;
        status: string | null;
        mainPID: number | null;
        memory: string | null;
        cgroup: string | null;
        processes: ProcessInfo[];
        logs: string[];
    }

    export interface Show {
        [ key: string ]: string | number | boolean | Show | ParsedExecEntry;

        ExecStart?: ParsedExecEntry;
        ExecStartEx?: ParsedExecEntry;
        ExecStartPost?: ParsedExecEntry;
        ExecStartPostEx?: ParsedExecEntry;
        ExecReload?: ParsedExecEntry;
        ExecReloadEx?: ParsedExecEntry;
        ExecStopPost?: ParsedExecEntry;
        ExecStopPostEx?: ParsedExecEntry;

    }

    export type ParsedExecEntry = {
        path?: string;
        argv?: string[];
        ignore_errors?: string;
        start_time?: string;
        stop_time?: string;
        pid?: number;
        code?: string | null;
        status?: string;
        flags?: string;
    };

}


const parseSystemdShow = (input: string): Systemd.Show => {

    function parseLine(line: string): [ string, string ] | null {
        const regex = /^([^=]+)=(.*)$/;
        const match = line.match(regex);
        if ( match ) {
            return [ match[ 1 ].trim(), match[ 2 ].trim() ];
        }
        return null;
    }

    const lines                   = input.split('\n').filter(line => line.trim().length > 0);
    const result: Systemd.Show    = {};
    let currentKey: string | null = null;
    let currentValue: string[]    = [];

    lines.forEach(line => {
        const parsed = parseLine(line);
        if ( parsed ) {
            let [ key, value ] = parsed;

            if ( key.startsWith('Exec') && value.includes('path=') ) {
                const entry: Systemd.ParsedExecEntry = {};

                // Split the value into key-value pairs
                const pairs = value
                .replace(/^\{/, '')
                .replace(/\}$/, '')
                .trim()
                .split(' ; ');
                for ( const pair of pairs ) {
                    const [ entryKey, entryValue ] = pair.split('=', 2);

                    if ( entryKey === 'argv[]' ) {
                        entry.argv = entryValue?.split(' ');
                    } else if ( entryKey === 'pid' ) {
                        entry.pid = Number(entryValue);
                    } else if ( entryKey ) {
                        entry[ entryKey.trim() as any ] = entryValue?.trim() as any;
                    }
                }
                result[ key ] = entry;
            } else if ( key.endsWith('Ex') || key.endsWith('Post') || key.endsWith('Start') || key.endsWith('Stop') ) {
                if ( currentKey === key ) {
                    currentValue.push(value);
                } else {
                    if ( currentKey ) {
                        result[ currentKey ] = currentValue.join('; ');
                    }
                    currentKey   = key;
                    currentValue = [ value ];
                }
            } else {
                if ( currentKey ) {
                    result[ currentKey ] = currentValue.join('; ');
                }
                currentKey   = key;
                currentValue = [ value ];
            }
        }
    });

    if ( currentKey ) {
        result[ currentKey ] = currentValue.join('; ');
    }

    return result;
};

const parseSystemdStatus = (statusOutput: string): Systemd.Status => {
    const result: Systemd.Status = {
        name: null,
        unit: null,
        description: null,
        loaded: null,
        active: null,
        status: null,
        mainPID: null,
        memory: null,
        cgroup: null,
        processes: [],
        logs: [],
    };

    const lines = statusOutput.split('\n');

    lines.forEach((line) => {
        const trimmed = line.trim();

        // Parse the main fields
        if ( trimmed.startsWith('●') ) {
            // Parse Unit and Description
            const match = trimmed.match(/●\s+([^\s]+)\s+-\s+(.*)/);
            if ( match ) {
                result.unit        = match[ 1 ];
                result.description = match[ 2 ];
                result.name        = match[ 1 ].replace(/.service$/, '');
            }
        } else if ( trimmed.startsWith('Loaded:') ) {
            result.loaded = trimmed.slice(7).trim();
        } else if ( trimmed.startsWith('Active:') ) {
            result.active = trimmed.slice(7).trim();
        } else if ( trimmed.startsWith('Status:') ) {
            result.status = trimmed.slice(7).trim();
        } else if ( trimmed.startsWith('Main PID:') ) {
            const match = trimmed.match(/Main PID:\s+(\d+)/);
            if ( match ) {
                result.mainPID = parseInt(match[ 1 ], 10);
            }
        } else if ( trimmed.startsWith('Memory:') ) {
            result.memory = trimmed.slice(7).trim();
        } else if ( trimmed.startsWith('CGroup:') ) {
            result.cgroup = trimmed.slice(7).trim();
        } else if ( trimmed.startsWith('└─') ) {
            // Parse processes under CGroup
            const processMatch = trimmed.match(/└─(\d+)\s+(.+)/);
            if ( processMatch ) {
                result.processes.push({
                    pid: parseInt(processMatch[ 1 ], 10),
                    command: processMatch[ 2 ],
                });
            }
        } else if ( trimmed.startsWith('Logs begin') ) {
            // Parse log lines
            result.logs.push(trimmed);
        } else if ( trimmed.startsWith(' ') ) {
            // Parse additional log entries
            result.logs.push(trimmed);
        }
    });

    return result;
};

export {Systemd}
