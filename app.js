// Import required packages
const express = require('express');
const mongoose = require('mongoose');

// Define connection url, ports etc
const app = express();
const uri = 'mongodb://127.0.0.1:27017/WebDevProject';
const port = 3000;

// Connect to MongoDB
mongoose.connect(uri)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB');
  });

// Define incident schema
  const incidentSchema = new mongoose.Schema({
  reporter: String,
  assignedTo: String,
  incidentType: String,
  description: String,
  severityLevel: Number,
  actionsTaken: {
    type: String,
    default: "None"
  },
  status: String,
  createdAt: {
    type: Date,
    default: Date.now
  },
  closedAt: Date
});

const Incident = mongoose.model('incident', incidentSchema);

app.use(express.json());

// Add incident
app.post('/incidents', async (req, res) => {
  try {
    // Set default values for created at and actions taken
    req.body.createdAt = new Date();
    req.body.actionsTaken = req.body.actionsTaken || "None"; // workaround
    const incident = new Incident(req.body);
    const savedIncident = await incident.save();
    res.status(201).json(savedIncident);
  } catch (error) {
    console.error('Error posting incident:', error);
    res.status(500).json({ error: 'Database Error' });
  }
});

// Get all incidents
app.get('/incidents', async (req, res) => {
  try {
    const incidents = await Incident.find();
    res.json(incidents);
  } catch (error) {
    console.error('Error getting incidents:', error);
    res.status(500).json({ error: 'Database Error' });
  }
});

// Update incident
app.put('/incidents/:incidentId', async (req, res) => {
  try {
    const incidentId = req.params.incidentId;
    const update = req.body;
    const updatedIncident = await Incident.findByIdAndUpdate(incidentId, update, { new: true });
    if (updatedIncident) {
      res.json(updatedIncident);
    } else {
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
    console.error('Error finding incident by id:', error);
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
    console.error('Error searching for incidents by status:', error);
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

app.get('/', (req, res) => {
  console.log('Route received');
  res.json({"message":"Welcome to Dresstore application."});
});


const server = app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

module.exports = {server,Incident};