const express = require('express');
const Product = require('../models/ProductModel');

const productRouter = express.Router();

/**
 * @swagger
 * components:
 *  schemas:
 *      Product:
 *          type: object
 *          properties:
 *              title:
 *                  type: string
 *                  description: Product title
 *              price:
 *                  type: number
 *                  description: Product price
 *              description:
 *                  type: string
 *                  description: Product description
 *              availability:
 *                  type: boolean
 *                  description: Product availability status (true if available, false otherwise)
 *              image:
 *                  type: string
 *                  description: URL or path to the product image
 *              category:
 *                  type: string
 *                  description: Category of the product
 *  examples:
 *      ElectronicsProducts:
 *          value:
 *              title: "Smartphone X"
 *              price: 499.99
 *              description: "High-end smartphone with advanced features."
 *              availability: true
 *              image: "smartphone_x.jpg"
 *              category: "651855838e8398718411f922"
 */

/**
 * @swagger
 * tags:
 *  name: Products
 *  description: Routes for fetching Category wise Products and Product Details
 */


// Get List of Products of a particular Category

/**
 * @swagger
 *  /products/{categoryId}:
 *    get:
 *      summary: Get List of Products by Category
 *      tags:
 *          - Products
 *      parameters:
 *        - in: path
 *          name: categoryId
 *          required: true
 *          description: ID of the category to filter products
 *          schema:
 *            type: string
 *            example: "651855838e8398718411f922"
 *      responses:
 *        200:
 *          description: A list of products in the specified category
 *          content:
 *            application/json:
 *              schema:
 *                type: array
 *                items:
 *                  $ref: '#/components/schemas/Product'
 *          examples:
 *            electronics:
 *              $ref: '#/components/examples/ElectronicsProducts'
 *        404:
 *          description: No products found for the given category ID
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  error:
 *                    type: string
 *                    example: 'No products found for the given category ID'
 *        500:
 *          description: Error fetching products
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  error:
 *                    type: string
 *                    example: 'Error fetching products'
 */

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

// Get details of a particular Product

/**
 * @swagger
 *  /product/{id}:
 *    get:
 *      summary: Get Product Details by ID
 *      tags:
 *          - Products
 *      parameters:
 *        - in: path
 *          name: id
 *          required: true
 *          description: ID of the product to retrieve details
 *          schema:
 *            type: string
 *            example: "651857478e8398718411f929"
 *      responses:
 *        200:
 *          description: Product details retrieved successfully
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/Product'
 *          examples:
 *            productDetails:
 *              $ref: '#/components/examples/ProductDetails'
 *        404:
 *          description: Product not found for the given ID
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  error:
 *                    type: string
 *                    example: 'Product not found for the given ID'
 *        500:
 *          description: Error fetching product details
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  error:
 *                    type: string
 *                    example: 'Error fetching product details'
 */

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