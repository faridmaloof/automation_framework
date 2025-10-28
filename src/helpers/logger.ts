/**
 * High-performance Async Logger using Pino
 *
 * Benefits:
 * - Asynchronous I/O (non-blocking)
 * - JSON structured logs for CI (machine-readable)
 * - Pretty printing for development
 * - Automatic context tagging
 * - Flush-safe for CI pipelines
 * - Compatible with Cucumber / Playwright
 */

import pino, { LoggerOptions } from 'pino';
import fs from 'fs';
import path from 'path';

// ---------------------------------------------
// 🌐 Environment Detection
// ---------------------------------------------
const isCI = !!process.env.CI;
const isDebug = !!process.env.DEBUG;
const logLevel = process.env.LOG_LEVEL || (isDebug ? 'debug' : 'info');
const useEmojis = !isCI; // Emojis off in CI for safer output

// ---------------------------------------------
// 📁 Optional Log Directory (only if writing to file)
// ---------------------------------------------
let logFilePath: string | undefined;
if (process.env.WRITE_LOGS_TO_FILE) {
  const logsDir = path.join(process.cwd(), 'logs');
  if (!fs.existsSync(logsDir)) fs.mkdirSync(logsDir, { recursive: true });
  logFilePath = path.join(logsDir, `test-${Date.now()}.log`);
}

// ---------------------------------------------
// ⚙️ Pino Configuration
// ---------------------------------------------
const pinoConfig: LoggerOptions = {
  level: logLevel,
  transport: isCI
    ? undefined // JSON logs (default Pino transport)
    : {
        target: 'pino-pretty',
        options: {
          colorize: true,
          translateTime: 'HH:MM:ss',
          ignore: 'pid,hostname',
          messageFormat: '{context} {msg}',
          singleLine: false,
        },
      },
};

// If writing to file, redirect output
const destination = logFilePath
  ? pino.destination({ dest: logFilePath, sync: false })
  : undefined;

// Base singleton logger
const baseLogger = pino(pinoConfig, destination);

// ---------------------------------------------
// 🧱 Logger Class Definition
// ---------------------------------------------
export class Logger {
  private logger: pino.Logger;

  constructor(private context: string = 'Test') {
    this.logger = baseLogger.child({ context });
  }

  private icon(symbol: string, fallback: string): string {
    return useEmojis ? symbol : fallback;
  }

  info(message: string, ...args: any[]): void {
    this.logger.info({ args }, `${this.icon('ℹ️', '[INFO]')} ${message}`);
  }

  error(message: string, ...args: any[]): void {
    this.logger.error({ args }, `${this.icon('❌', '[ERROR]')} ${message}`);
  }

  warn(message: string, ...args: any[]): void {
    this.logger.warn({ args }, `${this.icon('⚠️', '[WARN]')} ${message}`);
  }

  debug(message: string, ...args: any[]): void {
    this.logger.debug({ args }, `${this.icon('🔍', '[DEBUG]')} ${message}`);
  }

  success(message: string, ...args: any[]): void {
    this.logger.info({ args }, `${this.icon('✅', '[OK]')} ${message}`);
  }

  step(step: string, data?: any): void {
    this.logger.info({ step, data }, `${this.icon('🎬', '[STEP]')} ${step}`);
  }

  scenario(scenario: string, tags?: string[]): void {
    this.logger.info({ scenario, tags }, `${this.icon('📋', '[SCENARIO]')} ${scenario}`);
  }

  result(status: 'PASSED' | 'FAILED' | 'SKIPPED', message: string): void {
    const icon = status === 'PASSED'
      ? this.icon('✅', '[PASS]')
      : status === 'FAILED'
      ? this.icon('❌', '[FAIL]')
      : this.icon('⏭️', '[SKIP]');
    this.logger.info({ status }, `${icon} ${message}`);
  }

  performance(operation: string, duration: number, threshold?: number): void {
    const withinThreshold = threshold ? duration < threshold : true;
    const icon = withinThreshold
      ? this.icon('⚡', '[FAST]')
      : this.icon('⏱️', '[SLOW]');
    this.logger.info(
      { operation, duration, threshold, withinThreshold },
      `${icon} ${operation}: ${duration}ms`
    );
  }
}

// ---------------------------------------------
// 🧹 Flush pending logs safely (for After hooks)
// ---------------------------------------------
export async function flushLogs(): Promise<void> {
  const dest: any = (baseLogger as any).destination?.() ?? destination;
  if (dest && typeof dest.flush === 'function') {
    await new Promise<void>((resolve) => dest.flush(resolve));
  } else {
    await new Promise((resolve) => setImmediate(resolve));
  }
}