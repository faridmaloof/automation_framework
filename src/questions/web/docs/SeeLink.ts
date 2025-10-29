/**
 * Question: See if navigation link exists
 */

import { Actor } from '../../../actors/actor';
import { Question } from '../../question';
import { BrowseTheWeb } from '../../../abilities/browseTheWeb';

/**
 * Pregunta para verificar si un enlace de navegación existe en la página
 */
export class SeeLink implements Question<boolean> {
  /**
   * Crea una instancia de SeeLink
   * @param linkText - Texto del enlace a verificar
   */
  constructor(private linkText: string) {}

  /**
   * Método estático para crear la pregunta con sintaxis fluida
   * @param linkText - Texto del enlace a verificar
   * @returns Nueva instancia de SeeLink
   * 
   * @example
   * const exists = await actor.asks(SeeLink.withText('API v2'));
   */
  static withText(linkText: string): SeeLink {
    return new SeeLink(linkText);
  }

  /**
   * Responde a la pregunta verificando si el enlace existe
   * @param actor - El actor que hace la pregunta
   * @returns true si el enlace existe, false en caso contrario
   */
  async answeredBy(actor: Actor): Promise<boolean> {
    const page = BrowseTheWeb.from(actor);
    
    try {
      // Buscar el enlace con el texto especificado
      const link = page.locator(`a:has-text("${this.linkText}")`).first();
      
      // Verificar si existe y está visible
      const count = await link.count();
      if (count === 0) {
        return false;
      }
      
      return await link.isVisible({ timeout: 2000 });
    } catch {
      return false;
    }
  }
}
