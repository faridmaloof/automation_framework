import { World, IWorldOptions, setWorldConstructor } from '@cucumber/cucumber';
import { Page, Browser, BrowserContext, chromium, firefox, webkit, APIRequestContext, request } from '@playwright/test';
import { Actor } from '../../actors/actor';
import { BrowseTheWeb } from '../../abilities/browseTheWeb';
import { CallAnAPI } from '../../abilities/callAnAPI';
import { AccessDatabase } from '../../abilities/accessDatabase';
import { Logger } from '../helpers/logger';
import { DatabaseClient } from '../database/databaseClient';

/**
 * CustomWorld - Contexto compartido entre steps de Cucumber
 * Proporciona acceso a:
 * - Actor (Screenplay Pattern)
 * - Browser, Context, Page (Playwright)
 * - Logger
 * - Database Client
 * - API Client
 * - Evidencias (screenshots, videos, API calls)
 */
export class CustomWorld extends World {
  // Playwright
  public browser?: Browser;
  public context?: BrowserContext;
  public page?: Page;
  
  // Screenplay Pattern
  public actor?: Actor;
  
  // Utilities
  public logger: Logger;
  public database?: DatabaseClient;
  
  // Evidence tracking
  public apiCalls: APICallEvidence[] = [];
  public screenshots: string[] = [];
  
  // Configuration
  public baseURL: string;
  public environment: string;
  
  constructor(options: IWorldOptions) {
    super(options);
    
    // Initialize logger
    this.logger = new Logger('Cucumber');
    
    // Load environment configuration
    this.environment = process.env.ENV || 'qa';
    this.baseURL = this.getBaseURL();
    
    this.logger.info(`🌍 World initialized for environment: ${this.environment}`);
  }
  
  /**
   * Inicializa el browser y crea el actor
   */
  async initializeBrowser(browserType: 'chromium' | 'firefox' | 'webkit' = 'chromium') {
    this.logger.info(`🌐 Launching ${browserType} browser...`);
    
    // Launch browser
    const browsers = { chromium, firefox, webkit };
    this.browser = await browsers[browserType].launch({
      headless: process.env.HEADLESS !== 'false',
      slowMo: parseInt(process.env.SLOW_MO || '0')
    });
    
    // Create context
    this.context = await this.browser.newContext({
      viewport: { width: 1280, height: 720 },
      recordVideo: process.env.RECORD_VIDEO === 'true' ? {
        dir: 'reports/videos/',
        size: { width: 1280, height: 720 }
      } : undefined
    });
    
    // Enable tracing
    await this.context.tracing.start({
      screenshots: true,
      snapshots: true,
      sources: true
    });
    
    // Create page
    this.page = await this.context.newPage();
    
    // Create actor with abilities
    this.actor = new Actor('TestUser');
    this.actor.can(BrowseTheWeb.using(this.page));
    
    // Create API context
    const apiContext = await request.newContext({
      baseURL: this.baseURL
    });
    this.actor.can(CallAnAPI.using(apiContext));
    
    // Connect to database if needed
    if (process.env.USE_DATABASE === 'true') {
      this.database = new DatabaseClient();
      await this.database.connect(this.environment);
      this.actor.can(AccessDatabase.using(this.database));
    }
    
    this.logger.info('✅ Browser and Actor initialized');
  }
  
  /**
   * Captura screenshot y lo adjunta al reporte
   */
  async captureScreenshot(name: string) {
    if (!this.page) return;
    
    const timestamp = new Date().toISOString().replace(/:/g, '-');
    const filename = `screenshot-${name}-${timestamp}.png`;
    const path = `reports/screenshots/${filename}`;
    
    const screenshot = await this.page.screenshot({
      path,
      fullPage: true
    });
    
    this.screenshots.push(path);
    
    // Attach to Cucumber report
    this.attach(screenshot, 'image/png');
    
    this.logger.info(`📸 Screenshot captured: ${filename}`);
  }
  
  /**
   * Captura evidencia de llamada API
   */
  captureAPICall(evidence: APICallEvidence) {
    this.apiCalls.push(evidence);
    
    // Format and attach to Cucumber report
    const formatted = this.formatAPIEvidence(evidence);
    this.attach(formatted, 'text/plain');
    
    this.logger.info(`📡 API Call captured: ${evidence.method} ${evidence.url}`);
  }
  
  /**
   * Formatea evidencia de API para el reporte
   */
  private formatAPIEvidence(evidence: APICallEvidence): string {
    return `
╔════════════════════════════════════════════════════════════════════════════╗
║                              API CALL EVIDENCE                             ║
╠════════════════════════════════════════════════════════════════════════════╣
║ Timestamp: ${evidence.timestamp}
║ Method:    ${evidence.method}
║ URL:       ${evidence.url}
║ Status:    ${evidence.response.status} ${evidence.response.statusText}
║ Duration:  ${evidence.duration}ms
╠════════════════════════════════════════════════════════════════════════════╣
║ REQUEST HEADERS:
${this.formatHeaders(evidence.request.headers)}
╠════════════════════════════════════════════════════════════════════════════╣
║ REQUEST BODY:
${evidence.request.body ? JSON.stringify(evidence.request.body, null, 2) : '  (empty)'}
╠════════════════════════════════════════════════════════════════════════════╣
║ RESPONSE HEADERS:
${this.formatHeaders(evidence.response.headers)}
╠════════════════════════════════════════════════════════════════════════════╣
║ RESPONSE BODY:
${evidence.response.body ? JSON.stringify(evidence.response.body, null, 2) : '  (empty)'}
╚════════════════════════════════════════════════════════════════════════════╝
    `.trim();
  }
  
  private formatHeaders(headers: Record<string, string>): string {
    return Object.entries(headers)
      .map(([key, value]) => `  ${key}: ${value}`)
      .join('\n') || '  (none)';
  }
  
  /**
   * Cleanup - Cierra browser, database, guarda traces
   */
  async cleanup() {
    this.logger.info('🧹 Cleaning up world...');
    
    // Save trace
    if (this.context) {
      const timestamp = new Date().toISOString().replace(/:/g, '-');
      await this.context.tracing.stop({
        path: `reports/traces/trace-${timestamp}.zip`
      });
    }
    
    // Close page, context, browser
    await this.page?.close();
    await this.context?.close();
    await this.browser?.close();
    
    // Disconnect database
    if (this.database) {
      await this.database.disconnect();
    }
    
    this.logger.info('✅ Cleanup completed');
  }
  
  /**
   * Get base URL based on environment
   */
  private getBaseURL(): string {
    const urls: Record<string, string> = {
      dev: process.env.BASE_URL_DEV || 'http://localhost:3000',
      qa: process.env.BASE_URL_QA || 'https://pokeapi.co',
      staging: process.env.BASE_URL_STAGING || 'https://staging.pokeapi.co',
      prod: process.env.BASE_URL_PROD || 'https://pokeapi.co'
    };
    
    return urls[this.environment] || urls.qa;
  }
}

/**
 * Interface para evidencia de llamadas API
 */
export interface APICallEvidence {
  timestamp: string;
  method: string;
  url: string;
  request: {
    headers: Record<string, string>;
    body?: any;
  };
  response: {
    status: number;
    statusText: string;
    headers: Record<string, string>;
    body?: any;
  };
  duration: number;
}

// Set as default World
setWorldConstructor(CustomWorld);
