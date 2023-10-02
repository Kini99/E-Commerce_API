const express = require('express');
const Category = require('../models/CategoryModel');

const categoryRouter = express.Router();

/**
 * @swagger
 * components:
 *  schemas:
 *      Category:
 *          type: object
 *          properties:
 *          name:
 *              type: string
 *              description: Category name
 */

/**
 * @swagger
 * tags:
 *  name: Categories
 *  description: Route for fetching list of Categories
 */

// Get List of Categories

/**
 * @swagger
 *  /categories:
 *    get:
 *      summary: Get List of Categories
 *      tags:
 *          - Categories
 *      responses:
 *        200:
 *          description: A list of categories
 *          content:
 *            application/json:
 *              schema:
 *                type: array
 *                items:
 *                  $ref: '#/components/schemas/Category'
 *          examples:
 *            categories:
 *              - name: "Electronics"
 *              - name: "Clothing"
 *        500:
 *          description: Error fetching categories
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  error:
 *                    type: string
 *                    example: 'Error fetching categories'
 */

categoryRouter.get('/categories', async (req, res) => {
    try {
        const categories = await Category.find();
        res.json(categories);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching categories' });
    }
});

module.exports = categoryRouter;