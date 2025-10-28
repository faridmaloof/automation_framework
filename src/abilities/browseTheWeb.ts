/**
 * BrowseTheWeb Ability
 * 
 * Representa la habilidad de un Actor para interactuar con una aplicación web
 * mediante Playwright. Esta clase encapsula el objeto Page de Playwright
 * y lo hace accesible a través del patrón Screenplay.
 * 
 * Ejemplo de uso:
 * ```typescript
 * const actor = Actor.named('TestUser')
 *   .whoCan(BrowseTheWeb.using(page));
 * 
 * await actor.attemptsTo(
 *   Navigate.to('https://pokeapi.co'),
 *   Click.on('button#search')
 * );
 * ```
 */

import { Page } from '@playwright/test';
import { Ability } from './ability';
import { Actor } from '../actors/actor';

export class BrowseTheWeb extends Ability {
  /**
   * Crea una instancia de BrowseTheWeb con un Page específico
   * 
   * @param page - Instancia de Playwright Page
   * @returns Nueva instancia de BrowseTheWeb
   * 
   * @example
   * ```typescript
   * const browseAbility = BrowseTheWeb.using(page);
   * ```
   */
  static using(page: Page): BrowseTheWeb {
    return new BrowseTheWeb(page);
  }

  /**
   * Obtiene la habilidad BrowseTheWeb de un Actor
   * 
   * @param actor - El actor del cual obtener la habilidad
   * @returns El Page de Playwright
   * 
   * @example
   * ```typescript
   * const page = BrowseTheWeb.from(actor);
   * await page.goto('https://example.com');
   * ```
   */
  static from(actor: Actor): Page {
    const abilities = (actor as any).abilities as Map<string, Ability>;
    const ability = abilities.get('BrowseTheWeb');
    
    if (!ability) {
      throw new Error(`Actor ${actor.name} does not have BrowseTheWeb ability`);
    }
    
    return ability.as(actor);
  }

  /**
   * Constructor privado - usar el método estático `using()` en su lugar
   */
  private constructor(private page: Page) {
    super();
  }

  /**
   * Returns the unique name identifier for this ability
   */
  name(): string {
    return 'BrowseTheWeb';
  }

  /**
   * Devuelve el Page asociado a este Actor
   * 
   * Este método es usado internamente por las Interactions para
   * acceder al objeto Page de Playwright.
   * 
   * @param actor - El actor que ejecuta la acción
   * @returns Instancia de Playwright Page
   * 
   * @example
   * ```typescript
   * const page = BrowseTheWeb.as(actor);
   * await page.goto('https://example.com');
   * ```
   */
  as(actor: Actor): Page {
    return this.page;
  }

  /**
   * Método de conveniencia para obtener el Page directamente
   * 
   * @returns Instancia de Playwright Page
   */
  getPage(): Page {
    return this.page;
  }

  /**
   * Navega a una URL específica
   * 
   * @param url - URL de destino
   * @param options - Opciones de navegación de Playwright
   */
  async navigateTo(url: string, options?: any): Promise<void> {
    await this.page.goto(url, options);
  }

  /**
   * Espera a que un selector sea visible
   * 
   * @param selector - Selector CSS o XPath
   * @param timeout - Timeout en milisegundos (default: 30000)
   */
  async waitForSelector(selector: string, timeout: number = 30000): Promise<void> {
    await this.page.waitForSelector(selector, { timeout });
  }

  /**
   * Toma un screenshot de la página actual
   * 
   * @param options - Opciones de screenshot de Playwright
   * @returns Buffer con la imagen
   */
  async takeScreenshot(options?: any): Promise<Buffer> {
    return await this.page.screenshot(options);
  }

  /**
   * Obtiene el título de la página actual
   * 
   * @returns Título de la página
   */
  async getTitle(): Promise<string> {
    return await this.page.title();
  }

  /**
   * Obtiene la URL actual
   * 
   * @returns URL actual
   */
  getCurrentUrl(): string {
    return this.page.url();
  }

  /**
   * Cierra el navegador
   */
  async close(): Promise<void> {
    await this.page.close();
  }
}
