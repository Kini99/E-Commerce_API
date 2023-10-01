const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  items: [
    {
      productId: { type: String, required: true },
      title: { type: Number, required: true },
      price: { type: Number, required: true },
      image: { type: Number, required: true },
      quantity: { type: Number, required: true },
    },
  ],
  total: { type: Number, required: true },
  date: { type: Date, required: true }
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;