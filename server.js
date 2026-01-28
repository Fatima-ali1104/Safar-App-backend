const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
const logger = require('morgan');

// Models
const User = require('./models/user');
const Trip = require("./models/Trip");
const Booking = require('./models/booking');
const travelersSchema = require('./models/travelers');

// Controllers
const authCtrl = require('./controllers/auth');
const tripCtrl = require('./controllers/trip');
const bookingCtrl = require('./controllers/booking');


// Middleware
const verifyToken = require('./middleware/verify-token');
const accessControl = require('./middleware/access-control');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI);
mongoose.connection.on('connected', () => {
  console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
});

// Middleware setup
app.use(cors());
app.use(express.json());
app.use(logger('dev'));

// Public Routes
app.use('/auth', authCtrl);



// Protected Routes
app.use(verifyToken);

app.use('/trips', tripCtrl);
app.use('/bookings', bookingCtrl);


app.get('/test', (req, res) => {
  console.log(req.user);
  res.status(200).json({ message: 'You are logged in!' });
});

// Start the server
app.listen(3000,()=>{
    console.log('App is running on port 3000')
})

