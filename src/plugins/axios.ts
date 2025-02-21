import { defaults } from '@radicjs/utils';
import type { AxiosInstance, CreateAxiosDefaults } from 'axios';
import Axios from 'axios';

declare const __SERVER_PORT__: number;

export default function axiosPlugin(options:CreateAxiosDefaults={}){
    options = defaults(options, {
       baseURL: 'http://localhost:' + __SERVER_PORT__,
    });
    const instance = Axios.create(options);
    console.log('axiosPlugin')
    return {
        install(app: any){
            app.provide('axios', instance);
        }
    }
}

export function useAxios():AxiosInstance{
    return inject('axios') as AxiosInstance;
}
