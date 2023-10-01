const express = require('express');
const authMiddleware = require('../middlewares/AuthMiddleware');
const Order = require('../models/OrderModel');
const Cart = require('../models/CartModel');

const orderRouter = express.Router();

orderRouter.post('/order/:cartId', authMiddleware, async (req, res) => {
    const userId = req.user.userId;
    const { cartId } = req.params;
    try {
        const cart = await Cart.findOne({ _id: cartId });
        if (!cart) {
            return res.status(404).json({ error: "Cart not found!" })
        }
        const order = new Order({ userId, items: cart.items, total: cart.total, date: Date.now() });
        await order.save();
        await Cart.deleteOne({ _id: cartId });
        res.json(order);
    } catch (error) {
        res.status(500).json({ error: 'Error placing Order' });
    }
});

orderRouter.get('/orders', authMiddleware, async (req, res) => {
    const userId = req.user.userId;
    try {
        const orders = await Order.find({ userId });
        if (!orders) {
            return res.status(404).json({ error: "No Orders Yet!" })
        }
        res.json(orders);
    } catch (error) {
        res.status(500).json({ error: 'Error finding Orders' });
    }
});

orderRouter.get('/order/:orderId', authMiddleware, async (req, res) => {
    const { orderId } = req.params;
    try {
        const order = await Order.find({ _id: orderId });
        if (!order) {
            return res.status(404).json({ error: "Order not found!" })
        }
        res.json(order);
    } catch (error) {
        res.status(500).json({ error: 'Error finding Order' });
    }
});

module.exports = orderRouter;