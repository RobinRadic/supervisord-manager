const components = ref<Array<{ component: any, props: any }>>([]);

export interface ComponentItem {
    component: any;
    props: any;
}

export interface AppBarComponents {
    components: Ref<ComponentItem[]>;
    add: (component: ComponentItem['component'],props?:ComponentItem['props']) => void;
    addComponent: (component: ComponentItem) => void;
    setComponents: (newComponents: ComponentItem[]) => void;
    clearComponents: () => void;
}

export default function useAppBarComponents(): AppBarComponents {
    return {
        components,
        add(component, props: any = {}) {
            components.value.push({ component: markRaw(component), props: markRaw(props) });
        },
        addComponent(component) {
            components.value.push(markRaw(component));
        },
        setComponents(newComponents) {
            components.value = newComponents;
        },
        clearComponents() {
            components.value = [];
        },
    };
}

