const express = require('express');
const cors = require('cors');


const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const leadRoutes = require('./routes/leadRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');


const app = express();

// connect data base
connectDB();


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));


app.use('/api/auth', authRoutes);
app.use('/api/leads', leadRoutes); // This now includes campaign routes too
app.use('/api/dashboard', dashboardRoutes);



// A simple root route
app.get('/', (req, res) => {
    res.json('Lead Analytics API Running');
});



module.exports = app;