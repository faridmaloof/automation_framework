/**
 * Step Definitions: PokeAPI Documentation Navigation Tests
 * 
 * Estos steps implementan los escenarios definidos en navegacion-documentacion.feature
 * utilizando el patrón Screenplay (Actor, Task, Question)
 */

import { Given, When, Then, DataTable } from '@cucumber/cucumber';
import { CustomWorld } from '../support/world';
import { expect } from '@playwright/test';

// Import Tasks
import { NavigateToPokeAPIDocs } from '../src/tasks/web/docs/NavigateToPokeAPIDocs';
import { ClickLink } from '../src/tasks/web/docs/ClickLink';
import { ChangeViewport } from '../src/tasks/web/docs/ChangeViewport';

// Import Questions
import { SeeHeading } from '../src/questions/web/docs/SeeHeading';
import { SeeLink } from '../src/questions/web/docs/SeeLink';
import { SeeText } from '../src/questions/web/docs/SeeText';
import { SeeDeprecationMessage } from '../src/questions/web/docs/SeeDeprecationMessage';
import { SeeDeprecationDate } from '../src/questions/web/docs/SeeDeprecationDate';
import { SeeGraphQLTitle } from '../src/questions/web/docs/SeeGraphQLTitle';
import { SeeGraphQLEndpoint } from '../src/questions/web/docs/SeeGraphQLEndpoint';
import { SeeGraphiQLSection } from '../src/questions/web/docs/SeeGraphiQLSection';
import { SeeFairUseTitle } from '../src/questions/web/docs/SeeFairUseTitle';
import { SeeResourceSections } from '../src/questions/web/docs/SeeResourceSections';
import { SeeEndpointExamples } from '../src/questions/web/docs/SeeEndpointExamples';
import { LinksAreClickable } from '../src/questions/web/docs/LinksAreClickable';
import { LinksHaveValidURLs } from '../src/questions/web/docs/LinksHaveValidURLs';
import { NavigationIsAccessible } from '../src/questions/web/docs/NavigationIsAccessible';
import { ContentIsReadable } from '../src/questions/web/docs/ContentIsReadable';

// ========================================
// GIVEN - Precondiciones
// ========================================

/**
 * Dado que estoy en la página de documentación de PokeAPI
 */
Given('que estoy en la página de documentación de PokeAPI', async function (this: CustomWorld) {
  console.log('🌐 Navegando a la página de documentación de PokeAPI');
  
  const task = new NavigateToPokeAPIDocs();
  await this.actor.attemptsTo(task);
  
  console.log('✅ Navegación completada');
});

// ========================================
// WHEN - Acciones
// ========================================

/**
 * Cuando hago clic en el enlace "{string}"
 */
When('hago clic en el enlace {string}', async function (this: CustomWorld, linkText: string) {
  console.log(`🖱️ Haciendo clic en el enlace: ${linkText}`);
  
  await this.actor.attemptsTo(ClickLink.on(linkText));
  
  console.log('✅ Clic completado');
});

/**
 * Cuando cambio el tamaño del viewport a {string}
 */
When('cambio el tamaño del viewport a {string}', async function (this: CustomWorld, deviceType: string) {
  console.log(`📱 Cambiando viewport a: ${deviceType}`);
  
  await this.actor.attemptsTo(ChangeViewport.to(deviceType));
  
  console.log('✅ Viewport cambiado');
});

// ========================================
// THEN - Verificaciones
// ========================================

/**
 * Entonces debo ver el encabezado "{string}"
 */
Then('debo ver el encabezado {string}', async function (this: CustomWorld, heading: string) {
  console.log(`👀 Verificando encabezado: ${heading}`);
  
  const isVisible = await this.actor.asks(SeeHeading.withText(heading));
  
  expect(isVisible).toBe(true);
  console.log('✅ Encabezado verificado');
});

/**
 * Y debo ver los enlaces de navegación principales:
 *   | API v1         |
 *   | API v2         |
 *   | GraphQL v1beta |
 */
Then('debo ver los enlaces de navegación principales:', async function (this: CustomWorld, dataTable: DataTable) {
  console.log('👀 Verificando enlaces de navegación principales');
  
  const links = dataTable.raw().flat(); // Obtener todos los valores de la tabla
  
  for (const linkText of links) {
    console.log(`  📎 Verificando enlace: ${linkText}`);
    const isVisible = await this.actor.asks(SeeLink.withText(linkText));
    expect(isVisible).toBe(true);
  }
  
  console.log('✅ Todos los enlaces verificados');
});

/**
 * Entonces debo ver el mensaje de deprecación "{string}"
 */
