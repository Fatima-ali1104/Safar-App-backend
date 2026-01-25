const mongoose = require('mongoose');
const traverlersSchema = require('./travelers')
const bookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  trip: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Trip',
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled'],
    default: 'pending'
  },
  travelers: {
    type: [traverlersSchema],
    required: true
  },
  totalPrice: {
    type: Number,
    required: true
  }
}, { timestamps: true });
const Booking = mongoose.model('Booking', bookingSchema);
module.exports = Booking;