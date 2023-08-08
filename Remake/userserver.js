const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors({ origin: '*' }));
app.use(express.json());

// Connect to MongoDB Atlas
mongoose.connect(
  'mongodb+srv://vaneevan2001:tUIXBL2htACBSSV7@Coding.cssu0dx.mongodb.net/Drawing?retryWrites=true&w=majority',
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    bufferCommands: false, // Disable buffering
  }
);

// Define the schema for touch events
const userSchema = new mongoose.Schema(
  {
    username: String,
  },
  { collection: 'users' }
);

// Create a mongoose model based on the schema
const User = mongoose.model('User', userSchema, 'users');

// Endpoint to save username to the database
app.post('/api/save-username', async (req, res) => {
  const { username } = req.body; // Assuming username is received in the request body

  try {
    if (!username) {
      return res.status(400).json({ error: 'No username provided' });
    }

    const savedUser = await User.create({ username });

    return res.status(200).json({ message: 'Username saved successfully', data: savedUser });
  } catch (err) {
    console.error('Error saving username to database:', err);
    return res.status(500).json({ error: 'Failed to save username' });
  }
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
