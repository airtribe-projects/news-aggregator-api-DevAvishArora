class User {
  constructor({ name, email, password, preferences = [] }) {
    this.id = User.generateId();
    this.name = name;
    this.email = email;
    this.password = password; // This will be hashed
    this.preferences = preferences;
    this.readArticles = new Set();
    this.favoriteArticles = new Set();
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  static generateId() {
    return '_' + Math.random().toString(36).substr(2, 9);
  }

  updatePreferences(newPreferences) {
    this.preferences = newPreferences;
    this.updatedAt = new Date();
  }

  markAsRead(articleId) {
    this.readArticles.add(articleId);
    this.updatedAt = new Date();
  }

  markAsFavorite(articleId) {
    this.favoriteArticles.add(articleId);
    this.updatedAt = new Date();
  }

  removeFavorite(articleId) {
    this.favoriteArticles.delete(articleId);
    this.updatedAt = new Date();
  }

  isArticleRead(articleId) {
    return this.readArticles.has(articleId);
  }

  isArticleFavorite(articleId) {
    return this.favoriteArticles.has(articleId);
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      email: this.email,
      preferences: this.preferences,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}

module.exports = User;