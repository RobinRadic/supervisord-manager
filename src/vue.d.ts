// src/types/vue.d.ts

declare module '@vue/runtime-core' {
    import type { MdiIconName } from '@/types/icons.js';

    interface ComponentCustomProperties {
        icon: (name: MdiIconName) => string;
    }
}
