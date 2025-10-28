/**
 * Fill Interaction
 * 
 * Representa la acción de rellenar un campo de formulario con texto.
 * Soporta input, textarea y contenteditable.
 * 
 * Ejemplo de uso:
 * ```typescript
 * await actor.attemptsTo(
 *   Fill.field('#username').with('testuser'),
 *   Fill.field('input[name="email"]').with('test@example.com').slowly(),
 *   Fill.field('#password').with('secret123').andPressEnter()
 * );
 * ```
 */

import { Interaction } from './interaction';
import { Actor } from '../actors/actor';
import { BrowseTheWeb } from '../abilities/browseTheWeb';

export class Fill implements Interaction {
  private value: string = '';
  private slow: boolean = false;
  private pressEnter: boolean = false;
  private clearFirst: boolean = true;

  /**
   * Crea una interaction Fill para un selector específico
   * 
   * @param selector - Selector CSS, XPath o texto del campo
   * @returns Nueva instancia de Fill
   */
  static field(selector: string): Fill {
    return new Fill(selector);
  }

  private constructor(private selector: string) {}

  /**
   * Especifica el valor a ingresar
   * 
   * @param value - Texto a ingresar en el campo
   */
  with(value: string): Fill {
    this.value = value;
    return this;
  }

  /**
   * Escribe lentamente (simula escritura humana)
   */
  slowly(): Fill {
    this.slow = true;
    return this;
  }

  /**
   * Presiona Enter después de llenar el campo
   */
  andPressEnter(): Fill {
    this.pressEnter = true;
    return this;
  }

  /**
   * No limpiar el campo antes de llenar
   */
  withoutClearing(): Fill {
    this.clearFirst = false;
    return this;
  }

  /**
   * Ejecuta la acción de llenar el campo
   * 
   * @param actor - El actor que realiza la acción
   */
  async performAs(actor: Actor): Promise<void> {
    const page = BrowseTheWeb.from(actor);

    // Limpiar campo si es necesario
    if (this.clearFirst) {
      await page.fill(this.selector, '');
    }

    // Llenar el campo
    if (this.slow) {
      await page.type(this.selector, this.value, { delay: 100 });
    } else {
      await page.fill(this.selector, this.value);
    }

    // Presionar Enter si es necesario
    if (this.pressEnter) {
      await page.press(this.selector, 'Enter');
    }
  }
}
