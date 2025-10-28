import { Question } from '../question';
import { Actor } from '../../actors/actor';

/**
 * Question para verificar el valor de un campo en el response body
 * Soporta nested fields con notación de punto (ej: "user.name")
 * 
 * @example
 * const isCorrect = await actor.asks(FieldValue.of(body, 'name').toBe('pikachu'));
 * const isCorrect = await actor.asks(FieldValue.of(body, 'user.address.city').toBe('Tokyo'));
 */
export class FieldValue implements Question<boolean> {
  private body: any;
  private fieldPath: string;
  private expectedValue: any;

  private constructor(body: any, fieldPath: string) {
    this.body = body;
    this.fieldPath = fieldPath;
  }

  static of(body: any, fieldPath: string): FieldValue {
    return new FieldValue(body, fieldPath);
  }

  toBe(value: any): FieldValue {
    this.expectedValue = value;
    return this;
  }

  toBeNumber(value: number): FieldValue {
    this.expectedValue = value;
    return this;
  }

  async answeredBy(actor: Actor): Promise<boolean> {
    const actualValue = this.getNestedValue(this.body, this.fieldPath);
    
    if (actualValue !== this.expectedValue) {
      console.error(`❌ Field "${this.fieldPath}" expected "${this.expectedValue}", but got "${actualValue}"`);
      return false;
    }

    console.log(`✅ Field "${this.fieldPath}" has value "${this.expectedValue}"`);
    return true;
  }

  private getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((current, key) => current?.[key], obj);
  }

  toString(): string {
    return `FieldValue "${this.fieldPath}" should be "${this.expectedValue}"`;
  }
}
