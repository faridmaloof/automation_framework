/**
 * Actor Fixtures - Custom Playwright Test Fixtures
 * 
 * Proporciona inyección de dependencias para Actor con Abilities configuradas
 */

import { test as base, APIRequestContext, Page } from '@playwright/test';
import { Actor } from '../actors/actor';
import { BrowseTheWeb } from '../abilities/browseTheWeb';
import { CallAnAPI } from '../abilities/callAnAPI';
import { Logger } from '../core/helpers/logger';

// Tipos extendidos para fixtures
type ActorFixtures = {
  actor: Actor;
  apiActor: Actor;
  webActor: Actor;
  logger: Logger;
};

/**
 * Extend Playwright test con fixtures de Actor
 */
export const test = base.extend<ActorFixtures>({
  
  /**
   * Logger compartido para todos los tests
   */
  logger: async ({}, use) => {
    const logger = new Logger('ActorFixtures');
    await use(logger);
  },

  /**
   * Actor genérico (sin abilities por defecto)
   */
  actor: async ({ logger }, use) => {
    const actor = new Actor('TestUser');
    await use(actor);
  },

  /**
   * Actor configurado para API testing
   */
  apiActor: async ({ request, logger }, use) => {
    const actor = new Actor('APITester');
    actor.can(CallAnAPI.using(request));
    
    logger.info(`🎭 Actor "${actor.name}" configurado con CallAnAPI`);
    await use(actor);
    
    // Cleanup: Generar reporte de evidencias si hay requests
    const apiAbility = CallAnAPI.from(actor);
    if (apiAbility.getRequestLog().length > 0) {
      const report = apiAbility.generateEvidenceReport();
      logger.info('\n' + report);
    }
  },

  /**
   * Actor configurado para Web UI testing
   */
  webActor: async ({ page, logger }, use) => {
    const actor = new Actor('WebTester');
    actor.can(BrowseTheWeb.using(page));
    
    logger.info(`🎭 Actor "${actor.name}" configurado con BrowseTheWeb`);
    await use(actor);
  }
});

export { expect } from '@playwright/test';
