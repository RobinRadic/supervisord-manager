import type { HighlighterGeneric } from '@shikijs/types';
import { createHighlighter } from 'shiki';

const highlighter = ref(null);

export default function highlighterPlugin(){
    return {
        install(app){
            createHighlighter({
                themes: ['nord'],
                langs: ['javascript'],
            }).then(h => {
                highlighter.value = h;
            })
            app.provide('highlighter', highlighter);
        }
    }
}

export function useHighlighter():HighlighterGeneric<any,any>{
    return inject('highlighter');
}
