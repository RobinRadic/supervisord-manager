import { objectify, strStripLeft } from '@radicjs/utils';
import { promises as fs, writeFileSync } from 'fs';
import { globby } from 'globby';
import { parse } from 'ini';
import {dirname,join } from 'path';
import shelljs from 'shelljs';
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
    configDir:string

    async canAccess(path:string, type:number){
        try {
            let res = await fs.access(path, type)
            return true;
        } catch (e) {
            return false
        }
    }

    async canWriteTo(path:string){
        return this.canAccess(path, fs.constants.W_OK)
    }

    async isVisible(path:string){
        return this.canAccess(path, fs.constants.F_OK)
    }

    async canReadFrom(path:string){
        return this.canAccess(path, fs.constants.R_OK)
    }

    async configFileExists(filename:string){
        return this.canReadFrom(join(this.configDir, filename));
    }

    async link(path:string, filename:string){
        if(await this.configFileExists(filename)){
            throw new Error(`Config file [${filename}] already exists`)
        }
        if(!await this.canReadFrom(path)){
            throw new Error(`Cannot read from source path [${path}]`)
        }
        let result = shelljs.ln('-s',path,join(this.configDir,filename))

        return result.code === 0;
    }
    async create( filename:string, content:string){
        if(await this.configFileExists(filename)){
            throw new Error(`Config file [${filename}] already exists`)
        }
        writeFileSync(join(this.configDir,filename), content,  'utf-8')
        return true;
    }
    async delete( filename:string ){
        if(!await this.configFileExists(filename)){
            throw new Error(`Config file [${filename}] does not exists`)
        }
        shelljs.rm('-f',join(this.configDir,filename))
        return true;
    }

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
        return true
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
        this.configDir = dirname(globs[0]);
        const paths             = await globby(globs);
        this.files             = await Promise.all(paths.map(async path => {
            const content = await fs.readFile(path, 'utf8');
            const config  = parse(content);
            return { path, config,content };
        }));
        // this.files              = files.map(({ path, config }) => [ path, config ]).reduce(objectify, {});
    }
}
