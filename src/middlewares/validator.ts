/**
 * Request Validation Middleware using Joi
 */
import { Request, Response, NextFunction } from 'express';
import { ValidationError } from '../utils/errors';
import {
  transcriptionRequestSchema,
  azureTranscriptionRequestSchema,
} from '../validations';
import { defaultValidationOptions } from '../validations/validationOptions';

/**
 * Middleware to validate transcription request using Joi
 */
export const validateTranscriptionRequest = (
  req: Request,
  _res: Response,
  next: NextFunction
): void => {
  const { error, value } = transcriptionRequestSchema.validate(
    req.body,
    defaultValidationOptions
  );

  if (error) {
    // Format Joi validation errors into a single message
    const errorMessages = error.details.map((detail) => detail.message).join(', ');
    return next(new ValidationError(errorMessages));
  }

  // Replace req.body with validated and sanitized value
  req.body = value;
  next();
};

/**
 * Middleware to validate Azure transcription request using Joi
 */
export const validateAzureTranscriptionRequest = (
  req: Request,
  _res: Response,
  next: NextFunction
): void => {
  const { error, value } = azureTranscriptionRequestSchema.validate(
    req.body,
    defaultValidationOptions
  );

  if (error) {
    // Format Joi validation errors into a single message
    const errorMessages = error.details.map((detail) => detail.message).join(', ');
    return next(new ValidationError(errorMessages));
  }

  // Replace req.body with validated and sanitized value
  req.body = value;
  next();
};

