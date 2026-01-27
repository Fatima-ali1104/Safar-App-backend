const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/user');

router.post('/signup', async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const userInDb = await User.findOne({ username });
        if (userInDb) {
            return res.status(409).json({ message: 'Username already exists' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({ username, email, password: hashedPassword });
        
        const payload = {
        username: newUser.username,
        role: newUser.role,
        _id: newUser._id,
        };

        const token = jwt.sign(payload , process.env.JWT_SECRET);

        res.status(201).json({ token, user: payload });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to create user' });
    }
});

router.post('/signin', async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json({ message: 'Username and password are required' });
        }
        const userInDb = await User.findOne({ username });
        if (!userInDb) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }
        const isMatch = await bcrypt.compare(password, userInDb.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        const payload ={
            id: userInDb._id,
            username: userInDb.username,
            role: userInDb.role,
        };
        const token = jwt.sign(payload, process.env.JWT_SECRET)
         res.status(200).json({ message: 'Login successful', token, user:payload });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to login' });
    }
});

module.exports = router;