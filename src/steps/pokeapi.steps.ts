/**
 * PokeAPI Step Definitions
 * 
 * Step definitions para pruebas de PokeAPI (web y API).
 * Implementa el patrón Screenplay usando CustomWorld con Actor.
 */

import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { SearchPokemon } from '../tasks/searchPokemon';
import { GetPokemonViaAPI } from '../tasks/getPokemonViaAPI';

/**
 * GIVEN STEPS - Precondiciones
 */

Given('el usuario está en la página de PokeAPI', async function() {
  // El actor ya está configurado en customWorld
  // Solo verificamos que esté listo
  expect(this.actor).toBeDefined();
  this.logger.info(`✅ Actor ${this.actor.name} está listo para interactuar con PokeAPI`);
});

Given('el usuario tiene acceso a la API de PokeAPI', async function() {
  // Verificar que el actor tiene la habilidad de CallAnAPI
  expect(this.actor).toBeDefined();
  
  const abilities = (this.actor as any).abilities as Map<string, any>;
  expect(abilities.has('CallAnAPI')).toBeTruthy();
  
  this.logger.info(`✅ Actor ${this.actor.name} tiene acceso a la API`);
});

/**
 * WHEN STEPS - Acciones
 */

When('busca el Pokémon {string} en la web', async function(pokemonName: string) {
  this.logger.info(`🔍 Buscando Pokémon: ${pokemonName}`);
  
  await this.actor.attemptsTo(
    SearchPokemon.named(pokemonName)
  );
  
  this.pokemonName = pokemonName; // Guardar para uso posterior
});

When('busca el Pokémon {string} por nombre via API', async function(pokemonName: string) {
  this.logger.info(`🔍 Buscando Pokémon via API: ${pokemonName}`);
  
  const task = GetPokemonViaAPI.withName(pokemonName);
  await this.actor.attemptsTo(task);
  
  // Guardar respuesta para validaciones posteriores
  this.lastAPIResponse = task.getResponse();
  this.lastAPIResponseBody = task.getResponseBody();
  this.pokemonName = pokemonName;
  
  // Capturar evidencia API
  if (this.lastAPIResponse && this.lastAPIResponseBody) {
    this.attachAPIEvidence(
      'GET',
      `/api/v2/pokemon/${pokemonName}`,
      {},
      this.lastAPIResponse,
      this.lastAPIResponseBody,
      0 // Duration se calcula en CallAnAPI
    );
  }
});

When('busca el Pokémon con ID {int} via API', async function(pokemonId: number) {
  this.logger.info(`🔍 Buscando Pokémon via API (ID): ${pokemonId}`);
  
  const task = GetPokemonViaAPI.withId(pokemonId);
  await this.actor.attemptsTo(task);
  
  this.lastAPIResponse = task.getResponse();
  this.lastAPIResponseBody = task.getResponseBody();
  this.pokemonId = pokemonId;
  
  // Capturar evidencia API
  if (this.lastAPIResponse && this.lastAPIResponseBody) {
    this.attachAPIEvidence(
      'GET',
      `/api/v2/pokemon/${pokemonId}`,
      {},
      this.lastAPIResponse,
      this.lastAPIResponseBody,
      0
    );
  }
});

/**
 * THEN STEPS - Validaciones
 */

Then('debería ver la información del Pokémon', async function() {
  // Validar que la página muestra la información
  const page = this.page;
  
  await expect(page.locator('.pokemon-result')).toBeVisible({ timeout: 10000 });
  
  // Tomar screenshot como evidencia
  await this.captureScreenshot(`pokemon-${this.pokemonName}-result`);
  
  this.logger.info('✅ Información del Pokémon visible en la página');
});

Then('la respuesta debe tener status {int}', async function(expectedStatus: number) {
  expect(this.lastAPIResponse).toBeDefined();
  
  const actualStatus = this.lastAPIResponse.status();
  expect(actualStatus).toBe(expectedStatus);
  
  this.logger.info(`✅ Status code: ${actualStatus} (esperado: ${expectedStatus})`);
});

Then('la respuesta debe contener el nombre {string}', async function(expectedName: string) {
  expect(this.lastAPIResponseBody).toBeDefined();
  
  const actualName = this.lastAPIResponseBody.name;
  expect(actualName).toBe(expectedName.toLowerCase());
  
  this.logger.info(`✅ Nombre del Pokémon: ${actualName} (esperado: ${expectedName})`);
});

Then('la respuesta debe contener el ID {int}', async function(expectedId: number) {
  expect(this.lastAPIResponseBody).toBeDefined();
  
  const actualId = this.lastAPIResponseBody.id;
  expect(actualId).toBe(expectedId);
  
  this.logger.info(`✅ ID del Pokémon: ${actualId} (esperado: ${expectedId})`);
});

Then('la respuesta debe contener información del tipo', async function() {
  expect(this.lastAPIResponseBody).toBeDefined();
  
  const types = this.lastAPIResponseBody.types;
  expect(types).toBeDefined();
  expect(Array.isArray(types)).toBeTruthy();
  expect(types.length).toBeGreaterThan(0);
  
  const typeNames = types.map((t: any) => t.type.name).join(', ');
  this.logger.info(`✅ Tipos del Pokémon: ${typeNames}`);
});

Then('la respuesta debe contener información de habilidades', async function() {
  expect(this.lastAPIResponseBody).toBeDefined();
  
  const abilities = this.lastAPIResponseBody.abilities;
  expect(abilities).toBeDefined();
  expect(Array.isArray(abilities)).toBeTruthy();
  expect(abilities.length).toBeGreaterThan(0);
  
  const abilityNames = abilities.map((a: any) => a.ability.name).join(', ');
  this.logger.info(`✅ Habilidades del Pokémon: ${abilityNames}`);
});

Then('la respuesta debe contener el sprite del Pokémon', async function() {
  expect(this.lastAPIResponseBody).toBeDefined();
  
  const sprites = this.lastAPIResponseBody.sprites;
  expect(sprites).toBeDefined();
  expect(sprites.front_default).toBeDefined();
  expect(typeof sprites.front_default).toBe('string');
  
  this.logger.info(`✅ Sprite URL: ${sprites.front_default}`);
});

/**
 * ADDITIONAL STEPS - Para pruebas más avanzadas
 */

Then('la respuesta debe tener el campo {string}', async function(fieldName: string) {
  expect(this.lastAPIResponseBody).toBeDefined();
  
  const fieldValue = this.lastAPIResponseBody[fieldName];
  expect(fieldValue).toBeDefined();
  
  this.logger.info(`✅ Campo '${fieldName}' existe con valor: ${JSON.stringify(fieldValue).substring(0, 100)}`);
});

Then('el campo {string} debe ser de tipo {string}', async function(fieldName: string, expectedType: string) {
  expect(this.lastAPIResponseBody).toBeDefined();
  
  const fieldValue = this.lastAPIResponseBody[fieldName];
  expect(fieldValue).toBeDefined();
  
  const actualType = Array.isArray(fieldValue) ? 'array' : typeof fieldValue;
  expect(actualType).toBe(expectedType.toLowerCase());
  
  this.logger.info(`✅ Campo '${fieldName}' es de tipo: ${actualType}`);
});
