import { Question } from '../question';
import { Actor } from '../../actors/actor';
import Ajv from 'ajv';

/**
 * Question para validar JSON Schema de una respuesta
 * 
 * @example
 * const isValid = await actor.asks(SchemaValidation.of(body).matchesSchema(pokemonSchema));
 */
export class SchemaValidation implements Question<boolean> {
  private data: any;
  private schema: any;
  private ajv: Ajv;

  private constructor(data: any) {
    this.data = data;
    this.ajv = new Ajv({ allErrors: true });
  }

  static of(data: any): SchemaValidation {
    return new SchemaValidation(data);
  }

  matchesSchema(schema: any): SchemaValidation {
    this.schema = schema;
    return this;
  }

  async answeredBy(actor: Actor): Promise<boolean> {
    if (!this.schema) {
      console.error('❌ No schema provided for validation');
      return false;
    }

    const validate = this.ajv.compile(this.schema);
    const valid = validate(this.data);

    if (!valid) {
      console.error('❌ Schema validation failed:');
      console.error(JSON.stringify(validate.errors, null, 2));
      return false;
    }

    console.log('✅ Schema validation passed');
    return true;
  }

  toString(): string {
    return `SchemaValidation`;
  }
}
