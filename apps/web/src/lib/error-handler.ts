/**
 * Error Handling Utilities
 * 
 * Provides standardized error handling across the application
 */

export class AppError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number = 500,
    public userMessage?: string,
    public details?: Record<string, unknown>
  ) {
    super(message);
    this.name = 'AppError';
    Object.setPrototypeOf(this, AppError.prototype);
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      code: this.code,
      statusCode: this.statusCode,
      userMessage: this.userMessage,
      details: this.details,
    };
  }
}

export class ValidationError extends AppError {
  constructor(
    message: string,
    public fields?: Record<string, string[]>
  ) {
    super(message, 'VALIDATION_ERROR', 400, message);
    this.name = 'ValidationError';
    Object.setPrototypeOf(this, ValidationError.prototype);
  }
}

export class AuthenticationError extends AppError {
  constructor(message: string = 'Authentication required') {
    super(message, 'AUTHENTICATION_ERROR', 401, 'Please log in to continue');
    this.name = 'AuthenticationError';
    Object.setPrototypeOf(this, AuthenticationError.prototype);
  }
}

export class AuthorizationError extends AppError {
  constructor(message: string = 'Insufficient permissions') {
    super(message, 'AUTHORIZATION_ERROR', 403, 'You do not have permission to perform this action');
    this.name = 'AuthorizationError';
    Object.setPrototypeOf(this, AuthorizationError.prototype);
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string = 'Resource') {
    super(`${resource} not found`, 'NOT_FOUND', 404, `${resource} not found`);
    this.name = 'NotFoundError';
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }
}

export class NetworkError extends AppError {
  constructor(message: string = 'Network request failed') {
    super(message, 'NETWORK_ERROR', 0, 'Unable to connect. Please check your internet connection.');
    this.name = 'NetworkError';
    Object.setPrototypeOf(this, NetworkError.prototype);
  }
}

/**
 * Handles errors and returns user-friendly messages
 */
export const handleError = (error: unknown): string => {
  if (error instanceof AppError) {
    return error.userMessage || error.message;
  }
  
  if (error instanceof Error) {
    // Log unexpected errors for debugging
    console.error('Unexpected error:', error);
    return error.message || 'An unexpected error occurred';
  }
  
  return 'An unexpected error occurred. Please try again.';
};

/**
 * Extracts error details for logging
 */
export const getErrorDetails = (error: unknown): Record<string, unknown> => {
  if (error instanceof AppError) {
    return {
      name: error.name,
      code: error.code,
      statusCode: error.statusCode,
      message: error.message,
      details: error.details,
      stack: error.stack,
    };
  }
  
  if (error instanceof Error) {
    return {
      name: error.name,
      message: error.message,
      stack: error.stack,
    };
  }
  
  return {
    error: String(error),
  };
};

/**
 * Checks if error is retryable
 */
export const isRetryableError = (error: unknown): boolean => {
  if (error instanceof NetworkError) {
    return true;
  }
  
  if (error instanceof AppError) {
    // 5xx errors are usually retryable
    return error.statusCode >= 500 && error.statusCode < 600;
  }
  
  return false;
};

/**
 * Creates a user-friendly error message from API response
 */
export const parseApiError = (response: Response, data?: unknown): AppError => {
  const statusCode = response.status;
  const errorData = data as { message?: string; error?: string; code?: string };
  
  switch (statusCode) {
    case 400:
      return new ValidationError(
        errorData?.message || errorData?.error || 'Invalid request',
        errorData as Record<string, string[]>
      );
    case 401:
      return new AuthenticationError(errorData?.message || errorData?.error);
    case 403:
      return new AuthorizationError(errorData?.message || errorData?.error);
    case 404:
      return new NotFoundError(errorData?.message || errorData?.error);
    case 429:
      return new AppError(
        errorData?.message || 'Too many requests',
        'RATE_LIMIT_ERROR',
        429,
        'Too many requests. Please try again later.'
      );
    case 500:
    case 502:
    case 503:
    case 504:
      return new AppError(
        errorData?.message || 'Server error',
        'SERVER_ERROR',
        statusCode,
        'Server error. Please try again later.'
      );
    default:
      return new AppError(
        errorData?.message || errorData?.error || 'Request failed',
        errorData?.code || 'UNKNOWN_ERROR',
        statusCode,
        'An error occurred. Please try again.'
      );
  }
};
