import { Question } from '../question';
import { Actor } from '../../actors/actor';

/**
 * Question para verificar que un campo existe en el response body
 * Soporta nested fields con notación de punto
 * 
 * @example
 * const hasField = await actor.asks(HasField.of(body, 'abilities'));
 * const hasField = await actor.asks(HasField.of(body, 'user.profile.avatar'));
 */
export class HasField implements Question<boolean> {
  private body: any;
  private fieldPath: string;

  private constructor(body: any, fieldPath: string) {
    this.body = body;
    this.fieldPath = fieldPath;
  }

  static of(body: any, fieldPath: string): HasField {
    return new HasField(body, fieldPath);
  }

  async answeredBy(actor: Actor): Promise<boolean> {
    const exists = this.fieldExists(this.body, this.fieldPath);
    
    if (!exists) {
      console.error(`❌ Field "${this.fieldPath}" does not exist in response`);
      return false;
    }

    console.log(`✅ Field "${this.fieldPath}" exists`);
    return true;
  }

  private fieldExists(obj: any, path: string): boolean {
    const keys = path.split('.');
    let current = obj;

    for (const key of keys) {
      if (current === null || current === undefined || !(key in current)) {
        return false;
      }
      current = current[key];
    }

    return true;
  }

  toString(): string {
    return `HasField "${this.fieldPath}"`;
  }
}
