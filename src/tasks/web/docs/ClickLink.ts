/**
 * Task: Click on a navigation link
 */

import { Actor } from '../../../actors/actor';
import { Task } from '../../task';
import { PokeAPIDocsPage } from '../../../pages/web/PokeAPIDocsPage';

/**
 * Tarea para hacer clic en un enlace de navegación
 * Utiliza el Page Object almacenado en el contexto del actor
 */
export class ClickLink implements Task {
  /**
   * Crea una instancia de ClickLink
   * @param linkText - Texto del enlace a hacer clic
   */
  constructor(private linkText: string) {}

  /**
   * Método estático para crear la tarea con sintaxis fluida
   * @param linkText - Texto del enlace a hacer clic
   * @returns Nueva instancia de ClickLink
   * 
   * @example
   * await actor.attemptsTo(ClickLink.on('API v2'));
   */
  static on(linkText: string): ClickLink {
    return new ClickLink(linkText);
  }

  /**
   * Ejecuta la tarea de hacer clic en el enlace
   * @param actor - El actor que ejecuta la tarea
   */
  async performAs(actor: Actor): Promise<void> {
    // Obtener el Page Object del contexto del actor
    const docsPage = (actor as any)._docsPage as PokeAPIDocsPage;
    
    if (!docsPage) {
      throw new Error('PokeAPIDocsPage not found in actor context. Did you navigate to the docs page first?');
    }
    
    // Hacer clic en el enlace especificado
    await docsPage.clickNavigationLink(this.linkText);
  }
}
