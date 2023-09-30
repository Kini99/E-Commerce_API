const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/UserModel');
const Blacklist = require('../models/BlackListModel');
require("dotenv").config();

const userRouter = express.Router();

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
    const accessToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    const refreshToken = jwt.sign({ userId: user._id }, process.env.REFRESH_TOKEN_SECRET);

    res.json({ accessToken, refreshToken });
});

userRouter.post('/logout', async (req, res) => {
    const { token } = req.body;

    const blacklistToken = new Blacklist({ token });
    await blacklistToken.save();

    res.json({ message: 'Logout successful' });
});

userRouter.post('/refresh', async (req, res) => {
    const { refreshToken } = req.body;

    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, async (err, user) => {
        if (err) {
            return res.status(401).json({ error: 'Invalid refresh token' });
        }

        const accessToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

        res.json({ accessToken });
    });
});

module.exports = userRouter;