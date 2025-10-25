const User = require('./User');
const Article = require('./Article');

/**
 * In-memory data store for users and articles
 * In a production environment, this would be replaced with a database
 */
class DataStore {
  constructor() {
    this.users = new Map();
    this.articles = new Map();
    this.userSessions = new Map();
  }

  // User operations
  createUser(userData) {
    const user = new User(userData);
    this.users.set(user.email, user);
    return user;
  }

  getUserByEmail(email) {
    return this.users.get(email);
  }

  getUserById(id) {
    for (const user of this.users.values()) {
      if (user.id === id) {
        return user;
      }
    }
    return null;
  }

  updateUser(email, updates) {
    const user = this.users.get(email);
    if (user) {
      Object.assign(user, updates);
      user.updatedAt = new Date();
      return user;
    }
    return null;
  }

  userExists(email) {
    return this.users.has(email);
  }

  // Article operations
  storeArticle(articleData) {
    const article = articleData instanceof Article ? articleData : new Article(articleData);
    this.articles.set(article.id, article);
    return article;
  }

  storeArticles(articlesArray) {
    return articlesArray.map(article => this.storeArticle(article));
  }

  getArticle(id) {
    return this.articles.get(id);
  }

  getAllArticles() {
    return Array.from(this.articles.values());
  }

  searchArticles(query) {
    const searchTerm = query.toLowerCase();
    return Array.from(this.articles.values()).filter(article => 
      article.title?.toLowerCase().includes(searchTerm) ||
      article.description?.toLowerCase().includes(searchTerm) ||
      article.content?.toLowerCase().includes(searchTerm)
    );
  }

  getArticlesByCategory(categories) {
    if (!Array.isArray(categories)) {
      categories = [categories];
    }
    return Array.from(this.articles.values()).filter(article => 
      categories.includes(article.category)
    );
  }

  getUserReadArticles(userId) {
    const user = this.getUserById(userId);
    if (!user) return [];
    
    return Array.from(user.readArticles).map(articleId => this.getArticle(articleId)).filter(Boolean);
  }

  getUserFavoriteArticles(userId) {
    const user = this.getUserById(userId);
    if (!user) return [];
    
    return Array.from(user.favoriteArticles).map(articleId => this.getArticle(articleId)).filter(Boolean);
  }

  markArticleAsRead(userId, articleId) {
    const user = this.getUserById(userId);
    if (user) {
      user.markAsRead(articleId);
      return true;
    }
    return false;
  }

  markArticleAsFavorite(userId, articleId) {
    const user = this.getUserById(userId);
    if (user) {
      user.markAsFavorite(articleId);
      return true;
    }
    return false;
  }

  removeFavoriteArticle(userId, articleId) {
    const user = this.getUserById(userId);
    if (user) {
      user.removeFavorite(articleId);
      return true;
    }
    return false;
  }

  // Statistics and cleanup
  getStats() {
    return {
      totalUsers: this.users.size,
      totalArticles: this.articles.size,
      memoryUsage: process.memoryUsage()
    };
  }

  clearArticles() {
    this.articles.clear();
  }

  clearUsers() {
    this.users.clear();
    this.userSessions.clear();
  }
}

// Create singleton instance
const dataStore = new DataStore();

module.exports = dataStore;