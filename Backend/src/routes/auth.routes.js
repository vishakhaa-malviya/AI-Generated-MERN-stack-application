const express = require('express');
const authRouter = express.Router();

const authController = require('../controllers/auth.controller.js');
const authMiddleware = require('../middlewares/auth.middleware.js');
/**
 * @route POST /api/auth/register
 * @description Register a new user
 * @access Public
 */
authRouter.post('/register', authController.registerController);

/**
 * @route POST /api/auth/login
 * @description Login a user
 * @access Public
 */
authRouter.post('/login', authController.loginController);

/**
 * @route GET /api/auth/logout
 *  @description Logout a user and add the token to blacklist
 * @access Public
 */
authRouter.get('/logout', authController.logoutController);

authRouter.get('/get-me', authMiddleware, authController.getMeController);

module.exports = authRouter;