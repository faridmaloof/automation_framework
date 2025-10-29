import { setWorldConstructor, World, IWorldOptions } from '@cucumber/cucumber';
import { Browser, Page, APIRequestContext, request, APIResponse } from '@playwright/test';
import { Actor } from '../src/actors/actor';
import { PokemonPage } from '../src/pages/web/PokemonPage';

/**
 * Custom World extendido con Actor y contextos híbridos
 * Soporta Web, API y Mobile testing
 */
export class CustomWorld extends World {
  // Contexts
  browser?: Browser;
  page?: Page;
  apiContext?: APIRequestContext;
  
  // Actor con Screenplay Pattern
  actor!: Actor;
  
  // Shared data entre steps
  lastResponse?: APIResponse;
  lastBody?: any;
  lastResponseTime?: number;
  pokemonPage?: PokemonPage;
  
  // Configuration
  baseURL: string;

  constructor(options: IWorldOptions) {
    super(options);
    
    // API_BASE_URL es REQUERIDA - no debe tener valor por defecto
    if (!process.env.API_BASE_URL) {
      throw new Error(
        '❌ API_BASE_URL no está configurada en .env\n' +
        '   Copia .env.example a .env y configura API_BASE_URL'
      );
    }
    
    this.baseURL = process.env.API_BASE_URL;
  }
}

setWorldConstructor(CustomWorld);
