import { setWorldConstructor, World, IWorldOptions } from '@cucumber/cucumber';
import { Browser, Page, APIRequestContext, request, APIResponse } from '@playwright/test';
import { Actor } from '../src/actors/actor';

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
  
  // Configuration
  baseURL: string;

  constructor(options: IWorldOptions) {
    super(options);
    this.baseURL = process.env.API_BASE_URL || 'https://pokeapi.co';
  }
}

setWorldConstructor(CustomWorld);
