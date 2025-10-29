/**
 * Question: See if GraphQL title is visible
 */

import { Actor } from '../../../actors/actor';
import { Question } from '../../question';
import { PokeAPIDocsPage } from '../../../pages/web/PokeAPIDocsPage';

/**
 * Pregunta para verificar si el título de GraphQL está visible
 */
export class SeeGraphQLTitle implements Question<boolean> {
  /**
   * Método estático para crear la pregunta
   * @returns Nueva instancia de SeeGraphQLTitle
   * 
   * @example
   * const isVisible = await actor.asks(SeeGraphQLTitle.displayed());
   */
  static displayed(): SeeGraphQLTitle {
    return new SeeGraphQLTitle();
  }

  /**
   * Responde a la pregunta verificando si el título de GraphQL está visible
   * @param actor - El actor que hace la pregunta
   * @returns true si el título está visible, false en caso contrario
   */
  async answeredBy(actor: Actor): Promise<boolean> {
    const docsPage = (actor as any)._docsPage as PokeAPIDocsPage;
    
    if (!docsPage) {
      throw new Error('PokeAPIDocsPage not found in actor context');
    }
    
    return await docsPage.isGraphQLTitleVisible();
  }
}
