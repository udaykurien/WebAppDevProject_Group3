// Import required packages
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Define connection url, ports etc
const app = express();
const uri = 'mongodb://127.0.0.1:27017/WebDevProject';
const port = 3000;
console.log(" - using app.js")

app.set('view engine', 'ejs')

app.use(cors({
  origin: '*',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  allowedHeaders: 'Content-Type,Authorization',
}));

// Connect to MongoDB
mongoose.connect(uri)
  .then(() => {
    console.log(' - Connected to MongoDB');
  })
  .catch((err) => {
    console.error(' - Error connecting to MongoDB');
  });

// Define incident schema
const incidentSchema = new mongoose.Schema(
  {
    reporter: String,
    assignedTo: String,
    incidentType: String,
    description: String,
    severityLevel: Number,
    actionsTaken: String,
    status: String,
    createdAt: Date,
    closedAt: Date
}
);
console.log(" - Schema defined")


const Incident = mongoose.model('incident', incidentSchema);

app.use(express.json());

// Define routes
app.get('/', (req, res) => {
  console.log('Route received');
  res.render('home', { title: 'Home' });
});

app.get('/index_incident.html', (req, res) => {
  res.render('index_incident', { title: 'Incidents' });
});

app.get('/new_incident.html', (req, res) => {
  res.render('new_incident', { title: 'New Incident' });
});


app.get('/update_incident.html', (req, res) => {
  res.render('update_incident', { title: 'Update Incident' });
});

// Define methods
// Add incident
app.post('/incidents', async (req, res) => {
  try {
    // Set default values for created at and actions taken
    req.body.createdAt = new Date();
    req.body.actionsTaken = req.body.actionsTaken || "None"; // workaround
    const incident = new Incident(req.body);
    const savedIncident = await incident.save();
    res.status(201).json(savedIncident);
    console.log(" - Incident added")
  } catch (error) {
    console.error('Error posting incident:', error);
    res.status(500).json({ error: 'Database Error' });
  }
});

// Get all incidents
app.get('/incidents', async (req, res) => {
  try {      if (inputField) {
                // Set value for all fields except the incidentId
                    inputField.value = incidentDetails[key];
                    console.log(`Set value for ${key}: ${incidentDetails[key]}`);
            }
            else {
              console.log(`Element with id ${key} not found.`);
    }
    const incidents = await Incident.find();
    res.json(incidents);
  } catch (error) {
    console.error('Error getting incidents:', error);
    res.status(500).json({ error: 'Database Error' });
  }
});

// Get all incidents sorted by property (sortBY)
app.get('/incidents/all', async (req, res) => {
  try {
    // Default sorting by date
    const sortBy = req.query.sortBy || 'createdAt';
    const sortOrder = req.query.sortOrder === 'desc' ? -1 : 1;

    const sortObject = {};
    sortObject[sortBy] = sortOrder;

    const incidents = await Incident.find({})
      .sort(sortObject);

    // Debug
    // incidents.forEach((incident) => {
    //   console.log(incident);
    // });

    // Response object
    res.json(incidents);
    console.log(" - Incidents object returned in response")
  } catch (error) {
    console.error('Error getting all incidents:', error);
    res.status(500).json({ error: 'Database Error' });
  }
});

// Update incident
app.put('/incidents/:incidentId', async (req, res) => {
  try {
    // Retrieve incidentId from URL params
    const incidentId = req.params.incidentId;
    console.log(' - In update block');
    console.log('Received Incident ID:', incidentId);

    const update = req.body;
    const updatedIncident = await Incident.findByIdAndUpdate(incidentId, update, { new: true });

    if (updatedIncident) {
      res.json(updatedIncident);
      console.log("Update succeeded");
    } else {
      console.log("Update failed");
      res.status(404).json({ error: 'Incident not found' });
    }
  } catch (error) {
    console.error('Error putting incident:', error);
    res.status(500).json({ error: 'Database Error' });
  }
});


// Delete incident by id
app.delete('/incidents/:incidentId', async (req, res) => {
  try {
    const incidentId = req.params.incidentId;
    const deletedIncident = await Incident.findByIdAndDelete(incidentId);
    if (deletedIncident) {
      res.json({ message: 'Incident deleted' });
    } else {
      res.status(404).json({ error: 'Incident not found' });
    }
  } catch (error) {
    console.error('Error deleting incident:', error);
    res.status(500).json({ error: 'Database Error' });
  }
});

// Delete all incidents
app.delete('/incidents', async (req, res) => {
  try {
    const deleteResult = await Incident.deleteMany({});
    if (deleteResult.deletedCount > 0) {
      res.json({ message: 'All incidents deleted' });
    } else {
      res.status(404).json({ error: 'No incidents found to delete' });
    }
  } catch (error) {
    console.error('Error deleting incidents:', error);
    res.status(500).json({ error: 'Database Error' });
  }
});

// Find incident by id
app.get('/incidents/:incidentId', async (req, res) => {
  try {
    const incidentId = req.params.incidentId;
    const incident = await Incident.findById(incidentId);
    if (incident) {
      res.json(incident);
    } else {
      res.status(404).json({ error: 'Incident id not found' });
    }
  } catch (error) {
    console.error('Error findings incident by id:', error);
    res.status(500).json({ error: 'Database Error' });
  }
});

// Find incidents by status
app.get('/incidents/status/:status', async (req, res) => {
  try {
    const status = req.params.status;
    const incidents = await Incident.find({ status: status });
    
    if (incidents.length > 0) {
      res.json(incidents);
    } else {
      res.status(404).json({ error: 'No incidents found with the specified status' });
    }
  } catch (error) {
    console.error('Error finding incidents by status:', error);
    res.status(500).json({ error: 'Database Error' });
  }
});

// Find incidents by severity level
app.get('/incidents/severityLevel/:severityLevel', async (req, res) => {
  try {
    const severityLevel = req.params.severityLevel;
    const incidents = await Incident.find({ severityLevel: severityLevel });
    
    if (incidents.length > 0) {
      res.json(incidents);
    } else {
      res.status(404).json({ error: 'No incidents found with the specified severity level' });
    }
  } catch (error) {
    console.error('Error searching for incidents by severityLevel:', error);
    res.status(500).json({ error: 'Database Error' });
  }
});

// Search incidents using regex
app.get('/incidents/search/:searchString', async (req, res) => {
  try {
    const searchString = req.params.searchString;
    const incidents = await Incident.find({
      $or: [
        { name: { $regex: searchString, $options: 'i' } }, 
        { category: { $regex: searchString, $options: 'i' } },
      ],
    });

    if (incidents.length > 0) {
      res.json(incidents);
    } else {
      res.status(404).json({ error: 'No matching incidents found' });
    }
  } catch (error) {
    console.error('Error searching for incidents:', error);
    res.status(500).json({ error: 'Database Error' });
  }
});


const server = app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

module.exports = {server,Incident};