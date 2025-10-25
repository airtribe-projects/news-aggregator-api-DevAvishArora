const { body, validationResult } = require('express-validator');
const dataStore = require('../models/DataStore');
const { createResponse, createErrorResponse } = require('../utils/responseHelper');
const config = require('../config/config');

/**
 * User Preferences Controller
 * Handles user news preferences management
 */
class UserController {
  /**
   * Get user preferences
   * GET /users/preferences
   */
  static async getPreferences(req, res) {
    try {
      const user = dataStore.getUserById(req.user.userId);
      
      if (!user) {
        return res.status(404).json(createErrorResponse(
          'User not found',
          'User not found in the system'
        ));
      }

      res.status(200).json(createResponse(
        'Preferences retrieved successfully',
        {
          preferences: user.preferences,
          availableCategories: config.defaultPreferences.categories,
          availableLanguages: config.defaultPreferences.languages,
        }
      ));
    } catch (error) {
      console.error('Get preferences error:', error);
      res.status(500).json(createErrorResponse(
        'Internal server error',
        'An error occurred while retrieving preferences'
      ));
    }
  }

  /**
   * Update user preferences
   * PUT /users/preferences
   */
  static async updatePreferences(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json(createErrorResponse(
          'Validation failed',
          errors.array()
        ));
      }

      const { preferences } = req.body;
      const user = dataStore.getUserById(req.user.userId);
      
      if (!user) {
        return res.status(404).json(createErrorResponse(
          'User not found',
          'User not found in the system'
        ));
      }

      const invalidPreferences = preferences.filter(
        pref => !config.defaultPreferences.categories.includes(pref)
      );

      if (invalidPreferences.length > 0) {
        return res.status(400).json(createErrorResponse(
          'Invalid preferences',
          {
            invalidPreferences,
            availableCategories: config.defaultPreferences.categories,
          }
        ));
      }

      user.updatePreferences(preferences);

      res.status(200).json(createResponse(
        'Preferences updated successfully',
        {
          preferences: user.preferences,
          updatedAt: user.updatedAt,
        }
      ));
    } catch (error) {
      console.error('Update preferences error:', error);
      res.status(500).json(createErrorResponse(
        'Internal server error',
        'An error occurred while updating preferences'
      ));
    }
  }

  /**
   * Get user profile with statistics
   * GET /users/profile
   */
  static async getProfile(req, res) {
    try {
      const user = dataStore.getUserById(req.user.userId);
      
      if (!user) {
        return res.status(404).json(createErrorResponse(
          'User not found',
          'User not found in the system'
        ));
      }

      const readArticles = dataStore.getUserReadArticles(req.user.userId);
      const favoriteArticles = dataStore.getUserFavoriteArticles(req.user.userId);

      const profile = {
        ...user.toJSON(),
        statistics: {
          readArticles: readArticles.length,
          favoriteArticles: favoriteArticles.length,
          preferencesCount: user.preferences.length,
        },
      };

      res.status(200).json(createResponse(
        'Profile retrieved successfully',
        { user: profile }
      ));
    } catch (error) {
      console.error('Get profile error:', error);
      res.status(500).json(createErrorResponse(
        'Internal server error',
        'An error occurred while retrieving profile'
      ));
    }
  }

  /**
   * Get user's read articles
   * GET /users/read-articles
   */
  static async getReadArticles(req, res) {
    try {
      const readArticles = dataStore.getUserReadArticles(req.user.userId);

      res.status(200).json(createResponse(
        'Read articles retrieved successfully',
        { articles: readArticles.map(article => article.toJSON()) }
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
   * GET /users/favorite-articles
   */
  static async getFavoriteArticles(req, res) {
    try {
      const favoriteArticles = dataStore.getUserFavoriteArticles(req.user.userId);

      res.status(200).json(createResponse(
        'Favorite articles retrieved successfully',
        { articles: favoriteArticles.map(article => article.toJSON()) }
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
   * Delete user account (bonus feature)
   * DELETE /users/account
   */
  static async deleteAccount(req, res) {
    try {
      const user = dataStore.getUserById(req.user.userId);
      
      if (!user) {
        return res.status(404).json(createErrorResponse(
          'User not found',
          'User not found in the system'
        ));
      }

    
      user.deletedAt = new Date();

      res.status(200).json(createResponse(
        'Account deletion requested',
        'Your account will be deleted within 24 hours'
      ));
    } catch (error) {
      console.error('Delete account error:', error);
      res.status(500).json(createErrorResponse(
        'Internal server error',
        'An error occurred while processing account deletion'
      ));
    }
  }

  /**
   * Validation rules for updating preferences
   */
  static getPreferencesValidation() {
    return [
      body('preferences')
        .isArray({ min: 0, max: 10 })
        .withMessage('Preferences must be an array with maximum 10 items')
        .custom((preferences) => {
          const uniquePrefs = new Set(preferences);
          if (uniquePrefs.size !== preferences.length) {
            throw new Error('Duplicate preferences are not allowed');
          }
          
          const allStrings = preferences.every(pref => typeof pref === 'string');
          if (!allStrings) {
            throw new Error('All preferences must be strings');
          }
          
          return true;
        }),
    ];
  }
}

module.exports = UserController;