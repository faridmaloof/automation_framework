/**
 * Common Hooks
 * 
 * Hooks globales para todas las features de Cucumber.
 * Gestionan el ciclo de vida de los tests: Before, After, BeforeStep, AfterStep.
 */

import { Before, After, BeforeStep, AfterStep, Status } from '@cucumber/cucumber';

/**
 * BEFORE HOOKS - Se ejecutan antes de cada scenario
 */

Before(async function(scenario) {
  this.logger.info('╔═══════════════════════════════════════════════════════════════');
  this.logger.info(`║ 🎬 INICIO DEL SCENARIO: ${scenario.pickle.name}`);
  this.logger.info(`║ Feature: ${scenario.gherkinDocument.feature?.name}`);
  this.logger.info(`║ Tags: ${scenario.pickle.tags.map(t => t.name).join(', ')}`);
  this.logger.info('╚═══════════════════════════════════════════════════════════════');
  
  // Capturar información del scenario en el World
  this.scenarioName = scenario.pickle.name;
  this.scenarioTags = scenario.pickle.tags.map(t => t.name);
  this.scenarioStartTime = Date.now();
});

/**
 * AFTER HOOKS - Se ejecutan después de cada scenario
 */

After(async function(scenario) {
  const duration = Date.now() - (this.scenarioStartTime || 0);
  const durationSeconds = (duration / 1000).toFixed(2);
  
  this.logger.info('╔═══════════════════════════════════════════════════════════════');
  this.logger.info(`║ 🏁 FIN DEL SCENARIO: ${scenario.pickle.name}`);
  this.logger.info(`║ Status: ${scenario.result?.status || 'UNKNOWN'}`);
  this.logger.info(`║ Duración: ${durationSeconds}s`);
  
  // Si el scenario falló, capturar screenshot y evidencia adicional
  if (scenario.result?.status === Status.FAILED) {
    this.logger.error(`║ ❌ SCENARIO FAILED`);
    
    // Capturar screenshot del fallo si hay página
    if (this.page) {
      try {
        await this.captureScreenshot(`FAILED-${scenario.pickle.name}-${Date.now()}`);
      } catch (error: any) {
        this.logger.error(`Error capturando screenshot de fallo: ${error?.message}`);
      }
    }
    
    // Adjuntar log de error
    if (scenario.result?.message) {
      this.attach(`\n❌ ERROR MESSAGE:\n${scenario.result.message}`, 'text/plain');
    }
    
    // Generar reporte de evidencias API si hubo llamadas
    if (this.actor) {
      const abilities = (this.actor as any).abilities as Map<string, any>;
      const apiAbility = abilities.get('CallAnAPI');
      
      if (apiAbility) {
        const apiReport = apiAbility.generateEvidenceReport();
        this.attach(apiReport, 'text/plain');
      }
    }
  } else if (scenario.result?.status === Status.PASSED) {
    this.logger.info(`║ ✅ SCENARIO PASSED`);
  }
  
  this.logger.info('╚═══════════════════════════════════════════════════════════════\n');
  
  // Limpiar recursos si es necesario
  // El browser se cierra automáticamente por Playwright fixtures
});

/**
 * BEFORE STEP HOOKS - Se ejecutan antes de cada step
 */

BeforeStep(async function(step) {
  this.currentStepText = step.pickleStep.text;
  this.currentStepStartTime = Date.now();
  
  this.logger.info(`\n  ⏩ STEP: ${step.pickleStep.text}`);
});

/**
 * AFTER STEP HOOKS - Se ejecutan después de cada step
 */

AfterStep(async function(step) {
  const duration = Date.now() - (this.currentStepStartTime || 0);
  
  if (step.result?.status === Status.FAILED) {
    this.logger.error(`  ❌ STEP FAILED (${duration}ms): ${this.currentStepText}`);
    
    // Capturar screenshot del step fallido
    if (this.page && this.scenarioTags?.includes('@web')) {
      try {
        await this.captureScreenshot(`STEP-FAILED-${Date.now()}`);
      } catch (error: any) {
        this.logger.error(`Error capturando screenshot: ${error?.message}`);
      }
    }
  } else if (step.result?.status === Status.PASSED) {
    this.logger.info(`  ✅ STEP PASSED (${duration}ms)`);
  }
});

/**
 * HOOKS ESPECÍFICOS POR TAGS
 */

// Hook para tests de API - captura evidencias adicionales
Before({ tags: '@api' }, async function() {
  this.logger.info('🔧 Test de API detectado - evidencias automáticas habilitadas');
  this.apiTestMode = true;
});

// Hook para tests web - configuraciones especiales de navegador
Before({ tags: '@web or @ui' }, async function() {
  this.logger.info('🌐 Test web detectado - configurando navegador');
  this.webTestMode = true;
  
  // Configurar viewport si es necesario
  if (this.page) {
    await this.page.setViewportSize({ width: 1920, height: 1080 });
  }
});

// Hook para tests de performance - captura métricas adicionales
Before({ tags: '@performance' }, async function() {
  this.logger.info('⚡ Test de performance detectado - métricas habilitadas');
  this.performanceTestMode = true;
  this.performanceMetrics = {
    startTime: Date.now(),
    requests: []
  };
});

After({ tags: '@performance' }, async function() {
  if (this.performanceMetrics) {
    const totalDuration = Date.now() - this.performanceMetrics.startTime;
    
    const performanceReport = `
╔═══════════════════════════════════════════════════════════════
║ ⚡ PERFORMANCE METRICS
╠═══════════════════════════════════════════════════════════════
║ Total Duration: ${totalDuration}ms
║ Total Requests: ${this.performanceMetrics.requests.length}
╚═══════════════════════════════════════════════════════════════
    `;
    
    this.attach(performanceReport, 'text/plain');
    this.logger.info(performanceReport);
  }
});
