import { Question } from '../question';
import { Actor } from '../../actors/actor';

/**
 * Question para verificar el tiempo de respuesta de una petición
 * 
 * @example
 * const isFast = await actor.asks(ResponseTime.of(responseTime).lessThan(2000));
 */
export class ResponseTime implements Question<boolean> {
  private responseTime: number;
  private maxTime: number;

  private constructor(responseTime: number) {
    this.responseTime = responseTime;
    this.maxTime = 5000; // Default 5 seconds
  }

  static of(responseTime: number): ResponseTime {
    return new ResponseTime(responseTime);
  }

  lessThan(milliseconds: number): ResponseTime {
    this.maxTime = milliseconds;
    return this;
  }

  async answeredBy(actor: Actor): Promise<boolean> {
    if (this.responseTime >= this.maxTime) {
      console.error(`❌ Response time ${this.responseTime}ms exceeds maximum ${this.maxTime}ms`);
      return false;
    }

    console.log(`✅ Response time ${this.responseTime}ms is less than ${this.maxTime}ms`);
    return true;
  }

  toString(): string {
    return `ResponseTime should be less than ${this.maxTime}ms`;
  }
}
