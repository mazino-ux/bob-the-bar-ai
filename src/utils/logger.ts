import winston from 'winston';

const plainTextFormat = winston.format.printf(({ level, message, timestamp }) => {
  return `${timestamp} [${level}]: ${message}`;
});

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    // Console transport uses plain text for startup messages, JSON for others
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format((info) => {
          // Use plain text for startup messages
          if (
            typeof info.message === 'string' &&
            info.message.toLowerCase().includes('startup')
          ) {
            info[Symbol.for('message')] = plainTextFormat.transform!(info, {});
            return info;
          }
          // Otherwise, use default JSON format
          return info;
        })(),
        winston.format((info) => info)() // Pass-through for winston
      )
    }),
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' })
  ]
});

export { logger };