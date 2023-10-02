const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('./models/User'); // Ensure that User model is defined in models/User.js
require('dotenv').config();
const app = express();

// Use middleware
app.use(express.json());
app.use(cors());

// Connect to MongoDB using the MONGODB_URL from your .env file
mongoose.connect(process.env.MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true });



app.post('/register', async (req, res) => {
    const { companyname, firstname, lastname, email, phone, password } = req.body;
  
    try {
      // Check if the user with the same email already exists
      const existingUser = await User.findOne({ email });
  
      if (existingUser) {
        return res.status(409).json({ message: 'User with this email already exists' });
      }
  
      // Hash the password before storing it in the database
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // Create a new user document
      const userDoc = new User({
        companyname,
        firstname,
        lastname,
        email,
        phone,
        password: hashedPassword,
      });
  
      // Save the user document to the database
      await userDoc.save();
  
      res.status(201).json({ message: 'Registered successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  });
  

  app.post('/login', async (req, res) => {
    const { email, password } = req.body;
  
    try {
      // Check if the user with the provided email exists
      const userDoc = await User.findOne({ email });
  
      if (!userDoc) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Compare the provided password with the hashed password in the database
      const isPasswordValid = await bcrypt.compare(password, userDoc.password);
  
      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Invalid password' });
      }
  
      // Create a JSON Web Token (JWT) for authentication
      const token = jwt.sign(
        { email: userDoc.email, id: userDoc._id },
        process.env.JWT_SECRET,
        { expiresIn: '1h' } // You can customize the expiration time
      );
  
      // Set the JWT as a cookie in the response
      res.cookie('token', token, { httpOnly: true });
  
      res.status(200).json({ message: 'Login successful', token });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  });

app.post('/logout', (req, res) => {
    res.cookie('token', '').json(true);
});

app.listen(4000, () => {
    console.log('Server is running at port 4000');
});
