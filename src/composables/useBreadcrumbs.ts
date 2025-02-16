import { RouteLocationRaw } from 'vue-router';


interface LinkProps {
    href: string | undefined;
    replace: boolean | undefined;
    to: RouteLocationRaw | undefined;
    path:string|undefined;
    exact: boolean | undefined;
}

type InternalBreadcrumbItem = Partial<LinkProps> & {
    title: string;
    disabled?: boolean;
};
export interface BreadcrumbRegistration extends InternalBreadcrumbItem{
    key:string
    path:string
    parent?:string
}
const registry:BreadcrumbRegistration[] = []
const breadcrumbs = ref([])
const currentKey = ref('')
const currentParams = ref({})
import {parseQuery,stringifyQuery,createRouterMatcher} from 'vue-router'
import { tokensToParser } from '../utils/pathParserRank.js';
import { tokenizePath } from '../utils/pathTokenizer.js';
export function useBreadcrumbs(){

    const updateBreadcrumbs = () => {

        let update:BreadcrumbRegistration[] = []
        let current:BreadcrumbRegistration = registry.find(b => b.key === currentKey.value)
        while(current){
            // current.to replace route parameters
            const tokens = tokenizePath(current.path);
            const parser = tokensToParser(tokens);
            const item = {
                ...current,
                to: parser.stringify(currentParams.value)
            }
            console.log('current',item)
            update.unshift(item)
            current = registry.find(b => b.key === current.parent)
        }
        console.log('update',update)
        breadcrumbs.value = update
    }
    const registerBreadcrumb = (key:string, breadcrumb:Omit<BreadcrumbRegistration,'key'>) => {
        if(registry.find(b => b.key === key)) return;
        registry.push({key,...breadcrumb})
        console.log('register',{key,...breadcrumb},registry)
    }
    const registerBreadcrumbs= (breadcrumbs:Record<string,Omit<BreadcrumbRegistration,'key'>>) => {
        Object.entries(breadcrumbs).forEach(([key,breadcrumb]) => {
            registerBreadcrumb(key,breadcrumb)
        })
    }
    const setCurrent = (key:string, params:any={}) => {
        currentKey.value = key
        currentParams.value = params
        updateBreadcrumbs()
    }

    return {
        registerBreadcrumb,
        registerBreadcrumbs,
        setCurrent,
        breadcrumbs: readonly(breadcrumbs),
        current: readonly(currentKey)
    }
}
