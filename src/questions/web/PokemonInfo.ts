import { Question } from '../question';
import { Actor } from '../../actors/actor';
import { PokemonPage } from '../../pages/web/PokemonPage';
import { BrowseTheWeb } from '../../abilities/browseTheWeb';

/**
 * Question: Verify Pokemon information is displayed on web
 */
export class PokemonInfo implements Question<boolean> {
  constructor(
    private expectedName: string
  ) {}

  /**
   * Static factory method
   */
  static for(pokemonName: string): PokemonInfo {
    return new PokemonInfo(pokemonName.toLowerCase());
  }

  /**
   * Answer the question: Is the Pokemon information displayed?
   */
  async answeredBy(actor: Actor): Promise<boolean> {
    console.log(`❓ Verifying Pokemon information for: ${this.expectedName}`);

    const page = BrowseTheWeb.from(actor);
    const pokemonPage = new PokemonPage(page);

    try {
      // Check if pokemon details are displayed
      const hasDetails = await pokemonPage.hasPokemonDetails();
      
      if (!hasDetails) {
        console.log(`❌ Pokemon details not found`);
        return false;
      }

      // Verify the pokemon name matches
      const displayedName = await pokemonPage.getPokemonName();
      const nameMatches = displayedName.toLowerCase() === this.expectedName;

      if (!nameMatches) {
        console.log(`❌ Pokemon name mismatch. Expected: ${this.expectedName}, Got: ${displayedName}`);
        return false;
      }

      // Verify image is visible
      const imageVisible = await pokemonPage.isPokemonImageVisible();
      
      if (!imageVisible) {
        console.log(`❌ Pokemon image not visible`);
        return false;
      }

      console.log(`✅ Pokemon information verified for: ${this.expectedName}`);
      return true;

    } catch (error) {
      console.error(`❌ Error verifying Pokemon information:`, error);
      return false;
    }
  }
}
