const express = require('express');
const authMiddleware = require('../middlewares/AuthMiddleware');

const orderRouter = express.Router();

orderRouter.use(authMiddleware);


module.exports = orderRouter;