import type { AxiosInstance } from 'axios';
import type { Group } from '../../shared/api.js';
import { useAxios } from './axios.js';
import type { MeResponseData } from './supervisor/index.js';

export class Auth {
    public loggedIn: ComputedRef<Group[]>;
    public user: Ref<{ email: string, name: string }>;

    constructor(
        private axios: AxiosInstance,
    ) {

        this.user     = ref(null);
        this.loggedIn = computed(() => !!this.user?.value?.email);
    }

    async me() {
        const res = await this.axios.get<MeResponseData>('/me');
        if ( res.data.success ) {
            this.user.value = res.data.user;
        }
        return res.data;
    }

    async login(email: string, password: string) {
        const res = await this.axios.post('/login', { email, password },{withCredentials:true});
        if ( res.data.success ) {
            this.user.value = res.data.user;
        }
        return res.data;
    }

    async logout() {
        const res       = await this.axios.get('/logout');
        this.user.value = null;
        return res.data;
    }


}

let auth: Auth;

export function useAuth():Auth {
    let axios = useAxios();
    if ( !auth ) {
        auth = new Auth(axios);
    }
    window['auth'] = auth;
    return auth;
}
