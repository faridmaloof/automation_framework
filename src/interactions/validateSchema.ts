/**
 * ValidateSchema Interaction - JSON Schema Validation
 * 
 * Interacción para validar respuestas contra JSON Schema usando Ajv
 */

import { Interaction } from './interaction';
import { Actor } from '../actors/actor';
import Ajv, { JSONSchemaType } from 'ajv';

export class ValidateSchema<T = any> implements Interaction {
  private schema: JSONSchemaType<T>;
  private data: any;
  private schemaName: string;

  constructor(data: any, schema: JSONSchemaType<T>, schemaName: string = 'Schema') {
    this.data = data;
    this.schema = schema;
    this.schemaName = schemaName;
  }

  /**
   * Crear validación de schema
   */
  static of<T>(data: any) {
    return {
      against: (schema: JSONSchemaType<T>, schemaName?: string) => 
        new ValidateSchema<T>(data, schema, schemaName)
    };
  }

  /**
   * Ejecutar validación de schema
   */
  async performAs(actor: Actor): Promise<void> {
    const ajv = new Ajv({ allErrors: true });
    const validate = ajv.compile(this.schema);
    
    const valid = validate(this.data);
    
    if (!valid) {
      const errors = validate.errors?.map(err => 
        `${err.instancePath} ${err.message}`
      ).join(', ');
      
      throw new Error(
        `❌ Schema validation failed for ${this.schemaName}:\n${errors}`
      );
    }

    // Schema validation passed (log would go here if we had logger access)
  }

  toString(): string {
    return `ValidateSchema for ${this.schemaName}`;
  }
}
