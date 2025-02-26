/* eslint-disable */
/* prettier-ignore */
// @ts-nocheck
// Generated by unplugin-vue-router. ‼️ DO NOT MODIFY THIS FILE ‼️
// It's recommended to commit this file.
// Make sure to add this file to your tsconfig.json file as an "includes" or "files" entry.

declare module 'vue-router/auto-routes' {
  import type {
    RouteRecordInfo,
    ParamValue,
    ParamValueOneOrMore,
    ParamValueZeroOrMore,
    ParamValueZeroOrOne,
  } from 'vue-router'

  /**
   * Route name map generated by unplugin-vue-router
   */
  export interface RouteNamedMap {
    '/': RouteRecordInfo<'/', '/', Record<never, never>, Record<never, never>>,
    '/create': RouteRecordInfo<'/create', '/create', Record<never, never>, Record<never, never>>,
    '/dashboard': RouteRecordInfo<'/dashboard', '/dashboard', Record<never, never>, Record<never, never>>,
    '/edit/[group]': RouteRecordInfo<'/edit/[group]', '/edit/:group', { group: ParamValue<true> }, { group: ParamValue<false> }>,
    '/login': RouteRecordInfo<'/login', '/login', Record<never, never>, Record<never, never>>,
    '/logout': RouteRecordInfo<'/logout', '/logout', Record<never, never>, Record<never, never>>,
    '/logs/[group]': RouteRecordInfo<'/logs/[group]', '/logs/:group', { group: ParamValue<true> }, { group: ParamValue<false> }>,
    '/settings': RouteRecordInfo<'/settings', '/settings', Record<never, never>, Record<never, never>>,
  }
}
