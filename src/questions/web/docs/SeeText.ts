/**
 * Question: See if text is visible on page
 */

import { Actor } from '../../../actors/actor';
import { Question } from '../../question';
import { BrowseTheWeb } from '../../../abilities/browseTheWeb';

/**
 * Pregunta para verificar si un texto está visible en la página
 */
export class SeeText implements Question<boolean> {
  /**
   * Crea una instancia de SeeText
   * @param expectedText - Texto esperado
   */
  constructor(private expectedText: string) {}

  /**
   * Método estático para crear la pregunta con sintaxis fluida
   * @param text - Texto a verificar
   * @returns Nueva instancia de SeeText
   * 
   * @example
   * const isVisible = await actor.asks(SeeText.containing('End of support'));
   */
  static containing(text: string): SeeText {
    return new SeeText(text);
  }

  /**
   * Responde a la pregunta verificando si el texto está visible
   * @param actor - El actor que hace la pregunta
   * @returns true si el texto está visible, false en caso contrario
   */
  async answeredBy(actor: Actor): Promise<boolean> {
    const page = BrowseTheWeb.from(actor);
    
    try {
      // Buscar el texto en la página usando regex case-insensitive
      const textLocator = page.locator(`text=/${this.expectedText}/i`).first();
      
      // Verificar si existe y está visible
      const count = await textLocator.count();
      if (count === 0) {
        return false;
      }
      
      return await textLocator.isVisible({ timeout: 5000 });
    } catch {
      return false;
    }
  }
}
