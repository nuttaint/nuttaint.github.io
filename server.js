const express = require('express');
const bodyParser = require('body-parser');
const { MongoClient, ServerApiVersion } = require('mongodb');

const app = express();
const PORT = 3000;

// Middleware to parse incoming JSON data
app.use(bodyParser.json());

// Replace the connection string with your MongoDB Atlas connection string
const atlasConnectionString = "mongodb+srv://vaneevan2001:tUIXBL2htACBSSV7@coding.cssu0dx.mongodb.net/?retryWrites=true&w=majority";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(atlasConnectionString, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

app.post('/api/saveDrawing', async (req, res) => {
  const { touchData } = req.body; // Use the 'touchData' property from the request body

  try {
    // Connect the client to MongoDB Atlas
    await client.connect();

    const db = client.db('ipad'); // Replace 'mydatabase' with your actual database name
    const collection = db.collection('touches'); // Replace 'touches' with your desired collection name

    // Insert the touch data into the database
    await collection.insertOne({ ...touchData });

    // Close the MongoDB connection
    await client.close();

    return res.status(200).json({ success: true, message: 'Data inserted successfully.' });
  } catch (err) {
    console.error('Failed to connect to MongoDB Atlas or insert data:', err);
    return res.status(500).json({ error: 'Failed to connect to the database or insert data.' });
  }
});
app.get('/api/getData', async (req, res) => {
  try {
    // Connect the client to MongoDB Atlas
    await client.connect();

    const db = client.db('ipad'); // Replace 'mydatabase' with your actual database name
    const collection = db.collection('touches'); // Replace 'touches' with your desired collection name

    // Fetch all data from the collection
    const data = await collection.find({}).toArray();

    // Close the MongoDB connection
    await client.close();

    return res.status(200).json({ success: true, data });
  } catch (err) {
    console.error('Failed to connect to MongoDB Atlas or fetch data:', err);
    return res.status(500).json({ error: 'Failed to connect to the database or fetch data.' });
  }
});
// Start the server and test the MongoDB Atlas connection
app.listen(PORT, async () => {
  try {
    // Connect the client to MongoDB Atlas
    await client.connect();

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });

    console.log("Server running on port", PORT);
    console.log("Pinged your deployment. You successfully connected to MongoDB Atlas!");
  } catch (err) {
    console.error('Failed to connect to MongoDB Atlas:', err);
    process.exit(1); // Exit the process if there's an error
  }
});

