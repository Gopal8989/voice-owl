# VoiceOwl - Audio Transcription API Service

A minimal API service built with Node.js, TypeScript, Express, and MongoDB that accepts audio file URLs, performs transcription (mock or Azure Speech-to-Text), and stores results in MongoDB.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [API Endpoints](#api-endpoints)
- [MongoDB Indexing Strategy](#mongodb-indexing-strategy)
- [Scalability Design](#scalability-design)
- [Assumptions](#assumptions)
- [Production Improvements](#production-improvements)
- [Testing](#testing)

## ✨ Features

### Part 1 - Backend API (Required) ✅
- ✅ POST `/api/transcription` - Mock transcription endpoint
- ✅ Downloads audio file from URL (mocked)
- ✅ Returns dummy transcription
- ✅ Saves to MongoDB with `{ audioUrl, transcription, createdAt }`
- ✅ Returns MongoDB record's `_id`
- ✅ TypeScript interfaces for type safety
- ✅ Environment variables support (dotenv)
- ✅ **Enhanced Error Handling** - Custom error classes with proper error types
- ✅ Retry logic for failed downloads
- ✅ **Request Validation** - Comprehensive input validation middleware
- ✅ **Request ID Tracking** - Unique ID for each request for debugging
- ✅ **Structured Logging** - Enhanced logging with context

### Part 2 - MongoDB Query & Indexing (Required) ✅
- ✅ GET `/api/transcriptions` - Fetch transcriptions from last 30 days
- ✅ MongoDB indexing strategy documented

### Part 3 - Scalability & System Design (Required) ✅
- ✅ Scalability approach documented in README

### Part 4 - API Integration (Required) ✅
- ✅ POST `/api/azure-transcription` - Azure Speech-to-Text integration
- ✅ Environment variable configuration for API keys
- ✅ Graceful error handling and fallback
- ✅ Exponential backoff retry logic
- ✅ Support for multiple languages (optional language parameter)

### Bonus Features ✅
- ✅ Jest test cases
- ✅ TypeScript interfaces
- ✅ Retry logic with exponential backoff
- ✅ Multiple language support for Azure

### Enhanced Features (Scaling & Production Ready) ✅
- ✅ **Rate Limiting** - Per-IP rate limiting to prevent abuse
- ✅ **Connection Pooling** - MongoDB connection pool configuration
- ✅ **Enhanced Health Check** - Database status, memory usage, uptime
- ✅ **Custom Error Classes** - ValidationError, NotFoundError, ExternalServiceError, etc.
- ✅ **Request ID Tracking** - Unique ID for each request in logs and responses
- ✅ **Structured Logging** - Context-aware logging with request IDs
- ✅ **Joi Validation** - Comprehensive input validation using Joi schemas with organized validation folder structure
- ✅ **Input Validation Middleware** - URL validation, protocol checks, language format validation
- ✅ **Error Context** - Request IDs included in error responses
- ✅ **Memory Monitoring** - Health check includes memory usage
- ✅ **Graceful Error Handling** - Proper error propagation and handling
- ✅ **Standardized API Responses** - All responses include `success` and `message` fields for consistent API structure

## 🛠 Tech Stack

- **Runtime**: Node.js (>=18.0.0)
- **Language**: TypeScript
- **Framework**: Express.js
- **Database**: MongoDB (with Mongoose ODM)
- **External API**: Azure Cognitive Services Speech SDK
- **Validation**: Joi - Schema-based validation library
- **Testing**: Jest + Supertest
- **Package Manager**: npm/pnpm

## 📁 Project Structure

```
voiceowl/
├── src/                         # Source TypeScript files
│   ├── config/                  # Configuration files
│   │   ├── database.ts          # MongoDB connection configuration
│   │   ├── env.ts               # Environment variables configuration
│   │   └── swagger.ts           # Swagger/OpenAPI documentation setup
│   ├── controllers/             # Request handlers (HTTP layer)
│   │   └── transcriptionController.ts  # Transcription endpoints handlers
│   ├── middlewares/             # Express middleware
│   │   ├── errorHandler.ts      # Centralized error handling middleware
│   │   ├── rateLimiter.ts      # Rate limiting middleware
│   │   ├── requestId.ts        # Request ID tracking middleware
│   │   └── validator.ts        # Input validation middleware
│   ├── models/                  # Database models/schemas
│   │   └── Transcription.ts     # MongoDB schema/model with indexes
│   ├── repositories/            # Data access layer
│   │   └── transcriptionRepository.ts  # MongoDB operations abstraction
│   ├── routes/                  # API route definitions
│   │   └── transcriptionRoutes.ts       # Route definitions with Swagger docs
│   ├── services/                # Business logic layer
│   │   ├── audioService.ts      # Audio download service (mocked)
│   │   ├── transcriptionService.ts     # Mock transcription service
│   │   └── azureSpeechService.ts        # Azure Speech-to-Text integration
│   ├── types/                   # TypeScript type definitions
│   │   └── index.ts             # Shared interfaces and types
│   ├── utils/                   # Utility functions
│   │   ├── errors.ts            # Custom error classes
│   │   ├── logger.ts            # Structured logging utility
│   │   ├── swagger.ts           # Swagger common utilities
│   │   └── swaggerHelpers.ts    # Swagger helper functions
│   ├── validations/             # Joi validation schemas
│   │   ├── schemas/             # Validation schemas by feature
│   │   │   └── transcriptionSchemas.ts  # Transcription validation schemas
│   │   ├── validationOptions.ts # Common validation options
│   │   └── index.ts            # Export all schemas
│   ├── app.ts                   # Express app configuration
│   └── server.ts                # Server entry point
├── tests/                       # Test files
│   └── transcription.test.ts    # Jest test cases for API endpoints
├── dist/                        # Compiled JavaScript output (generated)
│   ├── config/                  # Compiled config files
│   ├── controllers/             # Compiled controllers
│   ├── middlewares/             # Compiled middlewares
│   ├── models/                  # Compiled models
│   ├── repositories/            # Compiled repositories
│   ├── routes/                  # Compiled routes
│   ├── services/                # Compiled services
│   ├── types/                   # Compiled types
│   ├── utils/                   # Compiled utilities
│   ├── app.js                   # Compiled app
│   └── server.js                # Compiled server
├── node_modules/                # Dependencies (generated)
├── .env                         # Environment variables (not in repo)
├── package.json                 # Project dependencies and scripts
├── package-lock.json            # Locked dependency versions
├── tsconfig.json                # TypeScript configuration
├── jest.config.js               # Jest test configuration
├── README.md                    # Project documentation
├── COMPLETION_STATUS.md         # Feature completion status
├── ENHANCEMENTS.md              # Enhancement documentation
├── ENV_FIX.md                   # Environment setup guide
├── SWAGGER_DOCUMENTATION.md     # Swagger documentation guide
└── SWAGGER_USAGE.md             # Swagger usage guide
```

### Detailed File Structure

#### **Source Files (`src/`)**

**Configuration (`src/config/`)**
- `database.ts` - MongoDB connection setup, connection pooling configuration
- `env.ts` - Environment variable validation and configuration
- `swagger.ts` - Swagger/OpenAPI documentation configuration

**Controllers (`src/controllers/`)**
- `transcriptionController.ts` - HTTP request handlers for transcription endpoints

**Middlewares (`src/middlewares/`)**
- `errorHandler.ts` - Centralized error handling and formatting
- `rateLimiter.ts` - Per-IP rate limiting middleware
- `requestId.ts` - Request ID generation and tracking
- `validator.ts` - Input validation for requests

**Models (`src/models/`)**
- `Transcription.ts` - Mongoose schema with indexes for performance

**Repositories (`src/repositories/`)**
- `transcriptionRepository.ts` - Data access layer for MongoDB operations

**Routes (`src/routes/`)**
- `transcriptionRoutes.ts` - API route definitions with Swagger documentation

**Services (`src/services/`)**
- `audioService.ts` - Audio file download service (currently mocked)
- `transcriptionService.ts` - Mock transcription service
- `azureSpeechService.ts` - Azure Speech-to-Text API integration

**Types (`src/types/`)**
- `index.ts` - TypeScript interfaces and type definitions

**Utils (`src/utils/`)**
- `errors.ts` - Custom error classes (ValidationError, NotFoundError, etc.)
- `logger.ts` - Structured logging utility with context
- `swagger.ts` - Swagger common utilities (examples, responses, tags)
- `swaggerHelpers.ts` - Swagger helper functions (URL generation, schema refs)

**Validations (`src/validations/`)**
- `schemas/transcriptionSchemas.ts` - Joi validation schemas for transcription requests
- `validationOptions.ts` - Common Joi validation options configuration
- `index.ts` - Export all validation schemas

**Root Source Files**
- `app.ts` - Express application setup and middleware configuration
- `server.ts` - Server entry point, starts HTTP server

#### **Test Files (`tests/`)**
- `transcription.test.ts` - Jest test cases for API endpoints

#### **Configuration Files (Root)**
- `package.json` - Project metadata, dependencies, npm scripts
- `tsconfig.json` - TypeScript compiler configuration
- `jest.config.js` - Jest testing framework configuration
- `.env` - Environment variables (not tracked in git)

#### **Documentation Files**
- `README.md` - Main project documentation
- `COMPLETION_STATUS.md` - Feature completion tracking
- `ENHANCEMENTS.md` - Enhancement documentation
- `ENV_FIX.md` - Environment setup troubleshooting
- `SWAGGER_DOCUMENTATION.md` - Swagger documentation guide
- `SWAGGER_USAGE.md` - Swagger usage examples

#### **Generated Files**
- `dist/` - Compiled JavaScript files (generated by TypeScript compiler)
- `node_modules/` - npm dependencies (generated by `npm install`)

### Code Organization & Architecture

The codebase follows a **layered architecture** pattern with clear separation of concerns:

#### **1. Controllers Layer** (`src/controllers/`)
- **Purpose**: Handle HTTP requests and responses
- **Responsibilities**:
  - Extract data from HTTP requests
  - Call appropriate services
  - Format and send HTTP responses
  - Handle request/response transformation
- **Files**: `transcriptionController.ts`
- **Pattern**: Static methods for stateless operations

#### **2. Services Layer** (`src/services/`)
- **Purpose**: Business logic and external integrations
- **Responsibilities**:
  - Implement core business rules
  - Coordinate between different services
  - Handle external API calls (Azure Speech)
  - Retry logic and error handling
- **Files**:
  - `transcriptionService.ts` - Mock transcription logic
  - `azureSpeechService.ts` - Azure Speech-to-Text integration
  - `audioService.ts` - Audio download handling (mocked)

#### **3. Repositories Layer** (`src/repositories/`)
- **Purpose**: Data access abstraction
- **Responsibilities**:
  - Encapsulate MongoDB operations
  - Provide clean interface for data access
  - Handle data transformation
  - Abstract database implementation details
- **Files**: `transcriptionRepository.ts`
- **Benefits**: Easy to swap database or add caching layer

#### **4. Models Layer** (`src/models/`)
- **Purpose**: Database schema definitions
- **Responsibilities**:
  - Define data structure
  - Set up indexes for performance
  - Define validation rules
  - Type definitions for TypeScript
- **Files**: `Transcription.ts`
- **Features**: Indexes optimized for query patterns

#### **5. Routes Layer** (`src/routes/`)
- **Purpose**: API endpoint definitions
- **Responsibilities**:
  - Define URL paths
  - Apply middleware (validation, rate limiting)
  - Connect routes to controllers
  - Swagger/OpenAPI documentation
- **Files**: `transcriptionRoutes.ts`
- **Middleware Chain**: Rate Limiting → Validation → Controller

#### **6. Middlewares** (`src/middlewares/`)
- **Purpose**: Cross-cutting concerns
- **Files**:
  - `errorHandler.ts` - Centralized error handling
  - `validator.ts` - Request validation
  - `rateLimiter.ts` - Rate limiting
  - `requestId.ts` - Request tracking
- **Benefits**: Reusable, testable, composable

#### **7. Types** (`src/types/`)
- **Purpose**: TypeScript type definitions
- **Responsibilities**:
  - Define request/response interfaces
  - Ensure type safety across layers
  - Document data structures
- **Files**: `index.ts`

#### **8. Configuration** (`src/config/`)
- **Purpose**: Application configuration
- **Files**:
  - `database.ts` - MongoDB connection and pooling
  - `swagger.ts` - API documentation configuration

#### **9. Utilities** (`src/utils/`)
- **Purpose**: Shared utilities
- **Files**:
  - `errors.ts` - Custom error classes
  - `logger.ts` - Structured logging
  - `swagger.ts` - Swagger common utilities (examples, responses, tags)
  - `swaggerHelpers.ts` - Swagger helper functions (URL generation, schema refs)

#### **Architecture Benefits**:
- ✅ **Separation of Concerns**: Each layer has a single responsibility
- ✅ **Testability**: Easy to mock and test each layer independently
- ✅ **Maintainability**: Changes in one layer don't affect others
- ✅ **Scalability**: Easy to add caching, queues, or new features
- ✅ **Type Safety**: TypeScript ensures type correctness across layers

## 🚀 Quick Start

### Prerequisites

- Node.js >= 18.0.0
- MongoDB (local installation or MongoDB Atlas)
- (Optional) Azure Speech Service credentials for Azure transcription

### Access API Documentation

After starting the server, visit:
- **Swagger UI**: http://localhost:7070/api-docs
- **Health Check**: http://localhost:7070/health

### Installation & Setup

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Configure environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   # Server Configuration
   PORT=7070
   NODE_ENV=development

   # MongoDB Configuration
   MONGODB_URI=mongodb://localhost:27017/voiceowl
   # For MongoDB Atlas: mongodb+srv://username:password@cluster.mongodb.net/voiceowl

   # Azure Speech Service Configuration (Optional)
   AZURE_SPEECH_KEY=your_azure_speech_key_here
   AZURE_SPEECH_REGION=your_azure_speech_region_here

   # Retry Configuration
   MAX_RETRY_ATTEMPTS=3
   RETRY_DELAY_MS=1000

   # MongoDB Connection Pool Configuration (Optional)
   MONGODB_MAX_POOL_SIZE=10
   MONGODB_MIN_POOL_SIZE=2
   ```

3. **Start MongoDB**
   
   If using local MongoDB:
   ```bash
   mongod
   ```
   
   Or use MongoDB Atlas (cloud) and update `MONGODB_URI` in `.env`.

4. **Run the server**
   ```bash
   # Development mode (with hot reload)
   npm run dev

   # Production mode
   npm run build
   npm start
   ```

5. **Test the API**
   
   **Health check (includes Swagger URL):**
   ```bash
   curl http://localhost:7070/health
   ```
   
   **Get API info (includes Swagger URL):**
   ```bash
   curl http://localhost:7070/api/info
   ```
   
   **Create a transcription:**
   ```bash
   curl -X POST http://localhost:7070/api/transcription \
     -H "Content-Type: application/json" \
     -d '{"audioUrl": "https://example.com/sample.mp3"}'
   ```
   
   **Get transcriptions:**
   ```bash
   curl http://localhost:7070/api/transcriptions
   ```
   
   **Run tests:**
   ```bash
   npm test
   ```

## 📚 API Documentation

### Swagger UI - Interactive API Documentation

**Access Swagger UI:**
- **Development**: http://localhost:7070/api-docs
- **Production**: https://api.voiceowl.com/api-docs

**Swagger UI Features:**
- ✅ Complete API endpoint documentation
- ✅ Request/response schemas with examples
- ✅ Try-it-out functionality (test endpoints directly)
- ✅ Example requests and responses
- ✅ Error response documentation
- ✅ Tagged endpoints for easy navigation
- ✅ Schema definitions and validation rules

**Swagger Common Service:**
- ✅ Reusable Swagger utilities (`src/utils/swagger.ts`)
- ✅ Helper functions for URL generation (`src/utils/swaggerHelpers.ts`)
- ✅ Common examples, tags, and schema references
- ✅ Consistent documentation across all endpoints
- ✅ See `SWAGGER_USAGE.md` for usage guide

**How to Use:**
1. Start the server: `npm run dev`
2. Navigate to: http://localhost:7070/api-docs
3. Click on any endpoint to view details
4. Click "Try it out" to test the endpoint
5. Fill in parameters and click "Execute"
6. View the response

**Documented Endpoints:**
- `POST /api/transcription` - Create mock transcription
- `GET /api/transcriptions` - Get transcriptions (last 30 days)
- `POST /api/azure-transcription` - Create Azure transcription
- `GET /health` - Health check endpoint

## 📡 API Endpoints

### 1. POST `/api/transcription`

Create a mock transcription from an audio URL.

**Request:**
```json
{
  "audioUrl": "https://example.com/sample.mp3"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Transcription created successfully",
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "audioUrl": "https://example.com/sample.mp3",
    "transcription": "transcribed text",
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
}
```

**Error Response (400 Bad Request):**
```json
{
  "success": false,
  "error": "ValidationError",
  "message": "audioUrl is required",
  "statusCode": 400,
  "requestId": "550e8400-e29b-41d4-a716-446655440000"
}
```

**Error Response (429 Too Many Requests):**
```json
{
  "success": false,
  "error": "RateLimitError",
  "message": "Rate limit exceeded. Maximum 10 requests per 60 seconds. Reset at 2024-01-15T10:31:00.000Z",
  "statusCode": 429,
  "requestId": "550e8400-e29b-41d4-a716-446655440000"
}
```

### 2. GET `/api/transcriptions`

Get all transcriptions created in the last 30 days.

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Transcriptions fetched successfully",
  "data": {
    "count": 2,
    "transcriptions": [
      {
        "_id": "507f1f77bcf86cd799439011",
        "audioUrl": "https://example.com/sample1.mp3",
        "transcription": "transcribed text",
        "createdAt": "2024-01-15T10:30:00.000Z",
        "source": "mock"
      },
      {
        "_id": "507f1f77bcf86cd799439012",
        "audioUrl": "https://example.com/sample2.mp3",
        "transcription": "Azure transcribed text",
        "createdAt": "2024-01-14T09:20:00.000Z",
        "source": "azure"
      }
    ]
  }
}
```

### 3. POST `/api/azure-transcription`

Create a transcription using Azure Speech-to-Text service.

**Request:**
```json
{
  "audioUrl": "https://example.com/sample.mp3",
  "language": "en-US"  // Optional, defaults to "en-US"
}
```

**Supported Languages:**
- `en-US` (English - US)
- `fr-FR` (French)
- `es-ES` (Spanish)
- `de-DE` (German)
- And other Azure Speech supported languages

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Azure transcription created successfully",
  "data": {
    "id": "507f1f77bcf86cd799439013",
    "audioUrl": "https://example.com/sample.mp3",
    "transcription": "[Mock] Transcribed text from https://example.com/sample.mp3",
    "source": "azure",
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
}
```

**Note**: If Azure credentials are not configured, the service falls back to mock transcription.

### Health Check

**GET `/health`**

Returns server status and API endpoints including Swagger URL.

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Server is healthy",
  "data": {
    "status": "ok",
    "timestamp": "2024-01-15T10:30:00.000Z",
    "uptime": 3600.5,
    "database": {
      "connected": true,
      "readyState": 1
    },
    "memory": {
      "used": 45.23,
      "total": 128.5
    },
    "api": {
      "swagger": "http://localhost:7070/api-docs",
      "health": "http://localhost:7070/health",
      "transcription": "http://localhost:7070/api/transcription",
      "transcriptions": "http://localhost:7070/api/transcriptions",
      "azureTranscription": "http://localhost:7070/api/azure-transcription"
    }
  }
}
```

### API Information

**GET `/api/info`**

Returns API information including Swagger URL and all available endpoints.

**Response (200 OK):**
```json
{
  "success": true,
  "message": "API information retrieved successfully",
  "data": {
    "name": "VoiceOwl API",
    "version": "1.0.0",
    "description": "Audio Transcription API Service",
    "swagger": "http://localhost:7070/api-docs",
    "endpoints": {
      "health": "http://localhost:7070/health",
      "transcription": {
        "create": "http://localhost:7070/api/transcription",
        "method": "POST",
        "description": "Create a mock transcription"
      },
      "transcriptions": {
        "list": "http://localhost:7070/api/transcriptions",
        "method": "GET",
        "description": "Get transcriptions from last 30 days"
      },
      "azureTranscription": {
        "create": "http://localhost:7070/api/azure-transcription",
        "method": "POST",
        "description": "Create transcription using Azure Speech-to-Text"
      }
    }
  }
}
```

**Response (503 Service Unavailable)** - When database is disconnected:
```json
{
  "success": true,
  "message": "Server is running but database is disconnected",
  "data": {
    "status": "ok",
    "timestamp": "2024-01-15T10:30:00.000Z",
    "uptime": 3600.5,
    "database": {
      "connected": false,
      "readyState": 0
    },
    "memory": {
      "used": 45.23,
      "total": 128.5
    }
  }
}
```

## 🗄 MongoDB Indexing Strategy & Performance

### Index Design Philosophy

The indexing strategy is designed to optimize the most common query patterns while maintaining write performance. All indexes are carefully chosen based on actual query requirements.

### Index Selection Criteria

1. **Query Frequency**: Indexes prioritize frequently executed queries
2. **Selectivity**: Indexes are selective (not too many duplicate values)
3. **Write Performance**: Balance between read and write performance
4. **Storage Cost**: Consider index storage overhead
5. **Maintenance**: Indexes are maintainable and monitorable

### Current Indexes

The `Transcription` model includes the following optimized indexes:

1. **Primary Index on `createdAt` (descending)**
   ```typescript
   TranscriptionSchema.index({ createdAt: -1 });
   ```
   - Used for efficient queries on date ranges (last 30 days)
   - Supports sorting by creation date
   - **Query**: `GET /api/transcriptions` (last 30 days)

2. **Compound Index on `createdAt` + `source`**
   ```typescript
   TranscriptionSchema.index({ createdAt: -1, source: 1 });
   ```
   - Optimizes queries filtering by date AND source type
   - **Use Case**: "Get all Azure transcriptions from last 30 days"
   - Reduces index scan time significantly

3. **Index on `audioUrl`**
   ```typescript
   audioUrl: { type: String, index: true }
   ```
   - Used for faster lookups by audio URL
   - Useful for deduplication checks
   - Prevents duplicate transcriptions

4. **Compound Index on `source` + `createdAt`**
   ```typescript
   TranscriptionSchema.index({ source: 1, createdAt: -1 });
   ```
   - Optimizes source-specific queries with date sorting
   - **Use Case**: "Get latest mock transcriptions"
   - Efficient for filtering by source type

5. **TTL Index (Optional - Commented)**
   ```typescript
   // TranscriptionSchema.index({ createdAt: 1 }, { expireAfterSeconds: 7776000 }); // 90 days
   ```
   - Automatically deletes old records after specified time
   - Uncomment to enable automatic cleanup
   - Prevents database bloat

### Index Performance

**Current Index Strategy:**
- ✅ Optimized for common query patterns
- ✅ Compound indexes for filtered queries
- ✅ Supports efficient date range queries
- ✅ Fast lookups by audioUrl

**Index Usage:**
- `createdAt: -1` → Used by `GET /api/transcriptions` (last 30 days)
- `createdAt: -1, source: 1` → Used for filtered queries by source
- `audioUrl: 1` → Used for deduplication checks
- `source: 1, createdAt: -1` → Used for source-specific queries

### Indexing for 100M+ Records

For a dataset with **100M+ records**, the following additional optimizations would be recommended:

#### 1. **Compound Index on `createdAt` + `source`** ✅ (Already Implemented)
```javascript
TranscriptionSchema.index({ createdAt: -1, source: 1 });
```
- **Purpose**: Optimize queries that filter by date range AND source type
- **Use Case**: "Get all Azure transcriptions from last 30 days"
- **Benefit**: Reduces index scan time significantly
- **Status**: ✅ Already implemented

#### 2. **TTL Index on `createdAt`** (Optional - Ready to Enable)
```javascript
TranscriptionSchema.index({ createdAt: 1 }, { expireAfterSeconds: 2592000 }); // 30 days
```
- **Purpose**: Automatically delete old records after 30 days
- **Benefit**: Prevents database bloat, maintains query performance
- **Status**: Code ready, uncomment to enable

#### 3. **Partial Index** (if most queries are recent)
```javascript
TranscriptionSchema.index(
  { createdAt: -1 },
  { 
    partialFilterExpression: { createdAt: { $gte: new Date(Date.now() - 30*24*60*60*1000) } },
    name: 'recent_transcriptions_idx'
  }
);
```
- **Purpose**: Only index recent records (last 30 days)
- **Benefit**: Smaller index size, faster writes for old data

#### 4. **Text Index on `transcription`** (if full-text search is needed)
```javascript
TranscriptionSchema.index({ transcription: 'text' });
```
- **Purpose**: Enable full-text search on transcription content
- **Benefit**: Fast text search queries

### Index Maintenance & Monitoring

#### **Monitoring Index Usage**
```javascript
// Check index usage statistics
db.transcriptions.aggregate([{$indexStats: {}}])

// Analyze query performance
db.transcriptions.find({ createdAt: { $gte: ISODate("...") } }).explain("executionStats")
```

#### **Index Maintenance Tasks**
- **Regular Monitoring**: Track index hit rates and query performance
- **Index Rebuilds**: For very large collections (100M+), periodic rebuilds may be needed
- **Index Optimization**: Remove unused indexes, add missing indexes based on query patterns
- **Storage Management**: Monitor index size and storage impact

#### **Best Practices**
- ✅ **Selectivity**: Ensure indexes are selective (not too many duplicate values)
- ✅ **Compound Order**: Order fields in compound indexes by selectivity (most selective first)
- ✅ **Covered Queries**: Design indexes to cover queries (include all queried fields)
- ✅ **Index Intersection**: MongoDB can use multiple indexes, but compound indexes are more efficient
- ✅ **TTL Indexes**: Use for automatic data cleanup (already prepared in code)

#### **Index Performance Metrics**
- **Index Hit Rate**: Should be > 95% for frequently used indexes
- **Query Execution Time**: Should be < 100ms for indexed queries
- **Index Size**: Monitor index size vs collection size ratio
- **Write Impact**: Monitor write performance impact of indexes

## 🚀 Scalability Design

To handle **10k+ concurrent requests**, I would implement the following changes:

### 1. **Horizontal Scaling with Load Balancing**

- **Containerization**: Dockerize the application for consistent deployment
- **Load Balancer**: Use NGINX or AWS ALB to distribute traffic across multiple instances
- **Auto-scaling**: Implement auto-scaling based on CPU/memory metrics (e.g., Kubernetes HPA, AWS ECS auto-scaling)
- **Stateless Design**: Ensure the application is stateless (no in-memory session storage)

### 2. **Caching Layer**

- **Redis Cache**: Cache frequently accessed transcriptions
  - Cache key: `transcription:{audioUrl}`
  - TTL: 1 hour (configurable)
  - Reduces database load for duplicate requests
- **CDN**: Use CloudFront/Cloudflare for static assets and API responses
- **Response Caching**: Cache GET `/api/transcriptions` responses for 5-10 minutes

### 3. **Message Queue for Async Processing**

- **Queue System**: Use Bull (Redis-based) or AWS SQS for transcription jobs
  - Decouple HTTP requests from transcription processing
  - Handle retries automatically
  - Scale workers independently
- **Webhook/Callback**: Notify clients when transcription is complete (instead of synchronous response)
- **Job Prioritization**: Priority queue for premium users

### 4. **Database Optimization**

- **Read Replicas**: Use MongoDB replica set with read replicas for GET requests
- **Connection Pooling**: Optimize MongoDB connection pool size
- **Sharding**: For 100M+ records, implement MongoDB sharding by date or audioUrl hash
- **Write Concern**: Use `w: 'majority'` for consistency, but allow `w: 1` for better write performance

### 5. **API Rate Limiting**

- **Per-IP Rate Limiting**: Limit requests per IP (e.g., 100 req/min)
- **Per-User Rate Limiting**: If authentication is added, limit per user
- **Tiered Limits**: Different limits for free vs. paid users

### 6. **Monitoring & Observability**

- **APM Tools**: Use New Relic, Datadog, or AWS CloudWatch for performance monitoring
- **Logging**: Centralized logging (ELK stack, CloudWatch Logs)
- **Metrics**: Track request latency, error rates, queue depth
- **Alerts**: Set up alerts for high error rates, slow queries, queue backlog

### 7. **Infrastructure as Code**

- **Kubernetes**: Deploy on K8s for orchestration
- **Terraform/CloudFormation**: Infrastructure provisioning
- **CI/CD Pipeline**: Automated testing and deployment

### Example Architecture (High Level)

```
[Client] 
    ↓
[Load Balancer (NGINX/AWS ALB)]
    ↓
[API Servers (Multiple Instances)]
    ↓
[Redis Cache] ← [Message Queue (Bull/SQS)]
    ↓
[MongoDB Primary] → [MongoDB Replicas (Read)]
```

### Estimated Capacity

With these changes:
- **10k concurrent requests**: ✅ Achievable with 5-10 API server instances
- **100k requests/day**: ✅ Easily handled
- **1M requests/day**: ✅ Requires proper caching and queue management

## ✅ Validation

The API uses **Joi** for comprehensive request validation with an organized validation folder structure.

### Validation Structure

All validation schemas are organized in the `src/validations/` folder:

```
src/validations/
├── schemas/
│   └── transcriptionSchemas.ts    # Transcription validation schemas
├── validationOptions.ts            # Common validation options
└── index.ts                        # Export all schemas
```

### Validation Features

- ✅ **Schema-based Validation** - Using Joi schemas for type-safe validation
- ✅ **URL Validation** - Validates URL format and ensures HTTP/HTTPS protocol
- ✅ **Language Code Validation** - Validates language format (xx-XX pattern)
- ✅ **Automatic Sanitization** - Trims whitespace and removes unknown fields
- ✅ **Comprehensive Error Messages** - Clear, descriptive validation error messages
- ✅ **Reusable Validators** - Shared validation schemas for common fields

### Validation Schemas

**Transcription Request Schema:**
- `audioUrl` (required): Valid HTTP/HTTPS URL string

**Azure Transcription Request Schema:**
- `audioUrl` (required): Valid HTTP/HTTPS URL string
- `language` (optional): Language code in format `xx-XX` (defaults to `en-US`)

### Example Validation Errors

```json
{
  "success": false,
  "error": "ValidationError",
  "message": "audioUrl is required",
  "statusCode": 400,
  "requestId": "550e8400-e29b-41d4-a716-446655440000"
}
```

```json
{
  "success": false,
  "error": "ValidationError",
  "message": "audioUrl must be a valid URL, audioUrl must use http or https protocol",
  "statusCode": 400,
  "requestId": "550e8400-e29b-41d4-a716-446655440000"
}
```

### Adding New Validations

1. Create a new schema file in `src/validations/schemas/`
2. Define Joi schemas with appropriate validation rules
3. Export schemas from the file
4. Add exports to `src/validations/index.ts`
5. Use in middleware or controllers

## 💭 Assumptions & Design Decisions

### Technical Assumptions

1. **Audio Download**: 
   - Currently mocked for evaluation purposes
   - In production, would download and validate audio files
   - Would check file format, size limits, and accessibility
   - Would implement streaming for large files

2. **Azure Speech SDK**: 
   - Uses mock transcription if credentials are not configured
   - In production, would require valid Azure credentials
   - Falls back gracefully to prevent service disruption
   - Supports multiple languages via language parameter

3. **MongoDB**: 
   - Assumes MongoDB is running and accessible
   - No migration scripts included (using Mongoose directly)
   - Connection pooling configured for optimal performance
   - Indexes optimized for common query patterns

4. **Validation**: 
   - Uses Joi for schema-based validation
   - All requests are validated before processing
   - Unknown fields are automatically stripped
   - Validation errors return clear, descriptive messages

4. **Authentication**: 
   - No authentication/authorization implemented (not required in task)
   - Rate limiting is per-IP based
   - Production would add JWT/OAuth2 authentication
   - User-based rate limiting would replace IP-based

5. **File Size Limits**: 
   - Request body size limit: 10MB (configurable)
   - No explicit audio file size limits (would add in production)
   - Would validate file size before processing

6. **URL Validation**: 
   - Joi-based URL format validation implemented
   - Protocol validation (http/https only) using custom Joi validator
   - Automatic URL trimming and sanitization
   - In production, would validate:
     - Audio file format (MP3, WAV, etc.)
     - File accessibility
     - File size before download
     - Content-Type headers

7. **Error Handling**: 
   - Custom error classes implemented
   - Request IDs for tracking
   - Production-ready error responses
   - Structured logging for debugging

8. **Testing**: 
   - Uses test database connection
   - In CI/CD, would use MongoDB Memory Server
   - Test coverage includes main endpoints
   - Would add integration and E2E tests for production

### Business Assumptions

1. **Transcription Source**: 
   - Supports both mock and Azure transcriptions
   - Source field distinguishes between them
   - Mock transcription is for testing/demo purposes

2. **Data Retention**: 
   - Transcriptions stored indefinitely by default
   - TTL index available for auto-cleanup (commented)
   - Production would implement data retention policies

3. **Rate Limiting**: 
   - General API: 100 requests/minute per IP
   - Transcription endpoints: 10 requests/minute per IP
   - Production would implement user-based limits

4. **Scalability**: 
   - Designed to handle 10k+ concurrent requests
   - Stateless design for horizontal scaling
   - Ready for containerization and load balancing

### Design Decisions

1. **TypeScript**: Chosen for type safety and better developer experience
2. **Express**: Lightweight, flexible, widely adopted
3. **Mongoose**: ODM for MongoDB with schema validation
4. **Joi**: Schema-based validation for type-safe request validation
5. **Repository Pattern**: Abstraction for data access, easy to add caching
6. **Middleware Chain**: Composable middleware for cross-cutting concerns
7. **Custom Error Classes**: Better error handling and HTTP status mapping
8. **Request ID Tracking**: Essential for debugging in distributed systems
9. **Swagger Documentation**: Self-documenting API for easy integration
10. **Standardized Responses**: Consistent API response format with success/message/data structure

## 🔧 Production Improvements & Roadmap

### ✅ Already Implemented

- ✅ Custom error classes with proper HTTP status codes
- ✅ Request ID tracking for debugging
- ✅ Structured logging with context
- ✅ Rate limiting (per-IP)
- ✅ Input validation middleware
- ✅ MongoDB connection pooling
- ✅ Enhanced health check endpoint
- ✅ Swagger/OpenAPI documentation
- ✅ Retry logic with exponential backoff
- ✅ TypeScript for type safety

### 🔒 Security Improvements (Priority: High)

1. **Authentication & Authorization**
   - [ ] Add JWT-based authentication
   - [ ] Implement OAuth2 for third-party integrations
   - [ ] Role-based access control (RBAC)
   - [ ] API key management for external clients
   - [ ] User-based rate limiting (replace IP-based)

2. **Input Validation & Sanitization**
   - [ ] Add Joi/Zod schemas for comprehensive validation
   - [ ] Sanitize all user inputs
   - [ ] Validate audio file formats before processing
   - [ ] Implement file size limits per user tier
   - [ ] Content-Type validation

3. **Security Headers & Protocols**
   - [ ] HTTPS/TLS enforcement
   - [ ] CORS configuration for specific origins
   - [ ] XSS protection headers
   - [ ] CSRF protection
   - [ ] Security audit logging

### ⚡ Performance Improvements (Priority: High)

1. **Caching Strategy**
   - [ ] Implement Redis caching layer
   - [ ] Cache transcription results by audioUrl
   - [ ] Cache GET `/api/transcriptions` responses
   - [ ] Implement cache invalidation strategy
   - [ ] CDN for static assets

2. **Database Optimization**
   - [ ] Add pagination for GET `/api/transcriptions`
   - [ ] Implement database query optimization
   - [ ] Add read replicas for GET requests
   - [ ] Implement sharding for 100M+ records
   - [ ] Query result caching

3. **Response Optimization**
   - [ ] Response compression (gzip/brotli)
   - [ ] Implement ETags for caching
   - [ ] Optimize JSON serialization
   - [ ] Implement field selection (projection)

### 🛡️ Reliability Improvements (Priority: High)

1. **Async Processing**
   - [ ] Implement message queue (Bull/SQS)
   - [ ] Decouple HTTP requests from transcription processing
   - [ ] Webhook notifications for completed transcriptions
   - [ ] Job prioritization for premium users
   - [ ] Retry queue for failed transcriptions

2. **Resilience Patterns**
   - [ ] Circuit breaker for Azure Speech API
   - [ ] Health check endpoints for all dependencies
   - [ ] Graceful degradation when services are down
   - [ ] Database transaction support
   - [ ] Idempotency keys for retries

3. **Error Handling**
   - [ ] Enhanced error tracking (Sentry, Rollbar)
   - [ ] Error alerting and notifications
   - [ ] Error recovery mechanisms
   - [ ] Dead letter queue for failed jobs

### 📊 Monitoring & Observability (Priority: Medium)

1. **Logging**
   - [ ] Centralized logging (ELK stack, CloudWatch)
   - [ ] Log aggregation and search
   - [ ] Log retention policies
   - [ ] Structured logging with correlation IDs

2. **Metrics & APM**
   - [ ] Performance metrics (response time, throughput)
   - [ ] APM integration (New Relic, Datadog)
   - [ ] Database query performance monitoring
   - [ ] Custom business metrics
   - [ ] Real-time dashboards

3. **Alerting**
   - [ ] High error rate alerts
   - [ ] Slow query alerts
   - [ ] Service downtime alerts
   - [ ] Rate limit breach alerts
   - [ ] Resource usage alerts

### 🧪 Testing Improvements (Priority: Medium)

1. **Test Coverage**
   - [ ] Integration tests for MongoDB operations
   - [ ] E2E tests for API endpoints
   - [ ] Load testing (Artillery, k6)
   - [ ] Stress testing
   - [ ] Contract testing (Pact)
   - [ ] Test coverage > 80%

2. **Test Infrastructure**
   - [ ] MongoDB Memory Server for CI/CD
   - [ ] Test data factories
   - [ ] Mock external services
   - [ ] Automated test execution

### 🚀 DevOps & Infrastructure (Priority: Medium)

1. **Containerization**
   - [ ] Docker containerization
   - [ ] Multi-stage builds for optimization
   - [ ] Docker Compose for local development
   - [ ] Container health checks

2. **Orchestration**
   - [ ] Kubernetes deployment manifests
   - [ ] Helm charts for deployment
   - [ ] Auto-scaling configuration
   - [ ] Service mesh integration (Istio)

3. **CI/CD Pipeline**
   - [ ] GitHub Actions / GitLab CI
   - [ ] Automated testing in pipeline
   - [ ] Automated deployment
   - [ ] Blue-green deployment strategy
   - [ ] Rollback mechanisms

4. **Configuration Management**
   - [ ] Environment-specific configurations
   - [ ] Secrets management (AWS Secrets Manager, Vault)
   - [ ] Configuration validation
   - [ ] Feature flags

### 🎯 Feature Enhancements (Priority: Low)

1. **Core Features**
   - [ ] Batch transcription support
   - [ ] Transcription status tracking
   - [ ] Audio format validation
   - [ ] File upload support (multipart/form-data)
   - [ ] Transcription editing/correction
   - [ ] Export transcriptions (JSON, TXT, SRT)

2. **Advanced Features**
   - [ ] Real-time transcription streaming (WebSocket)
   - [ ] Workflow engine (transcription → review → approval)
   - [ ] Transcription versioning
   - [ ] User preferences and settings
   - [ ] Transcription search functionality

### 📚 Documentation Improvements (Priority: Low)

- [ ] API versioning strategy
- [ ] Postman collection
- [ ] Architecture diagrams
- [ ] Deployment guides
- [ ] Troubleshooting guides
- [ ] API migration guides

### Implementation Priority

**Phase 1 (Critical for Production)**:
1. Authentication & Authorization
2. Redis Caching
3. Message Queue for Async Processing
4. Enhanced Monitoring

**Phase 2 (Important for Scale)**:
1. Database Read Replicas
2. Load Balancing & Auto-scaling
3. Comprehensive Testing
4. CI/CD Pipeline

**Phase 3 (Nice to Have)**:
1. Advanced Features
2. Enhanced Documentation
3. Performance Optimizations
4. Feature Enhancements

## 📖 API Documentation Access

### Swagger UI

Once the server is running, access the interactive API documentation at:

```
http://localhost:7070/api-docs
```

**Features:**
- 📝 Complete API endpoint documentation
- 🔍 Request/response schemas
- 🧪 Try-it-out functionality (test endpoints directly)
- 📋 Example requests and responses
- ⚠️ Error response documentation
- 🏷️ Tagged endpoints for easy navigation

### API Endpoints Documented:

1. **POST `/api/transcription`** - Create mock transcription
2. **GET `/api/transcriptions`** - Get transcriptions (last 30 days)
3. **POST `/api/azure-transcription`** - Create Azure transcription
4. **GET `/health`** - Health check endpoint

All endpoints include:
- Request body schemas
- Response schemas
- Error responses
- Example values
- Rate limiting information

## 🧪 Testing

### Run Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### Test Coverage

The test suite includes:
- ✅ POST `/api/transcription` - Success and validation tests
- ✅ GET `/api/transcriptions` - Date filtering tests
- ✅ POST `/api/azure-transcription` - Azure integration tests
- ✅ Error handling tests

### Manual Testing

**Test Mock Transcription:**
```bash
curl -X POST http://localhost:7070/api/transcription \
  -H "Content-Type: application/json" \
  -d '{"audioUrl": "https://example.com/sample.mp3"}'
```

**Test Get Transcriptions:**
```bash
curl http://localhost:7070/api/transcriptions
```

**Test Azure Transcription:**
```bash
curl -X POST http://localhost:7070/api/azure-transcription \
  -H "Content-Type: application/json" \
  -d '{"audioUrl": "https://example.com/sample.mp3", "language": "en-US"}'
```

## 📝 License

ISC

## 👤 Author

VoiceOwl Developer Evaluation Task

---

**Note**: This is a minimal implementation for evaluation purposes. For production use, implement the improvements listed in the "Production Improvements" section.
