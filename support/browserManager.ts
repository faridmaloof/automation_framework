/**
 * Multi-Browser Configuration Helper
 * 
 * Soporta ejecución en múltiples browsers cuando se configura:
 * BROWSER=chromium,firefox,webkit
 */

import { Browser, BrowserType, chromium, firefox, webkit } from '@playwright/test';
import { Logger } from '../src/helpers/logger';

const logger = new Logger('BrowserManager');

export class BrowserManager {
  private static browsers: Browser[] = [];
  
  /**
   * Mapeo de nombres de browser a tipos de Playwright
   */
  private static browserTypes: Record<string, BrowserType> = {
    chromium: chromium,
    chrome: chromium,
    firefox: firefox,
    webkit: webkit,
    safari: webkit,
    edge: chromium, // Edge usa Chromium
  };

  /**
   * Obtener lista de browsers desde .env
   */
  static getBrowserList(): string[] {
    const browserEnv = process.env.BROWSER || 'chromium';
    const browsers = browserEnv.split(',').map(b => b.trim().toLowerCase());
    
    // Validar browsers soportados
    const unsupported = browsers.filter(b => !this.browserTypes[b]);
    if (unsupported.length > 0) {
      logger.warn(`⚠️ Browsers no soportados (ignorados): ${unsupported.join(', ')}`);
    }
    
    return browsers.filter(b => this.browserTypes[b]);
  }

  /**
   * Lanzar browser por nombre
   */
  static async launchBrowser(browserName: string): Promise<Browser> {
    const browserType = this.browserTypes[browserName];
    
    if (!browserType) {
      throw new Error(`Browser no soportado: ${browserName}`);
    }

    const headless = process.env.HEADLESS !== 'false';
    const slowMo = parseInt(process.env.SLOWMO || '0', 10);

    logger.info(`🌐 Lanzando browser: ${browserName} (headless: ${headless})`);

    const browser = await browserType.launch({
      headless,
      slowMo,
      args: browserName === 'chromium' ? [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
      ] : [],
    });

    this.browsers.push(browser);
    return browser;
  }

  /**
   * Lanzar todos los browsers configurados
   */
  static async launchAllBrowsers(): Promise<Map<string, Browser>> {
    const browserNames = this.getBrowserList();
    const browserMap = new Map<string, Browser>();

    if (browserNames.length > 1) {
      logger.info(`🌐 Multi-browser mode: ${browserNames.join(', ')}`);
    }

    for (const name of browserNames) {
      try {
        const browser = await this.launchBrowser(name);
        browserMap.set(name, browser);
      } catch (error) {
        logger.error(`❌ Error lanzando ${name}: ${error}`);
      }
    }

    return browserMap;
  }

  /**
   * Cerrar todos los browsers
   */
  static async closeAllBrowsers(): Promise<void> {
    logger.info('🔒 Cerrando browsers...');
    
    for (const browser of this.browsers) {
      try {
        await browser.close();
      } catch (error) {
        logger.error(`Error cerrando browser: ${error}`);
      }
    }
    
    this.browsers = [];
  }

  /**
   * Verificar si multi-browser está habilitado
   */
  static isMultiBrowserMode(): boolean {
    return this.getBrowserList().length > 1;
  }

  /**
   * Obtener browser actual (para single-browser mode)
   */
  static getCurrentBrowser(): string {
    return this.getBrowserList()[0] || 'chromium';
  }
}
