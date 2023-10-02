const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/UserModel');
const Blacklist = require('../models/BlackListModel');
require("dotenv").config();

const userRouter = express.Router();

/**
 * @swagger
 * components:
 *  schemas:
 *      User:
 *          type: object
 *          properties: 
 *              id:
 *                  type: String
 *                  description: Auto-generated mongoDB Id
 *              username:
 *                  type: String
 *                  description: Unique username for each user
 *              password:
 *                  type: String
 *                  description: Hashed password
 */

/**
 * @swagger
 * tags:
 *  name: Users
 *  description: User Registration and Login Routes
 */

/**
 * @swagger
 * /register:
 *   post:
 *     summary: Register a new User
 *     tags: 
 *       - Users
 *     requestBody:
 *       description: User registration data
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 description: User's unique username
 *                 example: johndoe
 *               password:
 *                 type: string
 *                 description: User's password
 *                 example: Password@123
 *     responses:
 *       200:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Success message
 *                   example: User registered successfully
 *       400:
 *         description: Bad Request, invalid username or password format
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   description: Error message
 *                   example: Invalid password format!
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message
 *                   example: Error registering user
 */

userRouter.post('/register', async (req, res) => {
    const { username, password } = req.body;

    const existingUser = await User.findOne({ username });
    if (existingUser) {
        return res.status(400).json({ msg: 'Username already exists!' });
    }

    const passwordReq =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
    if (!passwordReq.test(password)) {
        return res.status(200).json({
            msg: "Invalid password format! Password should contain atleast one uppercase character, one number, one special character and length greater than 6 characters.",
        });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, password: hashedPassword });
    try {
        await user.save();
        res.json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error registering user' });
    }
});

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Login for existing User
 *     tags: 
 *       - Users
 *     requestBody:
 *       description: User login data
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 description: User's unique username
 *                 example: Test1
 *               password:
 *                 type: string
 *                 description: User's password
 *                 example: Test@1
 *     responses:
 *       200:
 *         description: User logged in successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: JWT token for authentication
 *       401:
 *         description: Unauthorized, invalid username or password
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message
 *                   example: Invalid password
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message
 *                   example: User not found
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message
 *                   example: Error logging in user
 */

userRouter.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) {
        return res.status(404).json({ error: 'User not found' });
    }
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
        return res.status(401).json({ error: 'Invalid password' });
    }
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '3h' });

    res.json({ token });
});

/**
 * @swagger
 * /logout:
 *   post:
 *     summary: Logout for User
 *     tags: 
 *       - Users
 *     requestBody:
 *       description: JWT token for authentication
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               token:
 *                 type: string
 *                 description: JWT token obtained during login
 *                 example: Enter valid token
 *     responses:
 *       200:
 *         description: User logged out successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Success message
 *                   example: Logout successful
 *       401:
 *         description: Unauthorized, invalid or expired token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message
 *                   example: Invalid token
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message
 *                   example: Error logging out user
 */

userRouter.post('/logout', async (req, res) => {
    const { token } = req.body;

    const existing = Blacklist.find({ token });
    if (existing) {
        return res.json({ message: 'Logout successful' });
    }
    const blacklistToken = new Blacklist({ token });
    await blacklistToken.save();

    res.json({ message: 'Logout successful' });
});


module.exports = userRouter;