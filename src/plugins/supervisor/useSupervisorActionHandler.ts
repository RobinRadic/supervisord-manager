import { type AlertCreateFn, useAlerts } from '@/composables/useAlerts.js';
import { useLoaderDialog } from '@/composables/useLoaderDialog.js';
import type { Supervisor } from '@/plugins/supervisor/Supervisor.js';
import { useSupervisor } from '@/plugins/supervisor/useSupervisor.js';

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
            await this.supervisor.updateState();
        } catch (e) {
            this.createAlert('error','Error',e.response?.data?.error||e.message,alertTimeout);
        }
        destroy();
    }

    async startProcess(name: string) {
        const destroy = this.createLoader({ message: `Starting Process [${name}]...` });
        try {
            const response = await this.supervisor.startProcess(name);
            await this.supervisor.updateState();
        } catch (e) {
            this.createAlert('error','Error',e.response?.data?.error||e.message,alertTimeout);
        }
        destroy();
    }

    async startProcessGroup(name: string) {
        const destroy = this.createLoader({ message: `Starting Process Group [${name}]...` });
        try{
        const response   = await this.supervisor.startProcessGroup(name);
        await this.supervisor.updateState();
        } catch (e) {
            this.createAlert('error','Error',e.response?.data?.error||e.message,alertTimeout);
        }
        destroy();
    }

    async reload() {
        const destroy = this.createLoader({ message: `Reloading...` });
        try {
            const response = await this.supervisor.reload();
            await this.supervisor.updateState();
        } catch (e) {
            this.createAlert('error','Error',e.response?.data?.error||e.message,alertTimeout);
        }
        destroy();
    }
}
