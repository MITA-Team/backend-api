const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  accountId: String,
  name: String,
  email: String,
});

const User = mongoose.model('User', userSchema);

module.exports = User;
