import ConfirmDialog from '../components/dialogs/ConfirmDialog.vue';
import vuetify from '@/plugins/vuetify'; // Adjust the import path as necessary
import { h } from 'vue';

export function useConfirmDialog() {
    ;

    return function createDialog(props: InstanceType<typeof ConfirmDialog>['$props']) {
        const container = document.createElement('div');
        document.body.appendChild(container);

        return new Promise((resolve) => {
            const app = createApp({
                render() {
                    return h(ConfirmDialog, {
                        ...props,
                        modelValue:true,
                        onConfirm: () => {
                            resolve(true);
                            app.unmount();
                            document.body.removeChild(container);
                        },
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
