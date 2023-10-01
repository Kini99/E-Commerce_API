const express = require('express');
const Category = require('../models/CategoryModel');

const categoryRouter = express.Router();

categoryRouter.get('/categories', async (req, res) => {
    try {
        const categories = await Category.find();
        res.json(categories);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching categories' });
    }
});

module.exports = categoryRouter;