/**
 * Question: See if resource sections are visible (API v2)
 */

import { Actor } from '../../../actors/actor';
import { Question } from '../../question';
import { PokeAPIDocsPage } from '../../../pages/web/PokeAPIDocsPage';

/**
 * Pregunta para verificar si las secciones de recursos están visibles
 */
export class SeeResourceSections implements Question<boolean> {
  /**
   * Método estático para crear la pregunta
   * @returns Nueva instancia de SeeResourceSections
   * 
   * @example
   * const areVisible = await actor.asks(SeeResourceSections.displayed());
   */
  static displayed(): SeeResourceSections {
    return new SeeResourceSections();
  }

  /**
   * Responde a la pregunta verificando si las secciones de recursos están visibles
   * @param actor - El actor que hace la pregunta
   * @returns true si las secciones están visibles, false en caso contrario
   */
  async answeredBy(actor: Actor): Promise<boolean> {
    const docsPage = (actor as any)._docsPage as PokeAPIDocsPage;
    
    if (!docsPage) {
      throw new Error('PokeAPIDocsPage not found in actor context');
    }
    
    return await docsPage.areResourceSectionsVisible();
  }
}
