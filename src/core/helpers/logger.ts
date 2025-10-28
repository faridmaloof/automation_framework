import winston from 'winston';
import { join } from 'path';

/**
 * Logger centralizado usando Winston
 * Soporta múltiples niveles y transportes
 */
export class Logger {
  private logger: winston.Logger;
  private context: string;

  constructor(context: string = 'App') {
    this.context = context;
    
    const logFormat = winston.format.combine(
      winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
      winston.format.errors({ stack: true }),
      winston.format.splat(),
      winston.format.printf(({ timestamp, level, message, context, ...meta }) => {
        const metaStr = Object.keys(meta).length ? JSON.stringify(meta, null, 2) : '';
        return `[${timestamp}] [${level.toUpperCase()}] [${context || this.context}] ${message} ${metaStr}`;
      })
    );

    this.logger = winston.createLogger({
      level: process.env['LOG_LEVEL'] || 'info',
      format: logFormat,
      transports: [
        // Console output
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.colorize(),
            logFormat
          )
        }),
        // File output - all logs
        new winston.transports.File({
          filename: join('logs', 'combined.log'),
          maxsize: 5242880, // 5MB
          maxFiles: 5
        }),
        // File output - errors only
        new winston.transports.File({
          filename: join('logs', 'error.log'),
          level: 'error',
          maxsize: 5242880,
          maxFiles: 5
        })
      ]
    });
  }

  debug(message: string, meta?: any) {
    this.logger.debug(message, { context: this.context, ...meta });
  }

  info(message: string, meta?: any) {
    this.logger.info(message, { context: this.context, ...meta });
  }

  warn(message: string, meta?: any) {
    this.logger.warn(message, { context: this.context, ...meta });
  }

  error(message: string, error?: Error | any, meta?: any) {
    this.logger.error(message, { 
      context: this.context,
      error: error?.message,
      stack: error?.stack,
      ...meta 
    });
  }
}
