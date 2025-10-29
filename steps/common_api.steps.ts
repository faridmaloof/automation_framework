import { When, Then } from '@cucumber/cucumber';
import { CustomWorld } from '../support/world';
import { GetPokemon } from '../src/tasks/api/rest/GetPokemon';
import { StatusCode } from '../src/questions/api/StatusCode';
import { FieldValue } from '../src/questions/api/FieldValue';
import { HasField } from '../src/questions/api/HasField';
import { ResponseTime } from '../src/questions/api/ResponseTime';
import { SchemaValidation } from '../src/questions/api/SchemaValidation';
import { pokemonSchema } from '../src/schemas/pokemonSchema';

// ========================================
// WHEN - API REST Actions
// ========================================

When('I request pokemon {string} via REST', async function (this: CustomWorld, pokemonName: string) {
  console.log(`🔍 Requesting pokemon: ${pokemonName}`);
  
  const task = new GetPokemon(pokemonName);
  await this.actor.attemptsTo(task);
  
  // Store context for validations
  this.lastResponse = task.getResponse();
  this.lastBody = task.getResponseBody();
  this.lastResponseTime = task.getResponseTime();
  
  console.log(`📊 Response received in ${this.lastResponseTime}ms`);
});

When('consulto el pokemon {string} por REST', async function (this: CustomWorld, pokemonName: string) {
  console.log(`🔍 Consultando pokemon: ${pokemonName}`);
  
  const task = new GetPokemon(pokemonName);
  await this.actor.attemptsTo(task);
  
  // Store context for validations
  this.lastResponse = task.getResponse();
  this.lastBody = task.getResponseBody();
  this.lastResponseTime = task.getResponseTime();
  
  console.log(`📊 Response received in ${this.lastResponseTime}ms`);
});

// ========================================
// THEN - Status Validations
// ========================================

Then('I should get successful response', async function (this: CustomWorld) {
  if (!this.lastResponse) {
    throw new Error('No response available');
  }
  
  const question = StatusCode.of(this.lastResponse).toBe(200);
  const result = await this.actor.asks(question);
  
  if (!result) {
    throw new Error('Expected status 200 (success)');
  }
});

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

Then('I should get response with status {int}', async function (this: CustomWorld, expectedStatus: number) {
  if (!this.lastResponse) {
    throw new Error('No response available');
  }
  
  const question = StatusCode.of(this.lastResponse).toBe(expectedStatus);
  const result = await this.actor.asks(question);
  
  if (!result) {
    throw new Error(`Expected status ${expectedStatus}`);
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
// THEN - Field Validations
// ========================================

Then('pokemon name should be {string}', async function (this: CustomWorld, expectedName: string) {
  if (!this.lastBody) {
    throw new Error('No response body available');
  }
  
  const question = FieldValue.of(this.lastBody, 'name').toBe(expectedName);
  const result = await this.actor.asks(question);
  
  if (!result) {
    throw new Error(`Expected pokemon name to be "${expectedName}"`);
  }
});

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

Then('pokemon id should be {int}', async function (this: CustomWorld, expectedId: number) {
  if (!this.lastBody) {
    throw new Error('No response body available');
  }
  
  const question = FieldValue.of(this.lastBody, 'id').toBeNumber(expectedId);
  const result = await this.actor.asks(question);
  
  if (!result) {
    throw new Error(`Expected pokemon id to be ${expectedId}`);
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

Then('pokemon should have abilities', async function (this: CustomWorld) {
  if (!this.lastBody) {
    throw new Error('No response body available');
  }
  
  const question = HasField.of(this.lastBody, 'abilities');
  const result = await this.actor.asks(question);
  
  if (!result) {
    throw new Error('Expected pokemon to have abilities field');
  }
  
  // Verify at least one ability
  if (!Array.isArray(this.lastBody.abilities) || this.lastBody.abilities.length === 0) {
    throw new Error('Expected pokemon to have at least one ability');
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
  
  // Verify at least one ability
  if (!Array.isArray(this.lastBody.abilities) || this.lastBody.abilities.length === 0) {
    throw new Error('Expected pokemon to have at least one ability');
  }
});

// ========================================
// THEN - Performance Validations
// ========================================

Then('response time should be less than {int} ms', async function (this: CustomWorld, maxTime: number) {
  if (this.lastResponseTime === undefined) {
    throw new Error('No response time available');
  }
  
  const question = ResponseTime.of(this.lastResponseTime).lessThan(maxTime);
  const result = await this.actor.asks(question);
  
  if (!result) {
    throw new Error(`Response time ${this.lastResponseTime}ms exceeds maximum ${maxTime}ms`);
  }
});

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
// THEN - Schema Validations
// ========================================

Then('response should match Pokemon schema', async function (this: CustomWorld) {
  if (!this.lastBody) {
    throw new Error('No response body available');
  }
  
  const question = SchemaValidation.of(this.lastBody).matchesSchema(pokemonSchema);
  const result = await this.actor.asks(question);
  
  if (!result) {
    throw new Error('Response does not match Pokemon schema');
  }
});

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
