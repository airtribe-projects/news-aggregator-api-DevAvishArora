const dotenv = require('dotenv');

dotenv.config();

const config = {
  port: process.env.PORT || 3000,
  environment: process.env.NODE_ENV || 'development',

  jwt: {
    secret: process.env.JWT_SECRET || 'fallback-secret-key',
    expiresIn: process.env.JWT_EXPIRES_IN || '24h',
  },

  newsApi: {
    newsApiKey: process.env.NEWS_API_KEY,
    gnewsApiKey: process.env.GNEWS_API_KEY,
    newscatcherApiKey: process.env.NEWSCATCHER_API_KEY,
  },

  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
    maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  },

  cache: {
    ttl: parseInt(process.env.CACHE_TTL) || 3600,
  },

  newsApiUrls: {
    newsApi: 'https://newsapi.org/v2',
    gnews: 'https://gnews.io/api/v4',
    newscatcher: 'https://api.newscatcherapi.com/v2',
  },

  defaultPreferences: {
    categories: [
      'general', 'technology', 'business', 'health', 'science', 'sports', 'entertainment',
      'movies', 'comics', 'games'
    ],
    languages: ['en'],
    sources: [],
  },
};

module.exports = config;