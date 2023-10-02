const express = require('express');
const authMiddleware = require('../middlewares/AuthMiddleware');
const Order = require('../models/OrderModel');
const Cart = require('../models/CartModel');

const orderRouter = express.Router();

/**
 * @swagger
 * components:
 *  securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *  schemas:
 *      OrderItem:
 *          type: object
 *          properties:
 *              productId:
 *                  type: string
 *                  description: Product ID
 *              title:
 *                  type: string
 *                  description: Product title
 *              price:
 *                  type: number
 *                  description: Product price
 *              image:
 *                  type: string
 *                  description: URL or path to the product image
 *              quantity:
 *                  type: number
 *                  description: Quantity of the product in the order
 *      Order:
 *          type: object
 *          properties:
 *              userId:
 *                  type: string
 *                  description: User ID
 *              items:
 *                  type: array
 *                  description: List of products in the order
 *                  items:
 *                      $ref: '#/components/schemas/OrderItem'
 *              total:
 *                  type: number
 *                  description: Total price of all products in the order
 *              date:
 *                  type: string
 *                  format: date-time
 *                  description: Date and time when the order was placed
 *              status:
 *                  type: string
 *                  description: Order status (e.g., Active, Shipped, Delivered)
 *  examples:
 *      OrderItem:
 *          value:
 *              productId: "651857478e8398718411f929"
 *              title: "Smartphone X"
 *              price: 499.99
 *              image: "smartphone_x.jpg"
 *              quantity: 2
 *      Order:
 *          value:
 *              userId: "user123"
 *              items:
 *                  - $ref: '#/components/examples/OrderItem'
 *              total: 999.98
 *              date: "2023-09-30T10:00:00Z"
 *              status: "Active"
 */

/**
 * @swagger
 * tags:
 *  name: Orders
 *  description: Routes for managing user orders
 */

// Place new Order

/**
 * @swagger
 *  /order/{cartId}:
 *    post:
 *      summary: Place a new order based on the user's cart
 *      tags:
 *          - Orders
 *      parameters:
 *        - in: path
 *          name: cartId
 *          required: true
 *          description: ID of the cart to create the order from
 *          schema:
 *            type: string
 *      security:
 *       - bearerAuth: []
 *      responses:
 *        201:
 *          description: Order placed successfully
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/Order'
 *        404:
 *          description: Cart not found
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  error:
 *                    type: string
 *                    example: 'Cart not found!'
 *        500:
 *          description: Error placing Order
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  error:
 *                    type: string
 *                    example: 'Error placing Order'
 */

orderRouter.post('/order/:cartId', authMiddleware, async (req, res) => {
    const userId = req.user.userId;
    const { cartId } = req.params;
    try {
        const cart = await Cart.findOne({ _id: cartId });
        if (!cart) {
            return res.status(404).json({ error: "Cart not found!" })
        }
        const order = new Order({ userId, items: cart.items, total: cart.total, date: Date.now(), status: "Active" });
        await order.save();
        await Cart.deleteOne({ _id: cartId });
        res.status(201).json(order);
    } catch (error) {
        res.status(500).json({ error: 'Error placing Order', msg : error.message });
    }
});

// Get Order History

/**
 * @swagger
 *  /orders:
 *    get:
 *      summary: Get order history of the authenticated user
 *      tags:
 *          - Orders
 *      security:
 *       - bearerAuth: []
 *      responses:
 *        200:
 *          description: Order history retrieved successfully
 *          content:
 *            application/json:
 *              schema:
 *                type: array
 *                items:
 *                  $ref: '#/components/schemas/Order'
 *        404:
 *          description: No Orders Yet!
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  error:
 *                    type: string
 *                    example: 'No Orders Yet!'
 *        500:
 *          description: Error finding Orders
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  error:
 *                    type: string
 *                    example: 'Error finding Orders'
 */

orderRouter.get('/orders', authMiddleware, async (req, res) => {
    const userId = req.user.userId;
    try {
        const orders = await Order.find({ userId });
        if (!orders) {
            return res.status(404).json({ error: "No Orders Yet!" })
        }
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ error: 'Error finding Orders' });
    }
});


// Get particular Order Details

/**
 * @swagger
 *  /order/{orderId}:
 *    get:
 *      summary: Get details of a specific order
 *      tags:
 *          - Orders
 *      parameters:
 *        - in: path
 *          name: orderId
 *          required: true
 *          description: ID of the order to retrieve details
 *          schema:
 *            type: string
 *      security:
 *       - bearerAuth: []
 *      responses:
 *        200:
 *          description: Order details retrieved successfully
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/Order'
 *        404:
 *          description: Order not found
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  error:
 *                    type: string
 *                    example: 'Order not found!'
 *        500:
 *          description: Error finding Order
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  error:
 *                    type: string
 *                    example: 'Error finding Order'
 */

orderRouter.get('/order/:orderId', authMiddleware, async (req, res) => {
    const { orderId } = req.params;
    try {
        const order = await Order.find({ _id: orderId });
        if (!order) {
            return res.status(404).json({ error: "Order not found!" })
        }
        res.status(200).json(order);
    } catch (error) {
        res.status(500).json({ error: 'Error finding Order' });
    }
});

module.exports = orderRouter;