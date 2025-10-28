import { Before, After, BeforeAll, AfterAll, setDefaultTimeout, Status } from '@cucumber/cucumber';
import { chromium, firefox, webkit, request, Browser } from '@playwright/test';
import { CustomWorld } from './world';
import { Actor } from '../src/actors/actor';
import { CallAnAPI } from '../src/abilities/callAnAPI';
import { BrowseTheWeb } from '../src/abilities/browseTheWeb';

// Timeout global
setDefaultTimeout(60 * 1000);

/**
 * BEFORE: Setup automático basado en tags
 * Detecta @api, @web, @mobile y configura el contexto apropiado
 */
Before(async function (this: CustomWorld, { pickle }) {
  const tags = pickle.tags.map(t => t.name);
  const scenarioName = pickle.name;
  
  console.log(`\n🎬 Starting scenario: ${scenarioName}`);
  console.log(`📋 Tags: ${tags.join(', ')}`);

  // ========== SETUP API ==========
  if (tags.some(tag => tag.includes('@api'))) {
    console.log('🔧 Setting up API context...');
    
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
    
    console.log(`✅ API context ready (baseURL: ${baseURL})`);
  }

  // ========== SETUP WEB ==========
  if (tags.some(tag => tag.includes('@web'))) {
    console.log('🔧 Setting up Web context...');
    
    const headless = process.env.HEADLESS !== 'false';
    let browserType: Browser;

    // Detectar navegador por tag
    if (tags.includes('@firefox')) {
      browserType = await firefox.launch({ headless });
      console.log('🦊 Firefox browser launched');
    } else if (tags.includes('@safari') || tags.includes('@webkit')) {
      browserType = await webkit.launch({ headless });
      console.log('🧭 WebKit browser launched');
    } else {
      // Default: Chrome
      browserType = await chromium.launch({ headless });
      console.log('🌐 Chromium browser launched');
    }

    this.browser = browserType;
    this.page = await this.browser.newPage();
    
    // Crear Actor con habilidad BrowseTheWeb
    this.actor = new Actor('WebTester');
    this.actor.can(BrowseTheWeb.using(this.page));
    
    console.log('✅ Web context ready');
  }

  // ========== SETUP MOBILE ==========
  if (tags.some(tag => tag.includes('@mobile'))) {
    console.log('🔧 Setting up Mobile context...');
    
    // TODO: Appium setup
    this.actor = new Actor('MobileTester');
    // this.actor.can(UseAppium.using(appiumDriver));
    
    console.log('⚠️  Mobile context not fully implemented yet');
  }
});

/**
 * AFTER: Cleanup y evidencias
 */
After(async function (this: CustomWorld, { result, pickle }) {
  const scenarioName = pickle.name;
  
  if (result?.status === Status.PASSED) {
    console.log(`✅ Scenario PASSED: ${scenarioName}`);
  } else if (result?.status === Status.FAILED) {
    console.log(`❌ Scenario FAILED: ${scenarioName}`);
    
    // Screenshot en caso de fallo (Web)
    if (this.page) {
      const screenshot = await this.page.screenshot({ fullPage: true });
      this.attach(screenshot, 'image/png');
    }
  }

  // Cleanup Browser
  if (this.browser) {
    await this.browser.close();
    console.log('🧹 Browser closed');
  }

  // Cleanup API Context
  if (this.apiContext) {
    await this.apiContext.dispose();
    console.log('🧹 API context disposed');
  }
});

/**
 * BEFORE ALL: Setup inicial
 */
BeforeAll(async function () {
  console.log('\n🚀 ===== CUCUMBER TEST EXECUTION STARTED =====\n');
  console.log(`Environment: ${process.env.NODE_ENV || 'test'}`);
  console.log(`Base URL: ${process.env.API_BASE_URL || 'https://pokeapi.co'}`);
  console.log(`Headless: ${process.env.HEADLESS !== 'false'}\n`);
});

/**
 * AFTER ALL: Cleanup final
 */
AfterAll(async function () {
  console.log('\n🏁 ===== CUCUMBER TEST EXECUTION COMPLETED =====\n');
});
