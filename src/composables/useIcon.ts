import type { MdiIconName } from '@/types/icons.js';

export type IconFn = (icon: MdiIconName) => string

export function useIcon(): IconFn {
    return (icon: MdiIconName) => icon;
}
