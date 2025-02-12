import { defaults } from '@radicjs/utils';
import type { AxiosInstance, CreateAxiosDefaults } from 'axios';
import Axios from 'axios';
import type { App } from 'vue';


export default function axiosPlugin(options:CreateAxiosDefaults={}){
    options = defaults(options, {
       baseURL: 'http://localhost:3046',
    });
    const instance = Axios.create(options);
    console.log('axiosPlugin')
    return {
        install(app: App){
            app.provide('axios', instance);
        }
    }
}

export function useAxios():AxiosInstance{
    return inject('axios') as typeof Axios;
}
