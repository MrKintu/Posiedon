/*
 * Created Date: Wednesday, October 2nd 2024, 3:37:14 pm
 * Author: Kintu Declan Trevor
 * 
 * Copyright (c) 2024 Kintu Declan Trevor
 */

import { createLogger, format, transports } from 'winston';
import { Format, TransformableInfo } from 'logform';
import DailyRotateFile from 'winston-daily-rotate-file';

const { combine, timestamp, printf } = format;

const env: string = process.env.NODE_ENV || 'development';

// Custom log format with TypeScript typings for format info
const logFormat: Format = printf(({ level, message, timestamp }: TransformableInfo) => {
  return `${timestamp} [${level.toUpperCase()}]: ${message}`;
});

// Logger configuration with TypeScript types
const logger = createLogger({
  level: env === 'development' ? 'silly' : 'warn',  // Set log level based on environment
  format: combine(
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),  // Format for timestamp
    logFormat  // Apply custom format
  ),
  transports: [
    // Console transport for development
    new transports.Console({
      level: env === 'development' ? 'silly' : 'warn',  // Console log level based on environment
    }),

    // Daily rotating file transport for errors
    new DailyRotateFile({
      filename: 'logs/error/%DATE%-error.log',  // Error log file location
      datePattern: 'YYYY-MM-DD',
      level: 'error',  // Log only errors to this file
      maxFiles: '1095d',  // Retain error logs for 3 years
    }),

    // Daily rotating file transport for all logs 'info' and above
    new DailyRotateFile({
      filename: 'logs/combined/%DATE%-combined.log',  // Combined log file location
      datePattern: 'YYYY-MM-DD',
      level: 'info',  // Log 'info' and above
      maxFiles: '1095d',  // Retain logs for 3 years
    }),

    // Daily rotating file transport for debug-level logs
    new DailyRotateFile({
      filename: 'logs/debug/%DATE%-debug.log',  // Debug log file location
      datePattern: 'YYYY-MM-DD',
      level: 'debug',  // Log only 'debug' and above
      maxFiles: '1095d',  // Retain debug logs for 3 years
    }),
  ],
});

// Export the logger for use in other files
export default logger;
