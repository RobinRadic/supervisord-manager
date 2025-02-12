import CodeDialog from '@/components/CodeDialog.vue';
import vuetify from '@/plugins/vuetify'; // Adjust the import path as necessary
import { h } from 'vue';

export function useCodeDialog() {
    return function createDialog(props: InstanceType<typeof CodeDialog>['$props']) {
        const container = document.createElement('div');
        document.body.appendChild(container);
        return new Promise((resolve) => {
            const app = createApp({
                render() {
                    return h(CodeDialog, {
                        ...props,
                        open: true,
                        onClose: () => {
                            resolve(false);
                            app.unmount();
                            document.body.removeChild(container);
                        },
                    });
                },
            });

            app.use(vuetify);
            app.mount(container);
        });
    };
}
