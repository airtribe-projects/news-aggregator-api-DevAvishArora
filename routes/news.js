const express = require('express');
const NewsController = require('../controllers/NewsController');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

/**
 * News Routes (all require authentication)
 */

/**
 * @route   GET /news
 * @desc    Get personalized news based on user preferences
 * @access  Private
 */
router.get(
  '/',
  authenticate,
  NewsController.getQueryValidation(),
  NewsController.getNews
);

/**
 * @route   GET /news/search/:keyword
 * @desc    Search news articles by keyword
 * @access  Private
 */
router.get(
  '/search/:keyword',
  authenticate,
  [
    ...NewsController.getSearchValidation(),
    ...NewsController.getQueryValidation()
  ],
  NewsController.searchNews
);

/**
 * @route   GET /news/read
 * @desc    Get user's read articles
 * @access  Private
 */
router.get(
  '/read',
  authenticate,
  NewsController.getQueryValidation(),
  NewsController.getReadArticles
);

/**
 * @route   GET /news/favorites
 * @desc    Get user's favorite articles
 * @access  Private
 */
router.get(
  '/favorites',
  authenticate,
  NewsController.getQueryValidation(),
  NewsController.getFavoriteArticles
);

/**
 * @route   GET /news/:id
 * @desc    Get a specific article by ID
 * @access  Private
 */
router.get(
  '/:id',
  authenticate,
  NewsController.getArticleIdValidation(),
  NewsController.getArticle
);

/**
 * @route   POST /news/:id/read
 * @desc    Mark an article as read
 * @access  Private
 */
router.post(
  '/:id/read',
  authenticate,
  NewsController.getArticleIdValidation(),
  NewsController.markAsRead
);

/**
 * @route   POST /news/:id/favorite
 * @desc    Mark an article as favorite
 * @access  Private
 */
router.post(
  '/:id/favorite',
  authenticate,
  NewsController.getArticleIdValidation(),
  NewsController.markAsFavorite
);

/**
 * @route   DELETE /news/:id/favorite
 * @desc    Remove an article from favorites
 * @access  Private
 */
router.delete(
  '/:id/favorite',
  authenticate,
  NewsController.getArticleIdValidation(),
  NewsController.removeFavorite
);

module.exports = router;