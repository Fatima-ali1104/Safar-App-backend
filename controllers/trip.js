const express = require('express');
const router = express.Router();
const Trip = require('../models/Trip');
const {isAdmin, isTripOwner} = require("../middleware/access-control");
const verifyToken = require("../middleware/verify-token");


router.get('/', verifyToken, async (req, res) => {
    try{
        const currentUser = req.user;
        const trips = await Trip.find().sort({ createdAt: -1 });
        res.status(200).json({ trips });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to load trips' });
    }
});
router.post('/', verifyToken,isAdmin, async (req, res) => {
    try {
    const currentUser = req.user;

    // let images = [];

    // if (req.body.images) {
    //   if (Array.isArray(req.body.images)) {
    //     images = req.body.images;
    //   } else {
    //     images = [req.body.images];
    //   }
    // }
    // if (images.length === 0) {
    //   return res.status(400).json({ error: "At least one image is required" });
    // }
    const newTrip = await Trip.create({
        title: req.body.title,
        destination: req.body.destination,
        days: req.body.days,
        hotel: req.body.hotel,
        price: req.body.price,
        images: req.body.images,
        createdBy: currentUser.id
    });
    res.status(201).json({ Trip: newTrip });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to create trip' });
    }
});

//index

//show
router.get('/:id', verifyToken, async (req, res) => {
    try {
        const trip =  await Trip.findById(req.params.id);
        res.status(200).json({ trip });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to load trip' });
    }
});

//update
router.put('/:id', verifyToken, isTripOwner, async (req, res) => {
    try {
        const foundTrip = await Trip.findById(req.params.id);
        if (!foundTrip) return res.status(404).json({ message: 'Trip not found' });

        const updatedTrip =  {
                title: req.body.title,
                destination: req.body.destination,
                days: req.body.days,
                hotel: req.body.hotel,
                price: req.body.price,
                images: req.body.images
            };
            // if (req.body.images) {
            //     updatedTrip.images = Array.isArray(req.body.images) ? req.body.images : [req.body.images];}
                const updatedTripResult = await Trip.findByIdAndUpdate(req.params.id, updatedTrip, { new: true });

        res.status(200).json({ trip: updatedTripResult });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to update trip' });
    }
});

//delete
router.delete('/:id', verifyToken, isTripOwner, async (req, res) => {
    try {
        const currentUser = req.user;

        const foundTrip = await Trip.findById(req.params.id);
        if (!foundTrip){
            return res.status(404).json({ message: 'Trip not found' });
        }

        const isAdminUser = currentUser.role === 'admin';

        if(!isAdminUser) {
            return res.status(403).json({ message: 'Only admin can delete trips' });
        }
        await Trip.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Trip deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to delete trip' });
    }
});


module.exports = router;