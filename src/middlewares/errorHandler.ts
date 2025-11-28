import { Request, Response, NextFunction } from 'express';
import { ErrorResponse } from '../types';
import { AppError } from '../utils/errors';
import { logger } from '../utils/logger';
import { RequestWithId } from './requestId';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  const requestId = (req as RequestWithId).requestId;

  if (err instanceof AppError) {
    logger.error(`Operational error: ${err.message}`, err, { requestId });
    
    const errorResponse: ErrorResponse = {
      success: false,
      error: err.name,
      message: err.message,
      statusCode: err.statusCode,
      ...(requestId && { requestId }),
    };

    res.status(err.statusCode).json(errorResponse);
    return;
  }

  logger.error('Unhandled error', err, { requestId });
  const isProduction = process.env.NODE_ENV === 'production';
  
  const errorResponse: ErrorResponse = {
    success: false,
    error: 'Internal Server Error',
    message: isProduction ? 'An unexpected error occurred' : err.message,
    statusCode: 500,
    ...(requestId && { requestId }),
  };

  res.status(500).json(errorResponse);
};

export const notFoundHandler = (req: Request, res: Response): void => {
  const requestId = (req as RequestWithId).requestId;
  
  logger.warn(`Route not found: ${req.method} ${req.path}`, { requestId });

  const errorResponse: ErrorResponse = {
    success: false,
    error: 'Not Found',
    message: `Route ${req.method} ${req.path} not found`,
    statusCode: 404,
    ...(requestId && { requestId }),
  };

  res.status(404).json(errorResponse);
};

