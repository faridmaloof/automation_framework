/**
 * Click Interaction
 * 
 * Representa la acción de hacer clic en un elemento de la página web.
 * Esta interaction es atómica y puede ser compuesta por Tasks de nivel superior.
 * 
 * Ejemplo de uso:
 * ```typescript
 * await actor.attemptsTo(
 *   Click.on('#submit-button'),
 *   Click.on('button.primary').withDoubleClick(),
 *   Click.on('.menu-item').withRightClick()
 * );
 * ```
 */

import { Interaction } from './interaction';
import { Actor } from '../actors/actor';
import { BrowseTheWeb } from '../abilities/browseTheWeb';

export class Click implements Interaction {
  private doubleClick: boolean = false;
  private rightClick: boolean = false;
  private clickOptions: any = {};

  /**
   * Crea una interaction Click para un selector específico
   * 
   * @param selector - Selector CSS, XPath o texto del elemento
   * @returns Nueva instancia de Click
   */
  static on(selector: string): Click {
    return new Click(selector);
  }

  private constructor(private selector: string) {}

  /**
   * Configura el click como doble click
   */
  withDoubleClick(): Click {
    this.doubleClick = true;
    return this;
  }

  /**
   * Configura el click como click derecho
   */
  withRightClick(): Click {
    this.rightClick = true;
    return this;
  }

  /**
   * Configura opciones adicionales de Playwright para el click
   * 
   * @param options - Opciones de click de Playwright (button, clickCount, delay, etc.)
   */
  withOptions(options: any): Click {
    this.clickOptions = options;
    return this;
  }

  /**
   * Ejecuta el click usando las habilidades del Actor
   * 
   * @param actor - El actor que realiza la acción
   */
  async performAs(actor: Actor): Promise<void> {
    const page = BrowseTheWeb.from(actor);

    if (this.doubleClick) {
      await page.dblclick(this.selector, this.clickOptions);
    } else if (this.rightClick) {
      await page.click(this.selector, { ...this.clickOptions, button: 'right' });
    } else {
      await page.click(this.selector, this.clickOptions);
    }
  }
}
