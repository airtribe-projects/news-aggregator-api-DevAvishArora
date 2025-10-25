const express = require('express');
const cors = require('cors');
const config = require('./config/config');

const {
  rateLimiter,
  corsOptions,
  helmetConfig,
  morganConfig,
  errorHandler,
  notFoundHandler,
  healthCheck,
} = require('./middleware/security');

const apiRoutes = require('./routes');

const app = express();
const port = config.port;

app.use(helmetConfig);
app.use(morganConfig);
app.use(cors(corsOptions));
app.use(rateLimiter);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.get('/health', healthCheck);

const legacyRoutes = require('./routes/legacy');

app.use('/', legacyRoutes);

app.use('/api', apiRoutes);

app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'News Aggregator API Server is running',
    version: '1.0.0',
    environment: config.environment,
    endpoints: {
      health: '/health',
      api: '/api',
      docs: '/api (GET for endpoint documentation)',
    },
    timestamp: new Date().toISOString(),
  });
});

app.use(notFoundHandler);
app.use(errorHandler);

process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully...');
  process.exit(0);
});

const server = app.listen(port, (err) => {
  if (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
  console.log(`🚀 News Aggregator API Server is running on port ${port}`);
  console.log(`📊 Environment: ${config.environment}`);
  console.log(`🏥 Health check: http://localhost:${port}/health`);
  console.log(`📖 API documentation: http://localhost:${port}/api`);
});

server.on('error', (error) => {
  if (error.syscall !== 'listen') {
    throw error;
  }

  const bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;

  switch (error.code) {
    case 'EACCES':
      console.error(`${bind} requires elevated privileges`);
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(`${bind} is already in use`);
      process.exit(1);
      break;
    default:
      throw error;
  }
});

module.exports = app;