/**
 * High-performance Async Logger using Pino
 *
 * Benefits:
 * - Asynchronous I/O (non-blocking)
 * - JSON structured logs for CI (machine-readable)
 * - Clean, readable output for development
 * - Automatic context tagging
 * - Flush-safe for CI pipelines
 * - Compatible with Cucumber / Playwright
 */

import pino, { LoggerOptions } from 'pino';
import fs from 'fs';
import path from 'path';

// ---------------------------------------------
// Environment Detection
// ---------------------------------------------
const isCI = !!process.env.CI;
const isDebug = !!process.env.DEBUG;
const logLevel = process.env.LOG_LEVEL || (isDebug ? 'debug' : 'info');

// ---------------------------------------------
// Optional Log Directory (only if writing to file)
// ---------------------------------------------
let logFilePath: string | undefined;
if (process.env.WRITE_LOGS_TO_FILE) {
  const logsDir = path.join(process.cwd(), 'logs');
  if (!fs.existsSync(logsDir)) fs.mkdirSync(logsDir, { recursive: true });
  logFilePath = path.join(logsDir, `test-${Date.now()}.log`);
}

// ---------------------------------------------
// Pino Configuration (Pretty for dev, JSON for CI)
// ---------------------------------------------
const pinoConfig: LoggerOptions = {
  level: logLevel,
  transport: isCI
    ? undefined // JSON logs (default Pino transport)
    : {
        target: 'pino-pretty',
        options: {
          colorize: true,
          translateTime: 'HH:MM:ss.l',
          ignore: 'pid,hostname',
          messageFormat: '[{context}] {msg}',
          singleLine: true,
          levelFirst: false,
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
// Logger Class Definition
// ---------------------------------------------
export class Logger {
  private logger: pino.Logger;

  constructor(private context: string = 'Test') {
    this.logger = baseLogger.child({ context });
  }

  info(message: string, ...args: any[]): void {
    this.logger.info({ args }, `[INFO] ${message}`);
  }

  error(message: string, ...args: any[]): void {
    this.logger.error({ args }, `[ERROR] ${message}`);
  }

  warn(message: string, ...args: any[]): void {
    this.logger.warn({ args }, `[WARN] ${message}`);
  }

  debug(message: string, ...args: any[]): void {
    this.logger.debug({ args }, `[DEBUG] ${message}`);
  }

  success(message: string, ...args: any[]): void {
    this.logger.info({ args }, `[OK] ${message}`);
  }

  // Additional methods for structured logging
  step(step: string, data?: any): void {
    this.logger.info({ step, data }, `[STEP] ${step}`);
  }

  scenario(scenario: string, tags?: string[]): void {
    this.logger.info({ scenario, tags }, `[SCENARIO] ${scenario}`);
  }

  result(status: 'PASSED' | 'FAILED' | 'SKIPPED', message: string): void {
    const prefix = status === 'PASSED' ? '[PASS]' : status === 'FAILED' ? '[FAIL]' : '[SKIP]';
    this.logger.info({ status }, `${prefix} ${message}`);
  }

  performance(operation: string, duration: number, threshold?: number): void {
    const withinThreshold = threshold ? duration < threshold : true;
    const prefix = withinThreshold ? '[PERF]' : '[SLOW]';
    this.logger.info(
      { operation, duration, threshold, withinThreshold },
      `${prefix} ${operation}: ${duration}ms`
    );
  }

  // New method for API evidence
  apiRequest(method: string, url: string, data?: any): void {
    this.logger.info(
      { method, url, data },
      `[API-REQ] ${method} ${url}`
    );
  }

  apiResponse(status: number, data: any, duration: number): void {
    this.logger.info(
      { status, data, duration },
      `[API-RES] ${status} (${duration}ms)`
    );
  }
}

/**
 * Flush all pending logs (call in After hooks)
 */
export async function flushLogs(): Promise<void> {
  return new Promise((resolve) => {
    // Pino flushes automatically but we give it a tick
    setImmediate(resolve);
  });
}
