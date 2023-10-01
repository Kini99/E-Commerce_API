const express = require('express');
const authMiddleware = require('../middlewares/AuthMiddleware');
const Cart = require('../models/CartModel');

const cartRouter = express.Router();

cartRouter.get('/cart', authMiddleware, async (req, res) => {
  const userId = req.user.userId;
  try {
    const cart = await Cart.findOne({ userId }).populate('items.productId');
    res.json(cart);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching cart' });
  }
});

cartRouter.post('/cart/add', authMiddleware, async (req, res) => {
  const userId = req.user.userId;
  const { productId, quantity, price } = req.body;
  try {
    const cart = await Cart.findOne({ userId });
    if (!cart) {
      cart = new Cart({ userId, items: [{ productId, quantity, price, total:quantity*price }], total: quantity*price});
    }
    const existing = cart.items.find((item) => item.productId === productId)
    if (existing) {
      existing.quantity += quantity;
      existing.total=existing.quantity*existing.price;
    } else {
      cart.items.push({ productId, quantity, price, total:quantity*price });
    }
    cart.total = cart.items.reduce((total, item) => total + item.total, 0);
    await cart.save();
    res.json(cart);
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'Error Adding Cart' });
  }
});

cartRouter.post('/cart/update/:productId', authMiddleware, async (req, res) => {
  const userId = req.user.userId;
  const productId = req.params.productId;
  const { quantity } = req.body;
  try {
    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ error: "Cart not found!" })
    }
    const cartItem = cart.items.find((item) => item.productId === productId);
    if (cartItem) {
      cartItem.quantity = quantity;
      cartItem.total=cartItem.quantity*cartItem.price;
      cart.total = cart.items.reduce((total, item) => total + item.total, 0);
      await cart.save();
      res.json(cart);
    } else {
      return res.status(404).json({ error: "Item not found!" })
    }
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'Error updating Cart Item' });
  }
});

cartRouter.post('/cart/remove/:productId', authMiddleware, async (req, res) => {
  const userId = req.user.userId;
  const productId = req.params.productId;

  try {
    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ error: "Cart not found!" })
    }
    cart.items = cart.items.filter((item) => !item.productId === productId);
    cart.total = cart.items.reduce((total, item) => total + item.total, 0);
    await cart.save();
    res.json(cart);
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'Error deleting Cart Item' });
  }
});

module.exports = cartRouter;