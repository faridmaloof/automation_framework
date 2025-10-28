import { Ability } from '../abilities/ability';
import { Task } from '../tasks/task';
import { Question } from '../questions/question';
import { Logger } from '../core/helpers/logger';

/**
 * Actor - Representa un usuario que interactúa con el sistema
 * Patrón Screenplay: Los actores tienen habilidades (abilities) y ejecutan tareas (tasks)
 */
export class Actor {
  private abilities: Map<string, Ability> = new Map();
  private logger: Logger;

  constructor(public name: string) {
    this.logger = new Logger(`Actor:${name}`);
    this.logger.info(`🎭 Actor created: ${name}`);
  }

  /**
   * Otorga una habilidad al actor
   * @param ability - La habilidad a otorgar (BrowseTheWeb, CallAnAPI, etc.)
   */
  can(ability: Ability): Actor {
    const abilityName = ability.constructor.name;
    this.abilities.set(abilityName, ability);
    this.logger.debug(`Actor ${this.name} can now: ${abilityName}`);
    return this;
  }

  /**
   * Obtiene una habilidad del actor
   * @param abilityClass - La clase de la habilidad
   */
  abilityTo<T extends Ability>(abilityClass: new (...args: any[]) => T): T {
    const abilityName = abilityClass.name;
    const ability = this.abilities.get(abilityName);
    
    if (!ability) {
      throw new Error(`Actor ${this.name} does not have the ability: ${abilityName}`);
    }
    
    return ability as T;
  }

  /**
   * Ejecuta una o más tareas
   * @param tasks - Las tareas a ejecutar
   */
  async attemptsTo(...tasks: Task[]): Promise<void> {
    for (const task of tasks) {
      const taskName = task.constructor.name;
      this.logger.info(`🎬 ${this.name} attempts to: ${taskName}`);
      
      try {
        await task.performAs(this);
        this.logger.info(`✅ ${taskName} completed successfully`);
      } catch (error) {
        this.logger.error(`❌ ${taskName} failed`, error as Error);
        throw error;
      }
    }
  }

  /**
   * Pregunta/obtiene información
   * @param question - La pregunta a responder
   */
  async asks<T>(question: Question<T>): Promise<T> {
    const questionName = question.constructor.name;
    this.logger.info(`❓ ${this.name} asks: ${questionName}`);
    
    try {
      const answer = await question.answeredBy(this);
      this.logger.info(`✅ ${questionName} answered`);
      return answer;
    } catch (error) {
      this.logger.error(`❌ ${questionName} failed`, error as Error);
      throw error;
    }
  }
}
