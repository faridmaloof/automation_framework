import { Question } from '../question';
import { Actor } from '../../actors/actor';
import { APIResponse } from '@playwright/test';

/**
 * Question para verificar el status code de una respuesta HTTP
 * 
 * @example
 * const isOk = await actor.asks(StatusCode.of(response).toBe(200));
 */
export class StatusCode implements Question<boolean> {
  private response: APIResponse;
  private expectedStatus: number;

  private constructor(response: APIResponse) {
    this.response = response;
    this.expectedStatus = 200;
  }

  static of(response: APIResponse): StatusCode {
    return new StatusCode(response);
  }

  toBe(status: number): StatusCode {
    this.expectedStatus = status;
    return this;
  }

  async answeredBy(actor: Actor): Promise<boolean> {
    const actualStatus = this.response.status();
    
    if (actualStatus !== this.expectedStatus) {
      console.error(`❌ Expected status ${this.expectedStatus}, but got ${actualStatus}`);
      return false;
    }

    console.log(`✅ Status code is ${this.expectedStatus}`);
    return true;
  }

  toString(): string {
    return `StatusCode should be ${this.expectedStatus}`;
  }
}
