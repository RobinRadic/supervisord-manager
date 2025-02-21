import { type AlertCreateFn, useAlerts } from '@/composables/useAlerts.js';
import { useLoaderDialog } from '@/composables/useLoaderDialog.js';
import type { Supervisor } from '@/plugins/supervisor/Supervisor.js';
import { useSupervisor } from '@/plugins/supervisor/useSupervisor.js';
import { strStripLeft } from '@radicjs/utils';
import { useConfirmDialog } from '../../composables/useConfirmDialog.js';

export function useSupervisorActionHandler() {
    const supervisor = useSupervisor();
    const [_,createAlert] = useAlerts()
    return new SupervisorActionHandler(
        supervisor,
        useLoaderDialog(),
        createAlert
    );
}
const alertTimeout = 4000
export class SupervisorActionHandler {
    constructor(
        protected supervisor: Supervisor,
        protected createLoader,
        protected createAlert:AlertCreateFn,
    ) {}

    async stopProcess(name: string) {
        const destroy = this.createLoader({ message: `Stopping Process [${name}]...` });
        try {
            const response = await this.supervisor.startProcess(name);
            await this.supervisor.updateStatus();
        } catch (e) {
            this.createAlert('error','Error',e.response?.data?.error||e.message,alertTimeout);
        }
        destroy();
    }

    async startProcess(name: string) {
        const destroy = this.createLoader({ message: `Starting Process [${name}]...` });
        try {
            const response = await this.supervisor.startProcess(name);
            await this.supervisor.updateStatus();
        } catch (e) {
            this.createAlert('error','Error',e.response?.data?.error||e.message,alertTimeout);
        }
        destroy();
    }

    async startProcessGroup(name: string) {
        const destroy = this.createLoader({ message: `Starting Process Group [${name}]...` });
        try{
        const response   = await this.supervisor.startProcessGroup(name);
        await this.supervisor.updateStatus();
        } catch (e) {
            this.createAlert('error','Error',e.response?.data?.error||e.message,alertTimeout);
        }
        destroy();
    }

    async stopProcessGroup(name:string) {
        const destroy = this.createLoader({ message: `Stopping process group...` });
        try {
            const response = await this.supervisor.stopProcessGroup(name);
            await this.supervisor.updateStatus();
            destroy();
            this.createAlert('success','Added', 'Process group has been stopped', 4000)
            return true;
        } catch (e) {
            this.createAlert('error','Error',e.response?.data?.error||e.message,alertTimeout);
        }
        destroy();
        return false;
    }

    async addProcessGroup(name:string) {
        const destroy = this.createLoader({ message: `Adding process group...` });
        try {
            const response = await this.supervisor.addProcessGroup(name);
            await this.supervisor.updateStatus();
            destroy();
            this.createAlert('success','Added', 'Process group has been added', 4000)
            return true;
        } catch (e) {
            this.createAlert('error','Error',e.response?.data?.error||e.message,alertTimeout);
        }
        destroy();
        return false;
    }

    async removeProcessGroup(name:string) {
        const destroy = this.createLoader({ message: `Remove process group...` });
        try {
            const response = await this.supervisor.removeProcessGroup(name);
            await this.supervisor.updateStatus();
            destroy();
            this.createAlert('success','Added', 'Process group has been removed', 4000)
            return true;
        } catch (e) {
            this.createAlert('error','Error',e.response?.data?.error||e.message,alertTimeout);
        }
        destroy();
        return false;
    }

    async reload() {
        const destroy = this.createLoader({ message: `Reloading...` });
        try {
            const response = await this.supervisor.reload();
            await this.supervisor.updateStatus();
            destroy();
            this.createAlert('success','Reloaded', 'Supervisor has been reloaded', 4000)
            return true;
        } catch (e) {
            this.createAlert('error','Error',e.response?.data?.error||e.message,alertTimeout);
        }
        destroy();
        return false;
    }
    async delete(groupName:string) {
        const confirm = useConfirmDialog()
        const confirmed = await confirm({
            title: 'Are you sure?',
            message: 'Are you sure you want top delete this?'
        })
        if(!confirmed){
            return false
        }
        const destroy = this.createLoader({ message: `Deleting config...` });

        let config = this.supervisor.data.files.find(f => {
            return Object.keys(f.config).map(key => strStripLeft(key, 'program:')).find(k => k === groupName) !== undefined;
        });
        if ( !config ) {
            this.createAlert('error','Error','Could not resolve group into filename',alertTimeout)
            return false;
        }
        try {
            const response = await this.supervisor.delete (config.path.split('/').pop());
            await this.supervisor.reload()
            await this.supervisor.updateStatus();
            destroy();
            this.createAlert('success','Added', 'Config has been removed', 4000)
            return true;
        } catch (e) {
            this.createAlert('error','Error',e.response?.data?.error||e.message,alertTimeout);
        }
        destroy();
        return false;
    }
}
