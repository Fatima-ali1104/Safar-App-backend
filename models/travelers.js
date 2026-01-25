const mongoose = require('mongoose');

const travelersSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  age: {
    type: Number,
    required: true
  },
  CPR: {
    type: Number,
    required: true
  }
}, { timestamps: true });
module.exports = travelersSchema;
