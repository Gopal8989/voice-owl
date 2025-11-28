/**
 * Joi Validation Schemas for Transcription Requests
 */
import Joi from 'joi';

/**
 * Custom validator for HTTP/HTTPS URL protocol
 */
const httpUrlValidator = (value: string, helpers: Joi.CustomHelpers) => {
  try {
    const url = new URL(value);
    if (!['http:', 'https:'].includes(url.protocol)) {
      return helpers.error('string.uriCustomScheme');
    }
    return value;
  } catch {
    return helpers.error('string.uri');
  }
};

/**
 * Common audioUrl validation schema
 */
const audioUrlSchema = Joi.string()
  .uri()
  .required()
  .trim()
  .custom(httpUrlValidator)
  .messages({
    'string.base': 'audioUrl must be a string',
    'string.empty': 'audioUrl cannot be empty',
    'string.uri': 'audioUrl must be a valid URL',
    'any.required': 'audioUrl is required',
    'string.uriCustomScheme': 'audioUrl must use http or https protocol',
  });

/**
 * Language code validation schema (e.g., en-US, fr-FR)
 */
const languageSchema = Joi.string()
  .pattern(/^[a-z]{2}-[A-Z]{2}$/)
  .optional()
  .default('en-US')
  .messages({
    'string.base': 'language must be a string',
    'string.pattern.base': 'language must be in format: xx-XX (e.g., en-US, fr-FR)',
  });

/**
 * Joi schema for transcription request validation
 */
export const transcriptionRequestSchema = Joi.object({
  audioUrl: audioUrlSchema,
});

/**
 * Joi schema for Azure transcription request validation
 */
export const azureTranscriptionRequestSchema = Joi.object({
  audioUrl: audioUrlSchema,
  language: languageSchema,
});

