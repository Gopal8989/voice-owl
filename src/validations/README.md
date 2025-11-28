# Validations Folder

This folder contains all Joi validation schemas organized by feature/domain.

## Structure

```
validations/
├── schemas/              # Validation schemas organized by feature
│   └── transcriptionSchemas.ts
├── validationOptions.ts  # Common validation options
├── index.ts             # Export all schemas
└── README.md            # This file
```

## Usage

### Importing Schemas

```typescript
import { transcriptionRequestSchema, azureTranscriptionRequestSchema } from '../validations';
```

### Using Validation Options

```typescript
import { defaultValidationOptions } from '../validations/validationOptions';

const { error, value } = schema.validate(data, defaultValidationOptions);
```

## Adding New Validations

1. Create a new schema file in `schemas/` folder (e.g., `userSchemas.ts`)
2. Export schemas from the file
3. Add exports to `index.ts`
4. Use in middleware or controllers

## Schema Organization

- **transcriptionSchemas.ts**: All transcription-related validation schemas
- **validationOptions.ts**: Shared validation configuration options

## Best Practices

- Keep schemas focused on a single domain/feature
- Reuse common validators (e.g., `audioUrlSchema`, `languageSchema`)
- Use descriptive error messages
- Export schemas from `index.ts` for easy importing

