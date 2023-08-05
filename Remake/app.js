const express = require('express');
const mongoose = require('mongoose');

const app = express();
const port = 3000;

// Connect to MongoDB using the provided connection string
mongoose.connect('mongodb+srv://vaneevan2001:tUIXBL2htACBSSV7@coding.cssu0dx.mongodb.net/ipad?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Define a schema for the drawing data
const drawingSchema = new mongoose.Schema({
  x: [Number],
  y: [Number],
  angle: [Number],
  lineWidth: [Number],
});

// Create a model based on the schema
const Drawing = mongoose.model('Drawing', drawingSchema);

// Parse incoming JSON data
app.use(express.json());

// Endpoint to receive and save drawing data to MongoDB
app.post('/api/saveDrawing', (req, res) => {
  const { x, y, angle, lineWidth } = req.body;

  // Create a new drawing instance
  const newDrawing = new Drawing({
    x: x,
    y: y,
    angle: angle,
    lineWidth: lineWidth,
  });

  // Save the drawing data to the database
  newDrawing.save((err, savedDrawing) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to save drawing data.' });
    } else {
      res.json(savedDrawing);
    }
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
