/**
 * Response Helper Utilities
 * Provides consistent response formatting across the API
 */

/**
 * Create a successful response object
 * @param {string} message - Success message
 * @param {any} data - Response data
 * @param {Object} meta - Optional metadata
 * @returns {Object} - Formatted response object
 */
function createResponse(message, data = null, meta = null) {
  const response = {
    success: true,
    message,
    timestamp: new Date().toISOString(),
  };

  if (data !== null) {
    response.data = data;
  }

  if (meta !== null) {
    response.meta = meta;
  }

  return response;
}

/**
 * Create an error response object
 * @param {string} message - Error message
 * @param {any} errors - Error details
 * @param {number} code - Error code (optional)
 * @returns {Object} - Formatted error response object
 */
function createErrorResponse(message, errors = null, code = null) {
  const response = {
    success: false,
    message,
    timestamp: new Date().toISOString(),
  };

  if (errors !== null) {
    response.errors = errors;
  }

  if (code !== null) {
    response.code = code;
  }

  return response;
}

/**
 * Create a paginated response object
 * @param {string} message - Success message
 * @param {Array} data - Array of data items
 * @param {Object} pagination - Pagination information
 * @returns {Object} - Formatted paginated response
 */
function createPaginatedResponse(message, data, pagination) {
  return createResponse(message, data, {
    pagination: {
      page: pagination.page,
      limit: pagination.limit,
      total: pagination.total,
      totalPages: Math.ceil(pagination.total / pagination.limit),
      hasNext: pagination.page < Math.ceil(pagination.total / pagination.limit),
      hasPrev: pagination.page > 1,
    },
  });
}

/**
 * Sanitize user data for safe output
 * @param {Object} user - User object
 * @returns {Object} - Sanitized user object
 */
function sanitizeUser(user) {
  if (!user) return null;
  
  const { password, ...sanitized } = user;
  return sanitized;
}

/**
 * Format validation errors from express-validator
 * @param {Array} errors - Array of validation errors
 * @returns {Object} - Formatted error object
 */
function formatValidationErrors(errors) {
  const formatted = {};
  errors.forEach(error => {
    if (!formatted[error.param]) {
      formatted[error.param] = [];
    }
    formatted[error.param].push(error.msg);
  });
  return formatted;
}

module.exports = {
  createResponse,
  createErrorResponse,
  createPaginatedResponse,
  sanitizeUser,
  formatValidationErrors,
};