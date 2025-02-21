import { useStorage } from '@vueuse/core';
import { RemovableRef } from '@vueuse/shared';
import type { AxiosInstance } from 'axios';
import type { User } from '../../shared/api.js';
import { useAxios } from './axios.js';
import type { LoginResponseData, MeResponseData } from './supervisor/index.js';

export class Auth {
    public loggedIn: RemovableRef<boolean>;
    public user: RemovableRef<User>;

    constructor(
        private axios: AxiosInstance,
    ) {

        this.user     = useStorage('user', {}) as any;
        this.loggedIn = computed(() => this.user?.value?.accessToken !== undefined);
    }

    authHeader() {
        let user = this.user.value;
        if ( user && user.accessToken ) {
            return { 'x-access-token': user.accessToken };
        } else {
            return {};
        }
    }

    async me() {
        const res = await this.axios.get<MeResponseData>('/me', { headers: this.authHeader() });
        return res.data;
    }

    async login(email: string, password: string) {
        const res = await this.axios.post<LoginResponseData>('/login', { email, password }, { withCredentials: true });
        if ( res.data.success ) {
            this.user.value = res.data.user;
        } else {
            this.user.value = null;
        }
        return res.data;
    }

    logout() {
        this.user.value = null;
    }


}

let auth: Auth;

export function useAuth(): Auth {
    let axios = useAxios();
    if ( !auth ) {
        auth = new Auth(axios);
    }
    window[ 'auth' ] = auth;
    return auth;
}
