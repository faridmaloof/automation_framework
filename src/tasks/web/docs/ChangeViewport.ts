/**
 * Task: Change viewport size for responsive testing
 */

import { Actor } from '../../../actors/actor';
import { Task } from '../../task';
import { PokeAPIDocsPage } from '../../../pages/web/PokeAPIDocsPage';

/**
 * Tarea para cambiar el tamaño del viewport del navegador
 * Útil para pruebas de diseño responsive
 */
export class ChangeViewport implements Task {
  /**
   * Crea una instancia de ChangeViewport
   * @param deviceType - Tipo de dispositivo: 'móvil', 'tablet', 'escritorio'
   */
  constructor(private deviceType: string) {}

  /**
   * Método estático para crear la tarea con sintaxis fluida
   * @param deviceType - Tipo de dispositivo: 'móvil', 'tablet', 'escritorio'
   * @returns Nueva instancia de ChangeViewport
   * 
   * @example
   * await actor.attemptsTo(ChangeViewport.to('móvil'));
   */
  static to(deviceType: string): ChangeViewport {
    return new ChangeViewport(deviceType);
  }

  /**
   * Ejecuta la tarea de cambiar el tamaño del viewport
   * @param actor - El actor que ejecuta la tarea
   */
  async performAs(actor: Actor): Promise<void> {
    // Obtener el Page Object del contexto del actor
    const docsPage = (actor as any)._docsPage as PokeAPIDocsPage;
    
    if (!docsPage) {
      throw new Error('PokeAPIDocsPage not found in actor context. Did you navigate to the docs page first?');
    }
    
    // Cambiar el tamaño del viewport
    await docsPage.changeViewportSize(this.deviceType);
  }
}
