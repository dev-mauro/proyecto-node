import winston from 'winston';

import __dirname from '../utils.js';
import { currentEnv } from '../config/config.js';

const customLevelsOptions  = {
  levels: {
    fatal: 0,
    error: 1,
    warning: 2,
    info: 3,
    http: 4,
    debug: 5,
  }
}

let logger;

if (currentEnv === 'dev') {
  logger = winston.createLogger({
    levels: customLevelsOptions.levels,
    transports: [
      new winston.transports.Console({ level: 'debug' }),
      new winston.transports.File({ filename: __dirname + '/errors.log', level: 'error' }),
    ]
  });
}
else if(currentEnv === 'prod') {
  logger = winston.createLogger({
    levels: customLevelsOptions.levels,
    transports: [
      new winston.transports.Console({ level: 'info' }),
      new winston.transports.File({ filename: __dirname + '/errors.log', level: 'error' }),
    ]
  });
}

export const addLogger = (req, res, next) => {
  req.logger = logger;
  next();
}