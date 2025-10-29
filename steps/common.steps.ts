import { Given } from '@cucumber/cucumber';
import { CustomWorld } from '../support/world';

// ========================================
// GIVEN - Generic Setup/Preparation Steps
// These steps are truly generic and can be used by Web, API, or Mobile tests
// ========================================

Given('the system is available', async function (this: CustomWorld) {
  // System is already configured in hooks.ts based on tags
  console.log('✅ System ready for testing');
});

Given('el sistema está disponible', async function (this: CustomWorld) {
  // El sistema ya está configurado en hooks.ts según los tags
  console.log('✅ Sistema listo para testing');
});

