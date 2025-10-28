import { Given, When, Then } from '@cucumber/cucumber';
import { CustomWorld } from '../support/world';
import { GetPokemon } from '../src/tasks/api/rest/GetPokemon';
import { StatusCode } from '../src/questions/api/StatusCode';
import { FieldValue } from '../src/questions/api/FieldValue';
import { HasField } from '../src/questions/api/HasField';
import { ResponseTime } from '../src/questions/api/ResponseTime';
import { SchemaValidation } from '../src/questions/api/SchemaValidation';
import { pokemonSchema } from '../src/schemas/pokemonSchema';

// ========================================
// GIVEN - Preparación
// ========================================

Given('el sistema está disponible', async function (this: CustomWorld) {
  // El sistema ya está configurado en hooks.ts según los tags
  console.log('✅ Sistema listo para testing');
});

// ========================================
// WHEN - Acciones API REST
// ========================================

When('consulto el pokemon {string} por REST', async function (this: CustomWorld, pokemonName: string) {
  console.log(`🔍 Consultando pokemon: ${pokemonName}`);
  
  const task = new GetPokemon(pokemonName);
  await this.actor.attemptsTo(task);
  
  // Guardar en contexto para validaciones
  this.lastResponse = task.getResponse();
  this.lastBody = task.getResponseBody();
  this.lastResponseTime = task.getResponseTime();
  
  console.log(`📊 Response received in ${this.lastResponseTime}ms`);
});

// ========================================
// WHEN - Acciones WEB
// ========================================

When('busco el pokemon {string} en la web', async function (this: CustomWorld, pokemonName: string) {
  console.log(`🌐 Buscando pokemon en web: ${pokemonName}`);
  
  // TODO: Implementar tarea web de búsqueda
  // const task = new SearchPokemonWeb(pokemonName);
  // await this.actor.attemptsTo(task);
  
  throw new Error('Web search not implemented yet');
});

// ========================================
// THEN - Validaciones de Status
// ========================================

Then('obtengo respuesta exitosa', async function (this: CustomWorld) {
  if (!this.lastResponse) {
    throw new Error('No response available');
  }
  
  const question = StatusCode.of(this.lastResponse).toBe(200);
  const result = await this.actor.asks(question);
  
  if (!result) {
    throw new Error('Expected status 200 (success)');
  }
});

Then('obtengo respuesta con status {int}', async function (this: CustomWorld, expectedStatus: number) {
  if (!this.lastResponse) {
    throw new Error('No response available');
  }
  
  const question = StatusCode.of(this.lastResponse).toBe(expectedStatus);
  const result = await this.actor.asks(question);
  
  if (!result) {
    throw new Error(`Expected status ${expectedStatus}`);
  }
});

// ========================================
// THEN - Validaciones de Campos
// ========================================

Then('el nombre del pokemon es {string}', async function (this: CustomWorld, expectedName: string) {
  if (!this.lastBody) {
    throw new Error('No response body available');
  }
  
  const question = FieldValue.of(this.lastBody, 'name').toBe(expectedName);
  const result = await this.actor.asks(question);
  
  if (!result) {
    throw new Error(`Expected pokemon name to be "${expectedName}"`);
  }
});

Then('el pokemon tiene id {int}', async function (this: CustomWorld, expectedId: number) {
  if (!this.lastBody) {
    throw new Error('No response body available');
  }
  
  const question = FieldValue.of(this.lastBody, 'id').toBeNumber(expectedId);
  const result = await this.actor.asks(question);
  
  if (!result) {
    throw new Error(`Expected pokemon id to be ${expectedId}`);
  }
});

Then('el pokemon tiene habilidades', async function (this: CustomWorld) {
  if (!this.lastBody) {
    throw new Error('No response body available');
  }
  
  const question = HasField.of(this.lastBody, 'abilities');
  const result = await this.actor.asks(question);
  
  if (!result) {
    throw new Error('Expected pokemon to have abilities field');
  }
  
  // Verificar que tenga al menos una habilidad
  if (!Array.isArray(this.lastBody.abilities) || this.lastBody.abilities.length === 0) {
    throw new Error('Expected pokemon to have at least one ability');
  }
});

// ========================================
// THEN - Validaciones de Performance
// ========================================

Then('el tiempo de respuesta es menor a {int} ms', async function (this: CustomWorld, maxTime: number) {
  if (this.lastResponseTime === undefined) {
    throw new Error('No response time available');
  }
  
  const question = ResponseTime.of(this.lastResponseTime).lessThan(maxTime);
  const result = await this.actor.asks(question);
  
  if (!result) {
    throw new Error(`Response time ${this.lastResponseTime}ms exceeds maximum ${maxTime}ms`);
  }
});

// ========================================
// THEN - Validaciones de Schema
// ========================================

Then('la respuesta cumple con el schema de Pokemon', async function (this: CustomWorld) {
  if (!this.lastBody) {
    throw new Error('No response body available');
  }
  
  const question = SchemaValidation.of(this.lastBody).matchesSchema(pokemonSchema);
  const result = await this.actor.asks(question);
  
  if (!result) {
    throw new Error('Response does not match Pokemon schema');
  }
});

// ========================================
// THEN - Validaciones WEB
// ========================================

Then('veo información del pokemon {string}', async function (this: CustomWorld, pokemonName: string) {
  console.log(`👀 Verificando información de: ${pokemonName}`);
  
  // TODO: Implementar validación web
  throw new Error('Web validation not implemented yet');
});
