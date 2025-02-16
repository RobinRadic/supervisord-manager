import LoaderDialog from '../components/dialogs/LoaderDialog.vue';
import vuetify from '@/plugins/vuetify'; // Adjust the import path as necessary
import { h } from 'vue';

export function useLoaderDialog() {
    return function createDialog(props: InstanceType<typeof LoaderDialog>['$props']) {
        const container = document.createElement('div');
        const app = createApp({
            render() {
                return h(LoaderDialog, {
                    ...props,
                });
            },
        });
            document.body.appendChild(container);
            app.use(vuetify);
            app.mount(container);

            return function destroy(){
                app.unmount();
                document.body.removeChild(container);
            }
        // return {
        //     show: () => {
        //         document.body.appendChild(container);
        //         app.use(vuetify);
        //         app.mount(container);
        //     },
        //     destroy: () => {
        //
        //         app.unmount();
        //         document.body.removeChild(container);
        //     }
        // }
    };
}
