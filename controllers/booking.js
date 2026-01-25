const express = require('express');
const router = express.Router();
const verifyToken = require("../middleware/verify-token");
const Booking = require('../models/booking');

// Create a new booking

router.post('/', verifyToken, async (req, res) => {
    try {
        const { trip, travelers, totalPrice } = req.body;
        if (!trip || !travelers || !totalPrice) {
            return res.status(400).json({ message: 'Trip, travelers, and totalPrice are required' });
        }
        req.body.user = req.user.id;

        const newBooking = await Booking.create(req.body);
        res.status(201).json({ Booking: newBooking });
    } catch (error) {
        console.error(error);
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: 'Invalid booking data' });
        }
        res.status(500).json({ message: 'Failed to create booking' });
    }
});

// Get bookings for the logged-in user
router.get('/', verifyToken, async (req, res) => {
    try {
        const foundBookings = await Booking.find({user: req.user.id});
        res.status(200).json({ foundBookings });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to fetch bookings' });
    }
});

// Get a specific booking by ID
router.get('/:id', verifyToken, async (req, res) => {
    try {
        const foundBooking = await Booking.findOne({
            _id: req.params.id,
            user: req.user.id
        })
        if (!foundBooking) {
            return res.status(404).json({ message: 'Booking not found' });
        }
        res.status(200).json({ foundBooking });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to fetch booking' });
    }
}); 

//edit booking
router.put('/:id', verifyToken, async (req, res) => {
    try {
        const updatedBooking = await Booking.findOneAndUpdate(
            { _id: req.params.id, user: req.user.id },
            req.body,
            {new: true}
        );
        if (!updatedBooking) {
            return res.status(404).json({ message: 'Booking not found or unauthorized' });
        }
        res.status(200).json({ updatedBooking });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to update booking' });
    }
});


// Delete a booking

router.delete('/:id', verifyToken, async (req, res) => {
    try {
        const deletedBooking = await Booking.findOneAndDelete({
            _id: req.params.id,
            user: req.user.id
        });
        if (!deletedBooking) {
            return res.status(404).json({ message: 'Booking not found or unauthorized' });
        }
        res.status(200).json({ message: 'Booking deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to delete booking' });
    }
});

module.exports = router;