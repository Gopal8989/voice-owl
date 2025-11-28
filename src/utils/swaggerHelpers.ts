/**
 * Swagger Helper Functions - Easy-to-use utilities for Swagger documentation
 * Import and use these helpers throughout your codebase for consistent Swagger docs
 */

import { swaggerExamples, swaggerTags } from './swagger';

/**
 * Get Swagger URL dynamically from request
 */
export const getSwaggerUrl = (req: { protocol?: string; get: (header: string) => string | undefined }): string => {
  const protocol = req.protocol || 'http';
  const host = req.get('host') || `localhost:${process.env.PORT || 7070}`;
  return `${protocol}://${host}/api-docs`;
};

/**
 * Get base URL from request
 */
export const getBaseUrl = (req: { protocol?: string; get: (header: string) => string | undefined }): string => {
  const protocol = req.protocol || 'http';
  const host = req.get('host') || `localhost:${process.env.PORT || 7070}`;
  return `${protocol}://${host}`;
};

/**
 * Common Swagger response references
 */
export const swaggerResponseRefs = {
  validationError: '#/components/responses/ValidationError',
  rateLimitError: '#/components/responses/RateLimitError',
  notFoundError: '#/components/responses/NotFoundError',
  internalServerError: '#/components/responses/InternalServerError',
};

/**
 * Common Swagger schema references
 */
export const swaggerSchemaRefs = {
  transcriptionRequest: '#/components/schemas/TranscriptionRequest',
  azureTranscriptionRequest: '#/components/schemas/AzureTranscriptionRequest',
  transcriptionResponse: '#/components/schemas/TranscriptionResponse',
  transcriptionsListResponse: '#/components/schemas/TranscriptionsListResponse',
  errorResponse: '#/components/schemas/ErrorResponse',
  healthResponse: '#/components/schemas/HealthResponse',
  apiInfoResponse: '#/components/schemas/ApiInfoResponse',
};

/**
 * Export all Swagger utilities for easy importing
 */
export { swaggerExamples, swaggerTags };