Then('debo ver el mensaje de deprecación {string}', async function (this: CustomWorld, message: string) {
  console.log(`👀 Verificando mensaje de deprecación: ${message}`);
  
  const isVisible = await this.actor.asks(SeeDeprecationMessage.displayed());
  
  expect(isVisible).toBe(true);
  console.log('✅ Mensaje de deprecación verificado');
});

/**
 * Y debo ver la fecha de fin de soporte "{string}"
 */
Then('debo ver la fecha de fin de soporte {string}', async function (this: CustomWorld, date: string) {
  console.log(`👀 Verificando fecha de fin de soporte: ${date}`);
  
  const isVisible = await this.actor.asks(SeeDeprecationDate.displayed());
  
  expect(isVisible).toBe(true);
  console.log('✅ Fecha de fin de soporte verificada');
});

/**
 * Entonces debo ver el título de GraphQL
 */
Then('debo ver el título de GraphQL', async function (this: CustomWorld) {
  console.log('👀 Verificando título de GraphQL');
  
  const isVisible = await this.actor.asks(SeeGraphQLTitle.displayed());
  
  expect(isVisible).toBe(true);
  console.log('✅ Título de GraphQL verificado');
});

/**
 * Y debo ver la URL del endpoint "{string}"
 */
Then('debo ver la URL del endpoint {string}', async function (this: CustomWorld, endpoint: string) {
  console.log(`👀 Verificando URL del endpoint: ${endpoint}`);
  
  const isVisible = await this.actor.asks(SeeGraphQLEndpoint.displayed());
  
  expect(isVisible).toBe(true);
  console.log('✅ URL del endpoint verificada');
});

/**
 * Y debo ver la sección "{string}"
 */
Then('debo ver la sección {string}', async function (this: CustomWorld, sectionName: string) {
  console.log(`👀 Verificando sección: ${sectionName}`);
  
  let isVisible = false;
  
  // Determinar qué Question usar según la sección
  switch (sectionName) {
    case 'GraphiQL':
      isVisible = await this.actor.asks(SeeGraphiQLSection.displayed());
      break;
    case 'Fair Use Policy':
      isVisible = await this.actor.asks(SeeFairUseTitle.displayed());
      break;
    default:
      // Para secciones genéricas, usar SeeText
      isVisible = await this.actor.asks(SeeText.containing(sectionName));
  }
  
  expect(isVisible).toBe(true);
  console.log('✅ Sección verificada');
});

/**
 * Y debo ver las secciones de recursos
 */
Then('debo ver las secciones de recursos', async function (this: CustomWorld) {
  console.log('👀 Verificando secciones de recursos');
  
  const areVisible = await this.actor.asks(SeeResourceSections.displayed());
  
  expect(areVisible).toBe(true);
  console.log('✅ Secciones de recursos verificadas');
});

/**
 * Y debo ver ejemplos de endpoints
 */
Then('debo ver ejemplos de endpoints', async function (this: CustomWorld) {
  console.log('👀 Verificando ejemplos de endpoints');
  
  const areVisible = await this.actor.asks(SeeEndpointExamples.displayed());
  
  expect(areVisible).toBe(true);
  console.log('✅ Ejemplos de endpoints verificados');
});

/**
 * Entonces todos los enlaces principales deben ser clickeables
 */
Then('todos los enlaces principales deben ser clickeables', async function (this: CustomWorld) {
  console.log('👀 Verificando que todos los enlaces sean clickeables');
  
  const areClickable = await this.actor.asks(LinksAreClickable.check());
  
  expect(areClickable).toBe(true);
  console.log('✅ Todos los enlaces son clickeables');
});

/**
 * Y todos los enlaces deben tener URLs válidas
 */
Then('todos los enlaces deben tener URLs válidas', async function (this: CustomWorld) {
  console.log('👀 Verificando que todos los enlaces tengan URLs válidas');
  
  const haveValidURLs = await this.actor.asks(LinksHaveValidURLs.check());
  
  expect(haveValidURLs).toBe(true);
  console.log('✅ Todos los enlaces tienen URLs válidas');
});

/**
 * Y la navegación debe ser accesible
 */
Then('la navegación debe ser accesible', async function (this: CustomWorld) {
  console.log('👀 Verificando accesibilidad de la navegación');
  
  const isAccessible = await this.actor.asks(NavigationIsAccessible.check());
  
  expect(isAccessible).toBe(true);
  console.log('✅ Navegación accesible');
});

/**
 * Y el contenido debe ser legible
 */
Then('el contenido debe ser legible', async function (this: CustomWorld) {
  console.log('👀 Verificando legibilidad del contenido');
  
  const isReadable = await this.actor.asks(ContentIsReadable.check());
  
  expect(isReadable).toBe(true);
  console.log('✅ Contenido legible');
});
