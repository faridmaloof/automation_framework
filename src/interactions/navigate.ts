/**
 * Navigate Interaction
 * 
 * Representa la acción de navegar a una URL específica.
 * Incluye opciones para esperar por eventos de red o DOM.
 * 
 * Ejemplo de uso:
 * ```typescript
 * await actor.attemptsTo(
 *   Navigate.to('https://pokeapi.co'),
 *   Navigate.to('https://example.com').andWaitForLoadState('networkidle'),
 *   Navigate.back(),
 *   Navigate.forward()
 * );
 * ```
 */

import { Interaction } from './interaction';
import { Actor } from '../actors/actor';
import { BrowseTheWeb } from '../abilities/browseTheWeb';

export class Navigate implements Interaction {
  private url?: string;
  private waitForState?: 'load' | 'domcontentloaded' | 'networkidle';
  private action: 'goto' | 'back' | 'forward' | 'reload' = 'goto';

  /**
   * Navega a una URL específica
   * 
   * @param url - URL de destino
   * @returns Nueva instancia de Navigate
   */
  static to(url: string): Navigate {
    const navigate = new Navigate();
    navigate.url = url;
    navigate.action = 'goto';
    return navigate;
  }

  /**
   * Navega hacia atrás en el historial
   */
  static back(): Navigate {
    const navigate = new Navigate();
    navigate.action = 'back';
    return navigate;
  }

  /**
   * Navega hacia adelante en el historial
   */
  static forward(): Navigate {
    const navigate = new Navigate();
    navigate.action = 'forward';
    return navigate;
  }

  /**
   * Recarga la página actual
   */
  static reload(): Navigate {
    const navigate = new Navigate();
    navigate.action = 'reload';
    return navigate;
  }

  private constructor() {}

  /**
   * Espera a que la página alcance un estado específico
   * 
   * @param state - Estado de carga: 'load', 'domcontentloaded', 'networkidle'
   */
  andWaitForLoadState(state: 'load' | 'domcontentloaded' | 'networkidle'): Navigate {
    this.waitForState = state;
    return this;
  }

  /**
   * Ejecuta la navegación
   * 
   * @param actor - El actor que realiza la acción
   */
  async performAs(actor: Actor): Promise<void> {
    const page = BrowseTheWeb.from(actor);

    switch (this.action) {
      case 'goto':
        if (!this.url) {
          throw new Error('URL is required for Navigate.to()');
        }
        await page.goto(this.url, { 
          waitUntil: this.waitForState || 'load'
        });
        break;

      case 'back':
        await page.goBack({ 
          waitUntil: this.waitForState || 'load'
        });
        break;

      case 'forward':
        await page.goForward({ 
          waitUntil: this.waitForState || 'load'
        });
        break;

      case 'reload':
        await page.reload({ 
          waitUntil: this.waitForState || 'load'
        });
        break;
    }

    // Esperar estado adicional si se especificó
    if (this.waitForState) {
      await page.waitForLoadState(this.waitForState);
    }
  }
}
