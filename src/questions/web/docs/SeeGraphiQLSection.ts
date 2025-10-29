/**
 * Question: See if GraphiQL section is visible
 */

import { Actor } from '../../../actors/actor';
import { Question } from '../../question';
import { PokeAPIDocsPage } from '../../../pages/web/PokeAPIDocsPage';

/**
 * Pregunta para verificar si la sección GraphiQL está visible
 */
export class SeeGraphiQLSection implements Question<boolean> {
  /**
   * Método estático para crear la pregunta
   * @returns Nueva instancia de SeeGraphiQLSection
   * 
   * @example
   * const isVisible = await actor.asks(SeeGraphiQLSection.displayed());
   */
  static displayed(): SeeGraphiQLSection {
    return new SeeGraphiQLSection();
  }

  /**
   * Responde a la pregunta verificando si la sección GraphiQL está visible
   * @param actor - El actor que hace la pregunta
   * @returns true si la sección está visible, false en caso contrario
   */
  async answeredBy(actor: Actor): Promise<boolean> {
    const docsPage = (actor as any)._docsPage as PokeAPIDocsPage;
    
    if (!docsPage) {
      throw new Error('PokeAPIDocsPage not found in actor context');
    }
    
    return await docsPage.isGraphiQLSectionVisible();
  }
}
