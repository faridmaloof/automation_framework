/**
 * Question: See if heading is visible
 */

import { Actor } from '../../../actors/actor';
import { Question } from '../../question';
import { PokeAPIDocsPage } from '../../../pages/web/PokeAPIDocsPage';

/**
 * Pregunta para verificar si un encabezado está visible
 */
export class SeeHeading implements Question<boolean> {
  /**
   * Crea una instancia de SeeHeading
   * @param expectedHeading - Texto del encabezado esperado
   */
  constructor(private expectedHeading: string) {}

  /**
   * Método estático para crear la pregunta con sintaxis fluida
   * @param heading - Texto del encabezado a verificar
   * @returns Nueva instancia de SeeHeading
   * 
   * @example
   * const isVisible = await actor.asks(SeeHeading.withText('Docs'));
   */
  static withText(heading: string): SeeHeading {
    return new SeeHeading(heading);
  }

  /**
   * Responde a la pregunta verificando si el encabezado está visible
   * @param actor - El actor que hace la pregunta
   * @returns true si el encabezado está visible, false en caso contrario
   */
  async answeredBy(actor: Actor): Promise<boolean> {
    // Obtener el Page Object del contexto del actor
    const docsPage = (actor as any)._docsPage as PokeAPIDocsPage;
    
    if (!docsPage) {
      throw new Error('PokeAPIDocsPage not found in actor context. Did you navigate to the docs page first?');
    }
    
    // Verificar si el encabezado está visible
    // Nota: Por ahora usamos el método para "Docs", pero se podría hacer más genérico
    if (this.expectedHeading === 'Docs') {
      return await docsPage.isDocsHeadingVisible();
    }
    
    throw new Error(`Heading verification not implemented for: ${this.expectedHeading}`);
  }
}
