import { Actor } from '../actors/actor';

/**
 * Task - Interface base para todas las tareas
 * Las tareas representan acciones de alto nivel que un actor puede ejecutar
 * Ejemplos: Login, SearchPokemon, CreateUser
 */
export interface Task {
  performAs(actor: Actor): Promise<void>;
}
