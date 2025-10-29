import { When, Then } from '@cucumber/cucumber';
import { CustomWorld } from '../support/world';
import { SearchPokemonWeb } from '../src/tasks/web/pokemon/SearchPokemonWeb';
import { PokemonInfo } from '../src/questions/web/PokemonInfo';

// ========================================
// WHEN - Web Actions
// ========================================

When('I search for the pokemon {string} on the web', async function (this: CustomWorld, pokemonName: string) {
  console.log(`🌐 Searching for pokemon on web: ${pokemonName}`);
  
  const task = new SearchPokemonWeb(pokemonName);
  await this.actor.attemptsTo(task);
  
  // Store pokemon page for validations
  this.pokemonPage = task.getPokemonPage();
});

// ========================================
// THEN - Web Validations
// ========================================

Then('I see information for pokemon {string}', async function (this: CustomWorld, pokemonName: string) {
  console.log(`👀 Verifying pokemon information: ${pokemonName}`);
  
  const question = PokemonInfo.for(pokemonName);
  const result = await this.actor.asks(question);
  
  if (!result) {
    throw new Error(`Pokemon information not found for: ${pokemonName}`);
  }
});
