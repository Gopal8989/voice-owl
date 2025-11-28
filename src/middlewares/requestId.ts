/**
 * Request ID Middleware - Adds unique ID to each request for tracking
 */
import { Request, Response, NextFunction } from 'express';
import { randomUUID } from 'crypto';

export interface RequestWithId extends Request {
  requestId: string;
}

export const requestIdMiddleware = (
  req: Request,
  _res: Response,
  next: NextFunction
): void => {
  (req as RequestWithId).requestId = randomUUID();
  next();
};

