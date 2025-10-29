import { Before, After, BeforeAll, AfterAll, setDefaultTimeout, Status } from '@cucumber/cucumber';
import { chromium, firefox, webkit, request, Browser } from '@playwright/test';
import { CustomWorld } from './world';
import { Actor } from '../src/actors/actor';
import { CallAnAPI } from '../src/abilities/callAnAPI';
import { BrowseTheWeb } from '../src/abilities/browseTheWeb';
import { Logger, flushLogs } from '../src/helpers/logger';
import dotenv from 'dotenv';

// Cargar variables de entorno ANTES que cualquier otra cosa
dotenv.config();

// Timeout global
setDefaultTimeout(60 * 1000);

// Global logger for hooks
const hookLogger = new Logger('Hooks');

/**
 * BEFORE: Setup automático basado en tags
 * Detecta @api, @web, @mobile y configura el contexto apropiado
 */
Before(async function (this: CustomWorld, { pickle }) {
  const tags = pickle.tags.map(t => t.name);
  const scenarioName = pickle.name;
  
  hookLogger.scenario(scenarioName, tags);

  // ========== SETUP API ==========
  if (tags.some(tag => tag.includes('@api'))) {
    hookLogger.info('Setting up API context...');
    
    const baseURL = this.baseURL;
    this.apiContext = await request.newContext({ 
      baseURL,
      extraHTTPHeaders: {
        'Accept': 'application/json',
      }
    });
    
    // Crear Actor con habilidad CallAnAPI
    this.actor = new Actor('APITester');
    this.actor.can(CallAnAPI.using(this.apiContext));
    
    hookLogger.success(`API context ready (baseURL: ${baseURL})`);
  }

  // ========== SETUP WEB ==========
  if (tags.some(tag => tag.includes('@web'))) {
    hookLogger.info('Setting up Web context...');
    
    const headless = process.env.HEADLESS !== 'false';
    let browserType: Browser;

    // Detectar navegador por tag
    if (tags.includes('@firefox')) {
      browserType = await firefox.launch({ headless });
      hookLogger.info('Firefox browser launched');
    } else if (tags.includes('@safari') || tags.includes('@webkit')) {
      browserType = await webkit.launch({ headless });
      hookLogger.info('WebKit browser launched');
    } else {
      // Default: Chrome
      browserType = await chromium.launch({ headless });
      hookLogger.info('Chromium browser launched');
    }

    this.browser = browserType;
    this.page = await this.browser.newPage();
    
    // Crear Actor con habilidad BrowseTheWeb
    this.actor = new Actor('WebTester');
    this.actor.can(BrowseTheWeb.using(this.page));
    
    hookLogger.success('Web context ready');
  }

  // ========== SETUP MOBILE ==========
  if (tags.some(tag => tag.includes('@mobile'))) {
    hookLogger.info('Setting up Mobile context...');
    
    // TODO: Appium setup
    this.actor = new Actor('MobileTester');
    // this.actor.can(UseAppium.using(appiumDriver));
    
    hookLogger.warn('Mobile context not fully implemented yet');
  }
});

/**
 * AFTER: Cleanup y evidencias
 */
After(async function (this: CustomWorld, { result, pickle }) {
  const scenarioName = pickle.name;
  
  if (result?.status === Status.PASSED) {
    hookLogger.result('PASSED', scenarioName);
  } else if (result?.status === Status.FAILED) {
    hookLogger.result('FAILED', scenarioName);
    
    // Screenshot en caso de fallo (Web)
    if (this.page) {
      const screenshot = await this.page.screenshot({ fullPage: true });
      this.attach(screenshot, 'image/png');
    }
  }

  // Attach API Evidence if available
  if (this.actor) {
    try {
      const CallAnAPI = await import('../src/abilities/callAnAPI');
      const apiAbility = CallAnAPI.CallAnAPI.from(this.actor);
      const requestLog = apiAbility.getRequestLog();
      
      if (requestLog.length > 0) {
        // Attach as JSON for machine parsing
        this.attach(JSON.stringify(requestLog, null, 2), 'application/json');
        
        // Attach as formatted text for human reading
        const report = apiAbility.generateEvidenceReport();
        this.attach(report, 'text/plain');
      }
    } catch (error) {
      // Actor doesn't have CallAnAPI ability (Web/Mobile tests)
    }
  }

  // Cleanup Browser
  if (this.browser) {
    await this.browser.close();
    hookLogger.debug('Browser closed');
  }

  // Cleanup API Context
  if (this.apiContext) {
    await this.apiContext.dispose();
    hookLogger.debug('API context disposed');
  }

  // Flush logs to disk
  await flushLogs();
});

/**
 * BEFORE ALL: Setup inicial con validaciones mandatorias
 */
BeforeAll(async function () {
  hookLogger.info('===== CUCUMBER TEST EXECUTION STARTED =====');
  hookLogger.info(`Environment: ${process.env.NODE_ENV || 'test'}`);
  
  // ========== VALIDACIONES MANDATORIAS ==========
  const mandatoryVars = ['API_BASE_URL'];
  const missingVars: string[] = [];
  
  mandatoryVars.forEach(varName => {
    if (!process.env[varName]) {
      missingVars.push(varName);
    }
  });
  
  if (missingVars.length > 0) {
    const errorMsg = `
╔════════════════════════════════════════════════════════════════╗
║  ❌ CONFIGURACIÓN MANDATORIA FALTANTE                         ║
╚════════════════════════════════════════════════════════════════╝

Variables requeridas no configuradas en .env:
${missingVars.map(v => `  • ${v}`).join('\n')}

📋 Pasos para solucionar:
  1. Copia .env.example a .env
  2. Configura las variables mandatorias
  3. Vuelve a ejecutar los tests

Ejemplo:
  cp .env.example .env
  # Edita .env y configura ${missingVars[0]}=<valor>
`;
    hookLogger.error(errorMsg);
    throw new Error(`❌ Faltan variables mandatorias: ${missingVars.join(', ')}`);
  }
  
  // ========== INFORMACIÓN DE CONFIGURACIÓN ==========
  hookLogger.info(`API Base URL: ${process.env.API_BASE_URL}`);
  hookLogger.info(`Headless: ${process.env.HEADLESS !== 'false'}`);
  hookLogger.info(`Environment: ${process.env.ENV || 'dev'}`);
  hookLogger.info(`Browser(s): ${process.env.BROWSER || 'chromium'}`);
});

/**
 * AFTER ALL: Cleanup final
 */
AfterAll(async function () {
  hookLogger.info('===== CUCUMBER TEST EXECUTION COMPLETED =====');
  await flushLogs(); // Final flush
});
