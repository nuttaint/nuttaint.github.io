const express = require('express');
const bodyParser = require('body-parser');
const { MongoClient } = require('mongodb');

const app = express();
const PORT = 3000;

// Middleware to parse incoming JSON data
app.use(bodyParser.json());

// Define the route for data insertion
app.post('/api/saveDrawing', (req, res) => {
  const touchData = req.body; // Assuming the touch data is sent in the request body

  // Replace the connection string with your MongoDB Atlas connection string
  const atlasConnectionString = 'mongodb+srv://vaneevan2001:tUIXBL2htACBSSV7@Coding/<database-name>ipad?retryWrites=true&w=majority';

  // Connect to MongoDB Atlas
  MongoClient.connect(atlasConnectionString, (err, client) => {
    if (err) {
      console.error('Failed to connect to MongoDB Atlas:', err);
      return res.status(500).json({ error: 'Failed to connect to the database.' });
    }

    const db = client.db('ipad'); // Replace 'mydatabase' with your actual database name
    const collection = db.collection('touches'); // Replace 'touches' with your desired collection name

    // Insert the touch data into the database
    collection.insertOne(touchData, (err, result) => {
      if (err) {
        console.error('Failed to insert data into MongoDB:', err);
        return res.status(500).json({ error: 'Failed to insert data into the database.' });
      }

      client.close(); // Close the MongoDB connection
      return res.status(200).json({ success: true, message: 'Data inserted successfully.' });
    });
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
