/**
 * Simple Logger for Cucumber tests
 */
export class Logger {
  constructor(private context: string = 'Test') {}

  info(message: string, ...args: any[]): void {
    console.log(`ℹ️ [${this.context}] ${message}`, ...args);
  }

  error(message: string, ...args: any[]): void {
    console.error(`❌ [${this.context}] ${message}`, ...args);
  }

  warn(message: string, ...args: any[]): void {
    console.warn(`⚠️ [${this.context}] ${message}`, ...args);
  }

  debug(message: string, ...args: any[]): void {
    if (process.env.DEBUG) {
      console.debug(`🔍 [${this.context}] ${message}`, ...args);
    }
  }

  success(message: string, ...args: any[]): void {
    console.log(`✅ [${this.context}] ${message}`, ...args);
  }
}
