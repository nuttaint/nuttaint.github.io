const express = require('express');
const cors = require('cors'); // Import the cors package
const mongoose = require('mongoose');
const app = express();
const port = 3000;

mongoose.connect('mongodb+srv://vaneevan2001:tUIXBL2htACBSSV7@Coding.cssu0dx.mongodb.net/DrawPencil?retryWrites=true&w=majority',
{
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const touchevSchema = new mongoose.Schema(
  {
  x: Number,
    y: Number,
    lineWidth: Number,
    rotationAngle: Number,
    altitudeAngle: Number,
    azimuthAngle: Number,
    currentPageName: String,
    lineCount: Number,
    timestamp: String,
    user: String,
    distance:  Number,
    force: Number, // Add the force property
    timeCounter: Number,},
    { collection: 'information' }
);

const TouchEvent = mongoose.model('TouchEvent', touchevSchema, 'information');

app.use(cors()); // Use cors middleware to enable CORS

app.get('/users', async (req, res) => {
  try {
    const users = await TouchEvent.distinct('user');
    console.log('Fetched users:', users); // Log the fetched users
    res.json(users);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/pages', async (req, res) => {
  try {
    const currentPageNames = await TouchEvent.distinct('currentPageName');
    console.log('Fetched currentPageNames:', currentPageNames); // Log the fetched currentPageNames
    res.json(currentPageNames);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
app.get('/scatterdata', async (req, res) => {
  const { user } = req.query;
  
  // Mapping between user-friendly page names and actual page names
  const pageNameMap = {
    'left_to_right': 'ipad_pro_11____3.html',
    'right_to_left': 'ipad_pro_11____4.html',
    'top_to_bottom': 'ipad_pro_11____7.html',
    'bottom_to_top': 'ipad_pro_11____8.html',
    'lefttop_to_bottomright': 'ipad_pro_11____11.html',
    'rightbottom_to_lefttop': 'ipad_pro_11____12.html',
    'curve': 'ipad_pro_11____15.html'
  };

  try {
    const scatterData = await TouchEvent.find({ user }).select('force timeCounter distance x y currentPageName'); // Modify the select statement
    console.log(`Fetched data for user: ${user}`);
  
    const pageData = {
      'ipad_pro_11____3.html': { force: [], timeCounter: [], distance: [], x: [], y: [] },
      'ipad_pro_11____4.html': { force: [], timeCounter: [], distance: [], x: [], y: [] },
      'ipad_pro_11____7.html': { force: [], timeCounter: [], distance: [], x: [], y: [] },
      'ipad_pro_11____8.html': { force: [], timeCounter: [], distance: [], x: [], y: [] },
      'ipad_pro_11____11.html': { force: [], timeCounter: [], distance: [], x: [], y: [] },
      'ipad_pro_11____12.html': { force: [], timeCounter: [], distance: [], x: [], y: [] },
      'ipad_pro_11____15.html': { force: [], timeCounter: [], distance: [], x: [], y: [] }
    };
  
    scatterData.forEach(entry => {
      const actualPage = pageNameMap[entry.currentPageName] || entry.currentPageName;
      pageData[actualPage].force.push(entry.force);
      pageData[actualPage].timeCounter.push(entry.timeCounter);
      pageData[actualPage].distance.push(entry.distance);
      pageData[actualPage].x.push(entry.x); // Add x data to the corresponding page
      pageData[actualPage].y.push(entry.y); // Add y data to the corresponding page
    });
  
    console.log('Page data:', pageData); // Log the populated page data
  
    res.json(pageData);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
