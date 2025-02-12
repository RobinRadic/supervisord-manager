const components = ref<Array<{ component: any, props: any }>>([]);

export interface ComponentItem {
    component: any;
    props: any;
}

export default function useAppBarComponents(): { components: Ref<ComponentItem[]>, addComponent: (component: ComponentItem) => void, setComponents: (newComponents: ComponentItem[]) => void, clearComponents: () => void } {
    return {
        components,
        addComponent(component) {
            components.value.push(component);
        },
        setComponents(newComponents) {
            components.value = newComponents;
        },
        clearComponents() {
            components.value = [];
        },
    };
}

