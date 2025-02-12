import { useAxios } from '@/plugins/axios.js';

import { Supervisor } from './Supervisor.js';

let supervisor: Supervisor;

export function useSupervisor():Supervisor {
    if ( supervisor ) return supervisor;
    const axios            = useAxios();
    supervisor             = new Supervisor(axios);
    window[ 'supervisor' ] = supervisor;
    return supervisor;
}
