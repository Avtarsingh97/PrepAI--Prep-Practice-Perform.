const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: [true, 'Username already exists'],
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: [true, 'Email already exists'],
    match: [/\S+@\S+\.\S+/, 'Please use a valid email address']
  },
  password: {
    type: String,
    required: false
  },
  auth0Id: {
    type: String,
    unique: true,
    sparse: true
  }
});

const userModel = mongoose.model('User', userSchema);

module.exports = userModel;