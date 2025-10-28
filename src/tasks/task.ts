/**
 * Task Interface - Base for Screenplay Pattern Tasks
 * 
 * Represents a business-level action that an Actor can perform.
 * Tasks are composed of one or more Interactions and represent
 * meaningful business goals.
 * 
 * Examples:
 * - Login with credentials
 * - Search for a product
 * - Get Pokemon from API
 * - Complete checkout process
 */

import { Actor } from '../actors/actor';

export interface Task {
  /**
   * Performs the task using the given actor
   * 
   * @param actor - The actor performing the task
   * @returns Promise that resolves when task is complete
   */
  performAs(actor: Actor): Promise<void>;

  /**
   * Human-readable description of what the task does
   */
  toString(): string;
}
