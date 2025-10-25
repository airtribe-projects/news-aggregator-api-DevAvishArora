const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const config = require('../config/config');
const { createErrorResponse } = require('../utils/responseHelper');

/**
 * Security middleware configuration
 */

/**
 * Rate limiting middleware
 */
const rateLimiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.maxRequests,
  message: createErrorResponse(
    'Too many requests',
    'Rate limit exceeded. Please try again later.'
  ),
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => {
    return req.path === '/health' || req.path === '/';
  },
});

/**
 * Strict rate limiter for authentication endpoints
 */
const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: createErrorResponse(
    'Too many authentication attempts',
    'Please try again later.'
  ),
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * CORS configuration
 */
const corsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    
    if (config.environment === 'development') {
      return callback(null, true);
    }
    
    const allowedOrigins = [
      'http://localhost:3000',
      'http://localhost:3001',
    ];
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
};

/**
 * Helmet security configuration
 */
const helmetConfig = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
  crossOriginEmbedderPolicy: false,
});

/**
 * Morgan logger configuration
 */
const morganConfig = config.environment === 'production' 
  ? morgan('combined')
  : morgan('dev');

/**
 * Error handling middleware
 */
const errorHandler = (err, req, res, next) => {
  console.error('Unhandled error:', err);

  let error = {
    message: 'Internal server error',
    status: 500,
  };

  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map(e => e.message);
    error = {
      message: 'Validation error',
      status: 400,
      errors: errors,
    };
  }

  if (err.name === 'JsonWebTokenError') {
    error = {
      message: 'Invalid token',
      status: 401,
    };
  }

  if (err.name === 'TokenExpiredError') {
    error = {
      message: 'Token expired',
      status: 401,
    };
  }

  if (err.message === 'Not allowed by CORS') {
    error = {
      message: 'CORS error',
      status: 403,
    };
  }

  res.status(error.status).json(createErrorResponse(
    error.message,
    error.errors || null
  ));
};

/**
 * 404 handler for unknown routes
 */
const notFoundHandler = (req, res) => {
  res.status(404).json(createErrorResponse(
    'Route not found',
    `The requested endpoint ${req.method} ${req.path} was not found`
  ));
};

/**
 * Health check endpoint
 */
const healthCheck = (req, res) => {
  const uptime = process.uptime();
  const memoryUsage = process.memoryUsage();
  
  res.status(200).json({
    success: true,
    message: 'Service is healthy',
    data: {
      uptime: Math.floor(uptime),
      memory: {
        rss: Math.round(memoryUsage.rss / 1024 / 1024),
        heapTotal: Math.round(memoryUsage.heapTotal / 1024 / 1024),
        heapUsed: Math.round(memoryUsage.heapUsed / 1024 / 1024),
      },
      timestamp: new Date().toISOString(),
    },
  });
};

module.exports = {
  rateLimiter,
  authRateLimiter,
  corsOptions,
  helmetConfig,
  morganConfig,
  errorHandler,
  notFoundHandler,
  healthCheck,
};