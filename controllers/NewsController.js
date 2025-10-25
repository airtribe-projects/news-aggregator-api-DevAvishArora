const { query, param, validationResult } = require('express-validator');
const NewsService = require('../services/NewsService');
const dataStore = require('../models/DataStore');
const { createResponse, createErrorResponse, createPaginatedResponse } = require('../utils/responseHelper');

/**
 * News Controller
 * Handles news-related operations including fetching, search, read/favorite marking
 */
class NewsController {
  /**
   * Get news articles based on user preferences
   * GET /news
   */
  static async getNews(req, res) {
    try {
      const user = dataStore.getUserById(req.user.userId);
      
      if (!user) {
        return res.status(404).json(createErrorResponse(
          'User not found',
          'User not found in the system'
        ));
      }

      const { page = 1, limit = 20, category } = req.query;
      const pageNumber = parseInt(page);
      const limitNumber = parseInt(limit);

      let preferences = user.preferences.length > 0 ? user.preferences : ['general'];

      if (category) {
        preferences = [category];
      }

      const articles = await NewsService.getPersonalizedNews(preferences, 'en', limitNumber * 2);

      if (articles.length > 0) {
        dataStore.storeArticles(articles);
      }

      const enrichedArticles = articles.map(article => ({
        ...article.toJSON(),
        isRead: user.isArticleRead(article.id),
        isFavorite: user.isArticleFavorite(article.id),
      }));

      const startIndex = (pageNumber - 1) * limitNumber;
      const endIndex = startIndex + limitNumber;
      const paginatedArticles = enrichedArticles.slice(startIndex, endIndex);

      const pagination = {
        page: pageNumber,
        limit: limitNumber,
        total: enrichedArticles.length,
      };

      res.status(200).json(createPaginatedResponse(
        'News retrieved successfully',
        { news: paginatedArticles },
        pagination
      ));
    } catch (error) {
      console.error('Get news error:', error);
      res.status(500).json(createErrorResponse(
        'Internal server error',
        'An error occurred while fetching news'
      ));
    }
  }

  /**
   * Search news articles by keyword
   * GET /news/search/:keyword
   */
  static async searchNews(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json(createErrorResponse(
          'Validation failed',
          errors.array()
        ));
      }

      const { keyword } = req.params;
      const { page = 1, limit = 20 } = req.query;
      const pageNumber = parseInt(page);
      const limitNumber = parseInt(limit);

      const articles = await NewsService.searchNews(keyword, 'en', limitNumber * 2);

      if (articles.length > 0) {
        dataStore.storeArticles(articles);
      }

      const user = dataStore.getUserById(req.user.userId);
      const enrichedArticles = articles.map(article => ({
        ...article.toJSON(),
        isRead: user ? user.isArticleRead(article.id) : false,
        isFavorite: user ? user.isArticleFavorite(article.id) : false,
      }));

      const startIndex = (pageNumber - 1) * limitNumber;
      const endIndex = startIndex + limitNumber;
      const paginatedArticles = enrichedArticles.slice(startIndex, endIndex);

      const pagination = {
        page: pageNumber,
        limit: limitNumber,
        total: enrichedArticles.length,
      };

