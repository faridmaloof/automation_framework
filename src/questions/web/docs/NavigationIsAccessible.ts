/**
 * Question: Check if navigation is accessible on current viewport
 */

import { Actor } from '../../../actors/actor';
import { Question } from '../../question';
import { PokeAPIDocsPage } from '../../../pages/web/PokeAPIDocsPage';

/**
 * Pregunta para verificar si la navegación es accesible en el viewport actual
 */
export class NavigationIsAccessible implements Question<boolean> {
  /**
   * Método estático para crear la pregunta
   * @returns Nueva instancia de NavigationIsAccessible
   * 
   * @example
   * const isAccessible = await actor.asks(NavigationIsAccessible.check());
   */
  static check(): NavigationIsAccessible {
    return new NavigationIsAccessible();
  }

  /**
   * Responde a la pregunta verificando si la navegación es accesible
   * @param actor - El actor que hace la pregunta
   * @returns true si la navegación es accesible, false en caso contrario
   */
  async answeredBy(actor: Actor): Promise<boolean> {
    const docsPage = (actor as any)._docsPage as PokeAPIDocsPage;
    
    if (!docsPage) {
      throw new Error('PokeAPIDocsPage not found in actor context');
    }
    
    return await docsPage.isNavigationAccessible();
  }
}
