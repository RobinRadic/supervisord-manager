
export interface Alert {
    type: 'success' | 'error' | 'warning' | 'info';
    title:string
    message: string;
    timeout?: number;
    progress?:Ref<number>;
}

export type AlertCreateFn = (type: Alert['type'], title:string, message: string, timeout?: number) => void

const alerts = ref<Alert[]>([]);
export function useAlerts():[alerts:Ref<Alert[]>, create:AlertCreateFn] {
    const create = (type: Alert['type'], title:string, message: string, timeout = 3000) => {
        const alert = { type,title, message, timeout, progress: ref(100) };
        alerts.value.push(alert);

        if (timeout) {
            const interval = setInterval(() => {
                alert.progress.value = (alert.progress.value || 100) - (100 / (timeout / 100));
                if (alert.progress.value <= 0) {
                    clearInterval(interval);
                    const index = alerts.value.indexOf(alert);
                    if (index !== -1) {
                        alerts.value.splice(index, 1);
                    }
                }
            }, 100);
        }
    }
    return [alerts,create];
}
