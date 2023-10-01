const express = require('express');
const Product = require('../models/ProductModel');

const productRouter = express.Router();

productRouter.get('/products/:categoryId', async (req, res) => {
    const categoryId = req.params.categoryId;
    try {
        const products = await Product.find({ category: categoryId });
        if (products.length === 0) {
            return res.status(404).json({ error: 'No products found for the given category ID' });
        }
        res.json(products);
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: 'Error fetching products' });
    }
});

productRouter.get('/product/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const products = await Product.find({ _id: id });
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching products' });
    }
});

module.exports = productRouter;