      res.status(200).json(createPaginatedResponse(
        `Search results for "${keyword}"`,
        { 
          keyword,
          news: paginatedArticles 
        },
        pagination
      ));
    } catch (error) {
      console.error('Search news error:', error);
      res.status(500).json(createErrorResponse(
        'Internal server error',
        'An error occurred while searching news'
      ));
    }
  }

  /**
   * Mark an article as read
   * POST /news/:id/read
   */
  static async markAsRead(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json(createErrorResponse(
          'Validation failed',
          errors.array()
        ));
      }

      const { id } = req.params;
      const article = dataStore.getArticle(id);

      if (!article) {
        return res.status(404).json(createErrorResponse(
          'Article not found',
          'The requested article was not found'
        ));
      }

      const success = dataStore.markArticleAsRead(req.user.userId, id);
      
      if (!success) {
        return res.status(404).json(createErrorResponse(
          'User not found',
          'User not found in the system'
        ));
      }

      res.status(200).json(createResponse(
        'Article marked as read',
        {
          articleId: id,
          title: article.title,
          markedAt: new Date().toISOString(),
        }
      ));
    } catch (error) {
      console.error('Mark as read error:', error);
      res.status(500).json(createErrorResponse(
        'Internal server error',
        'An error occurred while marking article as read'
      ));
    }
  }

  /**
   * Mark an article as favorite
   * POST /news/:id/favorite
   */
  static async markAsFavorite(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json(createErrorResponse(
          'Validation failed',
          errors.array()
        ));
      }

      const { id } = req.params;
      const article = dataStore.getArticle(id);

      if (!article) {
        return res.status(404).json(createErrorResponse(
          'Article not found',
          'The requested article was not found'
        ));
      }

      const success = dataStore.markArticleAsFavorite(req.user.userId, id);
      
      if (!success) {
        return res.status(404).json(createErrorResponse(
          'User not found',
          'User not found in the system'
        ));
      }

      res.status(200).json(createResponse(
        'Article marked as favorite',
        {
          articleId: id,
          title: article.title,
          markedAt: new Date().toISOString(),
        }
      ));
    } catch (error) {
      console.error('Mark as favorite error:', error);
      res.status(500).json(createErrorResponse(
        'Internal server error',
        'An error occurred while marking article as favorite'
      ));
    }
  }

  /**
   * Remove an article from favorites
   * DELETE /news/:id/favorite
   */
  static async removeFavorite(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json(createErrorResponse(
          'Validation failed',
          errors.array()
        ));
      }

      const { id } = req.params;
      const article = dataStore.getArticle(id);

      if (!article) {
        return res.status(404).json(createErrorResponse(
          'Article not found',
          'The requested article was not found'
        ));
      }

      const success = dataStore.removeFavoriteArticle(req.user.userId, id);
      
      if (!success) {
        return res.status(404).json(createErrorResponse(
          'User not found',
          'User not found in the system'
        ));
      }

      res.status(200).json(createResponse(
        'Article removed from favorites',
        {
          articleId: id,
          title: article.title,
          removedAt: new Date().toISOString(),
        }
      ));
    } catch (error) {
      console.error('Remove favorite error:', error);
      res.status(500).json(createErrorResponse(
        'Internal server error',
        'An error occurred while removing article from favorites'
      ));
    }
  }

  /**
   * Get user's read articles
   * GET /news/read
   */
  static async getReadArticles(req, res) {
    try {
      const { page = 1, limit = 20 } = req.query;
      const pageNumber = parseInt(page);
      const limitNumber = parseInt(limit);

      const readArticles = dataStore.getUserReadArticles(req.user.userId);

      const startIndex = (pageNumber - 1) * limitNumber;
      const endIndex = startIndex + limitNumber;
      const paginatedArticles = readArticles.slice(startIndex, endIndex);

      const pagination = {
        page: pageNumber,
        limit: limitNumber,
        total: readArticles.length,
      };

      res.status(200).json(createPaginatedResponse(
        'Read articles retrieved successfully',
        { 
          articles: paginatedArticles.map(article => article.toJSON())
        },
        pagination
      ));
    } catch (error) {
      console.error('Get read articles error:', error);
      res.status(500).json(createErrorResponse(
        'Internal server error',
        'An error occurred while retrieving read articles'
      ));
    }
  }

  /**
   * Get user's favorite articles
   * GET /news/favorites
   */
  static async getFavoriteArticles(req, res) {
    try {
      const { page = 1, limit = 20 } = req.query;
      const pageNumber = parseInt(page);
      const limitNumber = parseInt(limit);

      const favoriteArticles = dataStore.getUserFavoriteArticles(req.user.userId);

      const startIndex = (pageNumber - 1) * limitNumber;
      const endIndex = startIndex + limitNumber;
      const paginatedArticles = favoriteArticles.slice(startIndex, endIndex);

      const pagination = {
        page: pageNumber,
        limit: limitNumber,
        total: favoriteArticles.length,
      };

      res.status(200).json(createPaginatedResponse(
        'Favorite articles retrieved successfully',
        { 
          articles: paginatedArticles.map(article => article.toJSON())
        },
        pagination
      ));
    } catch (error) {
      console.error('Get favorite articles error:', error);
      res.status(500).json(createErrorResponse(
        'Internal server error',
        'An error occurred while retrieving favorite articles'
      ));
    }
  }

  /**
   * Get article by ID
   * GET /news/:id
   */
  static async getArticle(req, res) {
    try {
      const { id } = req.params;
      const article = dataStore.getArticle(id);

      if (!article) {
        return res.status(404).json(createErrorResponse(
          'Article not found',
          'The requested article was not found'
        ));
      }

      const user = dataStore.getUserById(req.user.userId);
      const enrichedArticle = {
        ...article.toJSON(),
        isRead: user ? user.isArticleRead(article.id) : false,
        isFavorite: user ? user.isArticleFavorite(article.id) : false,
      };

      res.status(200).json(createResponse(
        'Article retrieved successfully',
        { article: enrichedArticle }
      ));
    } catch (error) {
      console.error('Get article error:', error);
      res.status(500).json(createErrorResponse(
        'Internal server error',
        'An error occurred while retrieving the article'
      ));
    }
  }

  /**
   * Validation rules for search keyword
   */
  static getSearchValidation() {
    return [
      param('keyword')
        .trim()
        .isLength({ min: 2, max: 100 })
        .withMessage('Keyword must be between 2 and 100 characters')
        .matches(/^[a-zA-Z0-9\s\-_]+$/)
        .withMessage('Keyword contains invalid characters'),
    ];
  }

  /**
   * Validation rules for article ID
   */
  static getArticleIdValidation() {
    return [
      param('id')
        .notEmpty()
        .withMessage('Article ID is required')
        .isLength({ min: 1, max: 50 })
        .withMessage('Invalid article ID format'),
    ];
  }

  /**
   * Validation rules for query parameters
   */
  static getQueryValidation() {
    return [
      query('page')
        .optional()
        .isInt({ min: 1 })
        .withMessage('Page must be a positive integer'),
      
      query('limit')
        .optional()
        .isInt({ min: 1, max: 100 })
        .withMessage('Limit must be between 1 and 100'),
      
      query('category')
        .optional()
        .isIn(['general', 'technology', 'business', 'health', 'science', 'sports', 'entertainment'])
        .withMessage('Invalid category'),
    ];
  }
}

module.exports = NewsController;