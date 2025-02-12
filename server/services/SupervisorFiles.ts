import { objectify, strStripLeft } from '@radicjs/utils';
import { promises as fs } from 'fs';
import { globby } from 'globby';
import { parse } from 'ini';
import { inject, injectable } from 'inversify';
import type { ConfigResponse } from '../../shared/api.js';
import type { Configuration } from '../Server.js';

async function  canWriteTo(path: string):Promise<boolean>{
    try {
        let res = await fs.access(path, fs.constants.W_OK)
        return true;
    } catch (e) {
        return false
    }
}

@injectable()
export class SupervisorFiles {
    @inject('config') protected _config: Configuration;

    config: any                = {};
    files: {path:string,config:object,content:string}[]= [];
    loaded:boolean             = false;


    findConfigForGroup(group: string) {
        let config = this.files.find(f => {
            return Object.keys(f.config).map(key => strStripLeft(key, 'program:')).find(k => k === group) !== undefined
        })
        return config;
    }

    async saveConfig(group: string, content: any) {
        let config = this.findConfigForGroup(group);
        if(!config) throw new Error(`No config found for group ${group}`);
        if(!await canWriteTo(config.path)) throw new Error(`No write access to ${config.path}`);
        await fs.writeFile(config.path,content,'utf8')
        await this.reload()
        return {success:true}
    }

    // get directoryPaths():string[]{return this.config.supervisor.server.configurationDirectoryPaths    }
    get filePath(): string {return this._config.supervisor.server.configurationFilePath; }

    async getAllConfig():Promise<ConfigResponse>{
        await this.reload()
        return {
            config: this.config,
            files: this.files
        } as any
    }

    async reload() {
        const configFileContent = await fs.readFile(this.filePath, 'utf8');
        this.config             = parse(configFileContent);
        const globs             = this.config.include.files.split(' ');
        const paths             = await globby(globs);
        this.files             = await Promise.all(paths.map(async path => {
            const content = await fs.readFile(path, 'utf8');
            const config  = parse(content);
            return { path, config,content };
        }));
        // this.files              = files.map(({ path, config }) => [ path, config ]).reduce(objectify, {});
    }
}
