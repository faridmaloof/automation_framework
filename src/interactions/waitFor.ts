/**
 * WaitFor Interaction
 * 
 * Representa la acción de esperar por un elemento, condición o tiempo.
 * Útil para sincronización en aplicaciones con contenido dinámico.
 * 
 * Ejemplo de uso:
 * ```typescript
 * await actor.attemptsTo(
 *   WaitFor.element('#loading-spinner').toBeHidden(),
 *   WaitFor.element('.result').toBeVisible(),
 *   WaitFor.element('button').toBeEnabled(),
 *   WaitFor.milliseconds(2000)
 * );
 * ```
 */

import { Interaction } from './interaction';
import { Actor } from '../actors/actor';
import { BrowseTheWeb } from '../abilities/browseTheWeb';

export class WaitFor implements Interaction {
  private selector?: string;
  private condition?: 'visible' | 'hidden' | 'enabled' | 'disabled' | 'attached' | 'detached';
  private timeout: number = 30000;
  private milliseconds?: number;

  /**
   * Espera por un elemento específico
   * 
   * @param selector - Selector CSS, XPath o texto del elemento
   * @returns Nueva instancia de WaitFor
   */
  static element(selector: string): WaitFor {
    const wait = new WaitFor();
    wait.selector = selector;
    return wait;
  }

  /**
   * Espera por un tiempo específico
   * 
   * @param ms - Milisegundos a esperar
   * @returns Nueva instancia de WaitFor
   */
  static milliseconds(ms: number): WaitFor {
    const wait = new WaitFor();
    wait.milliseconds = ms;
    return wait;
  }

  /**
   * Alias para milliseconds
   */
  static seconds(seconds: number): WaitFor {
    return WaitFor.milliseconds(seconds * 1000);
  }

  private constructor() {}

  /**
   * Espera a que el elemento sea visible
   */
  toBeVisible(): WaitFor {
    this.condition = 'visible';
    return this;
  }

  /**
   * Espera a que el elemento esté oculto
   */
  toBeHidden(): WaitFor {
    this.condition = 'hidden';
    return this;
  }

  /**
   * Espera a que el elemento esté habilitado
   */
  toBeEnabled(): WaitFor {
    this.condition = 'enabled';
    return this;
  }

  /**
   * Espera a que el elemento esté deshabilitado
   */
  toBeDisabled(): WaitFor {
    this.condition = 'disabled';
    return this;
  }

  /**
   * Espera a que el elemento esté en el DOM
   */
  toBeAttached(): WaitFor {
    this.condition = 'attached';
    return this;
  }

  /**
   * Espera a que el elemento no esté en el DOM
   */
  toBeDetached(): WaitFor {
    this.condition = 'detached';
    return this;
  }

  /**
   * Configura el timeout de espera
   * 
   * @param ms - Milisegundos de timeout
   */
  withTimeout(ms: number): WaitFor {
    this.timeout = ms;
    return this;
  }

  /**
   * Ejecuta la espera
   * 
   * @param actor - El actor que realiza la acción
   */
  async performAs(actor: Actor): Promise<void> {
    const page = BrowseTheWeb.from(actor);

    // Si es espera por tiempo
    if (this.milliseconds !== undefined) {
      await page.waitForTimeout(this.milliseconds);
      return;
    }

    // Si es espera por elemento
    if (!this.selector) {
      throw new Error('Selector is required for WaitFor.element()');
    }

    const locator = page.locator(this.selector);

    switch (this.condition) {
      case 'visible':
        await locator.waitFor({ state: 'visible', timeout: this.timeout });
        break;

      case 'hidden':
        await locator.waitFor({ state: 'hidden', timeout: this.timeout });
        break;

      case 'enabled':
        await locator.waitFor({ state: 'visible', timeout: this.timeout });
        await page.waitForFunction(
          (sel) => {
            const element = document.querySelector(sel) as HTMLInputElement;
            return element && !element.disabled;
          },
          this.selector,
          { timeout: this.timeout }
        );
        break;

      case 'disabled':
        await locator.waitFor({ state: 'visible', timeout: this.timeout });
        await page.waitForFunction(
          (sel) => {
            const element = document.querySelector(sel) as HTMLInputElement;
            return element && element.disabled;
          },
          this.selector,
          { timeout: this.timeout }
        );
        break;

      case 'attached':
        await locator.waitFor({ state: 'attached', timeout: this.timeout });
        break;

      case 'detached':
        await locator.waitFor({ state: 'detached', timeout: this.timeout });
        break;

      default:
        // Por defecto espera a que sea visible
        await locator.waitFor({ state: 'visible', timeout: this.timeout });
    }
  }
}
