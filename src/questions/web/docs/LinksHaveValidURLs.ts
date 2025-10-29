/**
 * Question: Check if all main links have valid URLs
 */

import { Actor } from '../../../actors/actor';
import { Question } from '../../question';
import { PokeAPIDocsPage } from '../../../pages/web/PokeAPIDocsPage';

/**
 * Pregunta para verificar si todos los enlaces principales tienen URLs válidas
 */
export class LinksHaveValidURLs implements Question<boolean> {
  /**
   * Método estático para crear la pregunta
   * @returns Nueva instancia de LinksHaveValidURLs
   * 
   * @example
   * const haveValidURLs = await actor.asks(LinksHaveValidURLs.check());
   */
  static check(): LinksHaveValidURLs {
    return new LinksHaveValidURLs();
  }

  /**
   * Responde a la pregunta verificando si todos los enlaces tienen URLs válidas
   * @param actor - El actor que hace la pregunta
   * @returns true si todos los enlaces tienen URLs válidas, false en caso contrario
   */
  async answeredBy(actor: Actor): Promise<boolean> {
    const docsPage = (actor as any)._docsPage as PokeAPIDocsPage;
    
    if (!docsPage) {
      throw new Error('PokeAPIDocsPage not found in actor context');
    }
    
    return await docsPage.doAllMainLinksHaveValidURLs();
  }
}
