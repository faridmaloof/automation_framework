import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * Page Object for Pokemon web search and details
 * URL: https://www.pokemon.com/us/pokedex/
 */
export class PokemonPage extends BasePage {
  // Selectors
  private readonly selectors = {
    searchInput: 'input[type="search"], input[name="search"], #searchInput',
    searchButton: 'button[type="submit"], button.search-button',
    pokemonCard: '.pokemon-card, .pokedex-pokemon-card',
    pokemonName: '.pokemon-name, h1, .name',
    pokemonImage: '.pokemon-image, img[alt*="pokemon"]',
    pokemonType: '.pokemon-type, .type',
    pokemonStats: '.pokemon-stats, .stats',
    pokemonAbilities: '.pokemon-abilities, .abilities',
    loadingIndicator: '.loading, .spinner'
  };

  constructor(page: Page) {
    super(page);
  }

  /**
   * Navigate to Pokemon search page
   */
  async navigateTo(): Promise<void> {
    await this.page.goto('https://www.pokemon.com/us/pokedex/');
    await this.waitForPageLoad();
  }

  /**
   * Search for a pokemon by name
   */
  async searchPokemon(pokemonName: string): Promise<void> {
    console.log(`🔍 Searching for pokemon: ${pokemonName}`);
    
    // Wait for search input
    const searchInput = this.page.locator(this.selectors.searchInput).first();
    await searchInput.waitFor({ state: 'visible', timeout: 10000 });
    
    // Clear and type pokemon name
    await searchInput.clear();
    await searchInput.fill(pokemonName);
    
    // Wait a bit for autocomplete/suggestions
    await this.page.waitForTimeout(500);
    
    // Try to submit search
    try {
      const searchButton = this.page.locator(this.selectors.searchButton).first();
      if (await searchButton.isVisible({ timeout: 2000 })) {
        await searchButton.click();
      } else {
        // Press Enter if no button found
        await searchInput.press('Enter');
      }
    } catch {
      // Fallback: just press Enter
      await searchInput.press('Enter');
    }
    
    // Wait for results to load
    await this.waitForLoadingComplete();
  }

  /**
   * Click on a pokemon card to view details
   */
  async selectPokemon(pokemonName: string): Promise<void> {
    console.log(`👆 Selecting pokemon: ${pokemonName}`);
    
    // Wait for pokemon cards to appear
    await this.page.locator(this.selectors.pokemonCard).first().waitFor({ 
      state: 'visible', 
      timeout: 10000 
    });
    
    // Find and click the pokemon card that matches the name
    const pokemonCard = this.page.locator(this.selectors.pokemonCard)
      .filter({ hasText: new RegExp(pokemonName, 'i') })
      .first();
    
    await pokemonCard.click();
    await this.waitForPageLoad();
  }

  /**
   * Get the displayed pokemon name
   */
  async getPokemonName(): Promise<string> {
    const nameElement = this.page.locator(this.selectors.pokemonName).first();
    await nameElement.waitFor({ state: 'visible', timeout: 5000 });
    
    const name = await nameElement.textContent();
    return name?.trim().toLowerCase() || '';
  }

  /**
   * Check if pokemon image is displayed
   */
  async isPokemonImageVisible(): Promise<boolean> {
    try {
      const image = this.page.locator(this.selectors.pokemonImage).first();
      await image.waitFor({ state: 'visible', timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Get pokemon types
   */
  async getPokemonTypes(): Promise<string[]> {
    const typeElements = this.page.locator(this.selectors.pokemonType);
    const count = await typeElements.count();
    
    const types: string[] = [];
    for (let i = 0; i < count; i++) {
      const type = await typeElements.nth(i).textContent();
      if (type) {
        types.push(type.trim().toLowerCase());
      }
    }
    
    return types;
  }

  /**
   * Check if pokemon details are displayed
   */
  async hasPokemonDetails(): Promise<boolean> {
    try {
      // Check for name
      const nameVisible = await this.page.locator(this.selectors.pokemonName)
        .first()
        .isVisible({ timeout: 5000 });
      
      // Check for image
      const imageVisible = await this.isPokemonImageVisible();
      
      return nameVisible && imageVisible;
    } catch {
      return false;
    }
  }

  /**
   * Wait for loading indicators to disappear
   */
  private async waitForLoadingComplete(): Promise<void> {
    try {
      const loader = this.page.locator(this.selectors.loadingIndicator).first();
      if (await loader.isVisible({ timeout: 1000 })) {
        await loader.waitFor({ state: 'hidden', timeout: 10000 });
      }
    } catch {
      // No loader found or already hidden
    }
    
    // Additional wait for network to be idle
    await this.page.waitForLoadState('networkidle', { timeout: 10000 }).catch(() => {
      // Continue if network doesn't go idle
    });
  }
}
