import { Actor } from '../actors/actor';

/**
 * Interaction - Interface base para todas las interacciones
 * Las interacciones representan acciones atómicas de bajo nivel
 * Ejemplos: Click, Fill, Navigate, Get (API), Post (API)
 */
export interface Interaction {
  performAs(actor: Actor): Promise<void>;
}
