import { Page } from '@playwright/test';
import { Task } from '../../task';
import { Actor } from '../../../actors/actor';
import { PokemonPage } from '../../../pages/web/PokemonPage';
import { BrowseTheWeb } from '../../../abilities/browseTheWeb';

/**
 * Task: Search for a Pokemon on the web
 * This task navigates to Pokemon website and searches for a specific pokemon
 */
export class SearchPokemonWeb implements Task {
  private pokemonName: string;
  private pokemonPage: PokemonPage | null = null;

  constructor(pokemonName: string) {
    this.pokemonName = pokemonName;
  }

  /**
   * Execute the search task
   */
  async performAs(actor: Actor): Promise<void> {
    console.log(`🌐 Searching for Pokemon: ${this.pokemonName} on web`);

    // Get browser page from actor's BrowseTheWeb ability
    const page = BrowseTheWeb.from(actor);

    // Create page object
    this.pokemonPage = new PokemonPage(page);

    // Navigate to Pokemon page
    await this.pokemonPage.navigateTo();

    // Search for the pokemon
    await this.pokemonPage.searchPokemon(this.pokemonName);

    // Select the pokemon from results
    await this.pokemonPage.selectPokemon(this.pokemonName);

    console.log(`✅ Pokemon search completed for: ${this.pokemonName}`);
  }

  /**
   * Get the pokemon page instance
   */
  getPokemonPage(): PokemonPage {
    if (!this.pokemonPage) {
      throw new Error('Pokemon page not initialized. Task must be performed first.');
    }
    return this.pokemonPage;
  }
}
