import { interfaces } from 'inversify';
import { di } from '../../di.js';

export const Container = di;
export type InjectionToken = interfaces.ServiceIdentifier<any>;
