import { Request, Response, NextFunction } from 'express';
import { ValidationError } from '../utils/errors';
import {
  transcriptionRequestSchema,
  azureTranscriptionRequestSchema,
} from '../validations';
import { defaultValidationOptions } from '../validations/validationOptions';

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
    const errorMessages = error.details.map((detail) => detail.message).join(', ');
    return next(new ValidationError(errorMessages));
  }

  req.body = value;
  next();
};

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
    const errorMessages = error.details.map((detail) => detail.message).join(', ');
    return next(new ValidationError(errorMessages));
  }

  req.body = value;
  next();
};

