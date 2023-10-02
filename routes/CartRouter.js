const express = require('express');
const authMiddleware = require('../middlewares/AuthMiddleware');
const Cart = require('../models/CartModel');

const cartRouter = express.Router();

/**
 * @swagger
 * components:
 *  securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *  schemas:
 *      CartItem:
 *          type: object
 *          properties:
 *              productId:
 *                  type: string
 *                  description: Product ID
 *              quantity:
 *                  type: number
 *                  description: Quantity of the product in the cart
 *              title:
 *                  type: string
 *                  description: Product title
 *              price:
 *                  type: number
 *                  description: Product price
 *              image:
 *                  type: string
 *                  description: URL or path to the product image
 *              total:
 *                  type: number
 *                  description: Total price of the product (quantity * price)
 *      Cart:
 *          type: object
 *          properties:
 *              userId:
 *                  type: string
 *                  description: User ID
 *              items:
 *                  type: array
 *                  description: List of products in the cart
 *                  items:
 *                      $ref: '#/components/schemas/CartItem'
 *              total:
 *                  type: number
 *                  description: Total price of all products in the cart
 *  examples:
 *      CartItem:
 *          value:
 *              productId: "651857478e8398718411f929"
 *              quantity: 2
 *              title: "Smartphone X"
 *              price: 499.99
 *              image: "smartphone_x.jpg"
 *              total: 999.98
 *      Cart:
 *          value:
 *              userId: "user123"
 *              items:
 *                  - $ref: '#/components/examples/CartItem'
 *              total: 999.98
 */

/**
 * @swagger
 * tags:
 *  name: Cart
 *  description: Routes for managing the user's cart
 */

// Get Cart details of a particular user

/**
 * @swagger
 *  /cart:
 *    get:
 *      summary: Get Cart details of the authenticated user
 *      tags:
 *          - Cart
 *      security:
 *       - bearerAuth: []
 *      responses:
 *        200:
 *          description: Cart details retrieved successfully
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/Cart'
 *        500:
 *          description: Error fetching cart
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  error:
 *                    type: string
 *                    example: 'Error fetching cart'
 */

cartRouter.get('/cart', authMiddleware, async (req, res) => {
  const userId = req.user.userId;
  try {
    const cart = await Cart.findOne({ userId }).populate('items.productId');
    res.json(cart);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching cart' });
  }
});

// Add Products to the cart

/**
 * @swagger
 *  /cart/add:
 *    post:
 *      summary: Add products to the user's cart
 *      tags:
 *          - Cart
 *      security:
 *       - bearerAuth: []
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                productId:
 *                  type: string
 *                  description: Product ID
 *                  example: "651857478e8398718411f92a"
 *                quantity:
 *                  type: number
 *                  description: Quantity of the product to add to the cart
 *                  example: 1
 *                title:
 *                  type: string
 *                  description: Product title
 *                  example: "Laptop Pro"
 *                price:
 *                  type: number
 *                  description: Product price
 *                  example: 899.99
 *                image:
 *                  type: string
 *                  description: URL or path to the product image
 *                  example: "laptop_pro.jpg"
 *      responses:
 *        200:
 *          description: Product added to cart successfully
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/Cart'
 *        500:
 *          description: Error Adding Cart
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  error:
 *                    type: string
 *                    example: 'Error Adding Cart'
 */

cartRouter.post('/cart/add', authMiddleware, async (req, res) => {
  const userId = req.user.userId;
  const { productId, quantity, title, price, image } = req.body;
  try {
    let cart = await Cart.findOne({ userId });
    if (!cart) {
      cart = new Cart({ userId, items: [{ productId, quantity, title, price, image, total: quantity * price }], total: quantity * price });
    }
    const existing = cart.items.find((item) => item.productId === productId)
    if (existing) {
      existing.quantity += quantity;
      existing.total = existing.quantity * existing.price;
    } else {
      cart.items.push({ productId, quantity, title, price, image, total: quantity * price });
    }
    cart.total = cart.items.reduce((total, item) => total + item.total, 0);
    await cart.save();
    res.json(cart);
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'Error Adding to Cart' });
  }
});

// Update Product quantities in a cart

/**
 * @swagger
 *  /cart/update/{productId}:
 *    patch:
 *      summary: Update product quantity in the user's cart
 *      tags:
 *          - Cart
 *      parameters:
 *        - in: path
 *          name: productId
 *          required: true
 *          description: ID of the product to update quantity
 *          schema:
 *            type: string
 *      security:
 *       - bearerAuth: []
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                quantity:
 *                  type: number
 *                  description: New quantity of the product in the cart
 *      responses:
 *        200:
 *          description: Cart updated successfully
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/Cart'
 *        404:
 *          description: Product not found in the cart
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  error:
 *                    type: string
 *                    example: 'Item not found!'
 *        500:
 *          description: Error updating Cart Item
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  error:
 *                    type: string
 *                    example: 'Error updating Cart Item'
 */

cartRouter.patch('/cart/update/:productId', authMiddleware, async (req, res) => {
  const userId = req.user.userId;
  const productId = req.params.productId;
  const { quantity } = req.body;
  try {
    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ error: "Cart not found!" });
    }
    const cartItem = cart.items.find((item) => item.productId === productId);
    if (cartItem) {
      cartItem.quantity = quantity;
      cartItem.total = cartItem.quantity * cartItem.price;
      cart.total = cart.items.reduce((total, item) => total + item.total, 0);
      await cart.save();
      res.json(cart);
    } else {
      return res.status(404).json({ error: "Item not found!" });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error updating Cart Item' });
  }
});

// Remove Products from a cart

/**
 * @swagger
 *  /cart/remove/{productId}:
 *    delete:
 *      summary: Remove product from the user's cart
 *      tags:
 *          - Cart
 *      parameters:
 *        - in: path
 *          name: productId
 *          required: true
 *          description: ID of the product to remove from the cart
 *          schema:
 *            type: string
 *      security:
 *       - bearerAuth: []
 *      responses:
 *        200:
 *          description: Product removed from cart successfully
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/Cart'
 *        404:
 *          description: Product not found in the cart
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  error:
 *                    type: string
 *                    example: 'Item not found!'
 *        500:
 *          description: Error deleting Cart Item
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  error:
 *                    type: string
 *                    example: 'Error deleting Cart Item'
 */

cartRouter.delete('/cart/remove/:productId', authMiddleware, async (req, res) => {
  const userId = req.user.userId;
  const productId = req.params.productId;

  try {
    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ error: "Cart not found!" })
    }
    cart.items = cart.items.filter((item) => item.productId !== productId);
    cart.total = cart.items.reduce((total, item) => total + item.total, 0);
    await cart.save();
    res.json(cart);
  } catch (error) {
    res.status(500).json({ error: 'Error deleting Cart Item' });
  }
});

module.exports = cartRouter;