const mongoose = require('mongoose');

const blacklistSchema = new mongoose.Schema({
  token: { type: String, unique: true }
});

const Blacklist = mongoose.model('BlacklistToken', blacklistSchema);

module.exports = Blacklist;