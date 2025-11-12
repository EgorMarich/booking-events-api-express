import { NextFunction } from 'express';
import { logger } from '../utils/logger';

export const requestLogger = (req: any, res: any, next: NextFunction) => {
  const start = Date.now();
  
  logger.info('Incoming Request', {
    method: req.method,
    url: req.url,
    ip: req.ip,
    userAgent: req.get('User-Agent')
  });

  
  const originalEnd = res.end;
  res.end = function(chunk?: any, encoding?: any, cb?: any) {
    const duration = Date.now() - start;
    
    logger.info('Request Completed', {
      method: req.method,
      url: req.url,
      statusCode: res.statusCode,
      duration: `${duration}ms`,
      contentLength: res.get('Content-Length')
    });

    originalEnd.call(this, chunk, encoding, cb);
  };

  next();
};