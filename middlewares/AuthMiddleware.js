const jwt = require('jsonwebtoken');
const Blacklist = require('../models/BlackListModel');
require("dotenv").config();

const authMiddleware = async (req, res, next) => {
  const authorizationHeader = req.header('Authorization');
  if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Access denied, token required' });
  }

  const token = authorizationHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'Access denied, token required' });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const blacklistedToken = await Blacklist.findOne({ token: token });
    if (blacklistedToken) {
      return res.status(401).json({ error: 'Token has been blacklisted, access denied' });
    }
    req.user = decoded;
    next();
  } catch (error) {
    console.log(error)
    res.status(401).json({ error: 'Invalid token' });
  }
};

module.exports = authMiddleware;