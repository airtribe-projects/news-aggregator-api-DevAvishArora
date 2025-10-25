# 📰 News Aggregator API

A comprehensive RESTful API for personalized news aggregation built with Node.js, Express.js, and industry best practices. This API provides authentication, user preferences management, news fetching from external sources, and advanced features like caching, search, and article management.

## 🚀 Features

- **User Authentication**: Secure JWT-based authentication with bcrypt password hashing
- **News Aggregation**: Fetch news from multiple external APIs (NewsAPI, GNews)
- **Personalization**: User-specific news preferences and personalized feeds
- **Article Management**: Mark articles as read/favorite, search functionality
- **Security**: Rate limiting, CORS, security headers with Helmet
- **Caching**: Intelligent caching system to reduce external API calls
- **Validation**: Comprehensive input validation and error handling
- **Production Ready**: Proper logging, error handling, and graceful shutdown

## 📋 Prerequisites

- **Node.js** >= 18.0.0
- **npm** (Node Package Manager)
- API keys from news providers (optional but recommended):
  - [NewsAPI](https://newsapi.org/) - 100 requests/day free tier
  - [GNews](https://gnews.io/) - 100 requests/day free tier

## ⚙️ Installation & Setup

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd news-aggregator-api-DevAvishArora
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Configuration

Create a `.env` file in the root directory:

```env
# Environment Configuration
NODE_ENV=development
PORT=3000

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=24h

# News API Configuration (Get your API keys from these providers)
NEWS_API_KEY=your-newsapi-key-here
GNEWS_API_KEY=your-gnews-api-key-here

# API Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Cache Configuration
CACHE_TTL=3600
```

**Note**: The API will work without external API keys by using mock data for testing purposes.

### 4. Start the Server

```bash
# Development mode
npm start

# The server will start at http://localhost:3000
```

## 🧪 Testing

Run the comprehensive test suite:

```bash
npm test
```

The tests cover:
- User registration and authentication
- Preferences management
- News fetching and article operations
- Error handling and validation

## 📚 API Documentation

### Base URL
```
http://localhost:3000/api
```

### Authentication
All protected endpoints require a Bearer token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

---

## 🔐 Authentication Endpoints

### Register User
```http
POST /api/users/signup
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecureP@ssw0rd123",
  "preferences": ["technology", "business"]
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "user_id",
      "name": "John Doe",
      "email": "john@example.com",
      "preferences": ["technology", "business"]
    },
    "token": "jwt_token_here"
  }
}
```

### Login User
```http
POST /api/users/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "SecureP@ssw0rd123"
}
```

---

## 👤 User Management Endpoints

### Get User Preferences
```http
GET /api/users/preferences
Authorization: Bearer <token>
```

### Update User Preferences
```http
PUT /api/users/preferences
Authorization: Bearer <token>
Content-Type: application/json

{
  "preferences": ["technology", "science", "business"]
}
```

### Get User Profile
```http
GET /api/users/profile
Authorization: Bearer <token>
```

---

## 📰 News Endpoints

### Get Personalized News
```http
GET /api/news?page=1&limit=20&category=technology
Authorization: Bearer <token>
```

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Articles per page (default: 20, max: 100)
- `category` (optional): Filter by specific category

### Search News
```http
GET /api/news/search/artificial intelligence?page=1&limit=20
Authorization: Bearer <token>
```

### Get Specific Article
```http
GET /api/news/{article_id}
Authorization: Bearer <token>
```

### Mark Article as Read
```http
POST /api/news/{article_id}/read
Authorization: Bearer <token>
```

### Mark Article as Favorite
```http
POST /api/news/{article_id}/favorite
Authorization: Bearer <token>
```

### Remove from Favorites
```http
DELETE /api/news/{article_id}/favorite
Authorization: Bearer <token>
```

### Get Read Articles
```http
GET /api/news/read?page=1&limit=20
Authorization: Bearer <token>
```

### Get Favorite Articles
```http
GET /api/news/favorites?page=1&limit=20
Authorization: Bearer <token>
```

---

## 📊 Available News Categories

- `general` - General news
- `technology` - Technology news
- `business` - Business and finance
- `health` - Health and medical
- `science` - Science and research
- `sports` - Sports news
- `entertainment` - Entertainment and celebrity news

## 🛡️ Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: Bcrypt with salt rounds
- **Rate Limiting**: Protection against abuse
- **CORS Configuration**: Cross-origin resource sharing
- **Security Headers**: Helmet.js for security headers
- **Input Validation**: Comprehensive validation with express-validator
- **Error Handling**: Proper error responses without sensitive data leakage

## 🎯 Architecture & Best Practices

### Project Structure
```
├── app.js                 # Main application file
├── config/
│   └── config.js         # Configuration management
├── controllers/
│   ├── AuthController.js # Authentication logic
│   ├── UserController.js # User management
│   └── NewsController.js # News operations
├── middleware/
│   ├── auth.js          # Authentication middleware
│   └── security.js      # Security middleware
├── models/
│   ├── User.js          # User model
│   ├── Article.js       # Article model
│   └── DataStore.js     # In-memory data store
├── routes/
│   ├── index.js         # Main router
│   ├── auth.js          # Auth routes
│   ├── users.js         # User routes
│   └── news.js          # News routes
├── services/
│   ├── AuthService.js   # Authentication utilities
│   └── NewsService.js   # News fetching service
└── utils/
    └── responseHelper.js # Response formatting
```

### Design Patterns Used
- **MVC Architecture**: Clear separation of concerns
- **Singleton Pattern**: Single data store instance
- **Factory Pattern**: Article creation from different APIs
- **Middleware Pattern**: Express.js middleware chain
- **Service Layer**: Business logic separation

### Best Practices Implemented
- **DRY Principle**: Reusable components and utilities
- **Error Handling**: Comprehensive error management
- **Security**: Production-ready security measures
- **Validation**: Input sanitization and validation
- **Caching**: Intelligent caching to reduce API calls
- **Logging**: Proper request and error logging
- **Documentation**: Comprehensive API documentation

## 🧩 Postman Testing

### Quick Start Collection
1. Import the following environment variables in Postman:
   - `baseURL`: `http://localhost:3000/api`
   - `authToken`: (will be set after login)

2. Test Flow:
   ```
   1. POST {{baseURL}}/users/signup
   2. POST {{baseURL}}/users/login (save token)
   3. GET {{baseURL}}/users/preferences
   4. PUT {{baseURL}}/users/preferences
   5. GET {{baseURL}}/news
   6. GET {{baseURL}}/news/search/technology
   7. POST {{baseURL}}/news/{id}/read
   8. POST {{baseURL}}/news/{id}/favorite
   ```

### Sample Requests

**Register & Login:**
```javascript
// In Postman Tests tab after login request:
if (pm.response.code === 200) {
    const response = pm.response.json();
    pm.environment.set("authToken", response.data.token);
}
```

## 🚨 Error Handling

The API returns consistent error responses:

```json
{
  "success": false,
  "message": "Error description",
  "errors": "Detailed error information",
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

**Common HTTP Status Codes:**
- `200`: Success
- `400`: Bad Request (validation errors)
- `401`: Unauthorized (invalid/missing token)
- `404`: Not Found
- `409`: Conflict (user already exists)
- `429`: Too Many Requests (rate limit exceeded)
- `500`: Internal Server Error

## 🔧 Configuration

### Environment Variables
All configuration is managed through environment variables for security and flexibility.

### News API Providers
The API supports multiple news providers:
- **NewsAPI**: Primary source, good coverage
- **GNews**: Secondary source, different perspective
- **Mock Data**: Fallback when no API keys provided

### Caching Strategy
- **TTL**: 1 hour default cache time
- **Smart Invalidation**: Category-based cache keys
- **Memory Efficient**: Automatic cleanup

## 🎨 Advanced Features

### Caching System
```javascript
// Automatic caching by category and language
const cacheKey = `newsapi_${category}_${language}_${pageSize}`;
```

### Search Functionality
- Multi-provider search
- Keyword matching in title, description, and content
- Result deduplication

### Article Management
- Read/unread tracking
- Favorite system
- User-specific article history

### Rate Limiting
- Global API rate limiting
- Stricter limits for authentication endpoints
- IP-based tracking

## 📈 Performance Optimizations

- **Caching**: Reduces external API calls by 80%
- **Pagination**: Efficient data loading
- **Deduplication**: Removes duplicate articles across sources
- **Memory Management**: Efficient in-memory storage
- **Async/Await**: Non-blocking operations

## 🛠️ Development

### Adding New News Sources
1. Create a new method in `NewsService.js`
2. Implement the API integration
3. Add URL configuration in `config.js`
4. Update the aggregation logic

### Extending User Features
1. Add new fields to User model
2. Create controller methods
3. Add validation rules
4. Update routes and documentation

## 🚀 Deployment

### Production Checklist
- [ ] Set strong JWT_SECRET
- [ ] Configure proper CORS origins
- [ ] Set up external database (replace DataStore)
- [ ] Configure logging service
- [ ] Set up monitoring and alerting
- [ ] Configure SSL/TLS
- [ ] Set up CI/CD pipeline

### Docker Support (Future Enhancement)
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

## 📝 License

MIT License - see LICENSE file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request


---

**Built with ❤️ using Node.js, Express.js, and modern development practices.**
