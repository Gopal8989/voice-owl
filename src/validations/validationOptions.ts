/**
 * Common Joi Validation Options
 */
import { ValidationOptions } from 'joi';

/**
 * Default validation options for request validation
 */
export const defaultValidationOptions: ValidationOptions = {
  abortEarly: false, // Collect all validation errors
  stripUnknown: true, // Remove unknown fields from request
  allowUnknown: false, // Don't allow unknown fields
};

