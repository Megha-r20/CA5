require('dotenv').config(); 

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();


app.use(cors());
app.use(express.json());


const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;


mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB Connected'))
.catch(err => console.error('MongoDB connection error:', err));


const doctorSchema = new mongoose.Schema({
    name: String,
    specialization: String
  });
  
  const patientSchema = new mongoose.Schema({
    name: String,
    ailment: String,
    age: Number,
    doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', default: null }
  });
  
  const Doctor = mongoose.model('Doctor', doctorSchema);
  const Patient = mongoose.model('Patient', patientSchema);


app.get('/api/patients', async (req, res) => {
    try {
      const patients = await Patient.find().populate('doctor');
      res.json(patients);
    } catch (error) {
      res.status(500).json({ error: 'Error fetching patients' });
    }
  });
  
  
  app.post('/api/patients', async (req, res) => {
    try {
      const { doctorId } = req.body;
      const patient = await Patient.findByIdAndUpdate(
        req.params.id,
        { doctor: doctorId },
        { new: true }
      ).populate('doctor');
  
      if (!patient) {
        return res.status(404).json({ error: 'Patient not found' });
      }
  
      res.json(patient);
    } catch (error) {
      res.status(500).json({ error: 'Error assigning doctor' });
    }
  });
  
  app.put('/api/patients/:id/docters', async (req, res) => {
    try {
      const patient = await Patient.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!patient) return res.status(404).json({ error: 'Patient not found' });
      res.json(patient);
    } catch (error) {
      res.status(500).json({ error: 'Error updating patient' });
    }
  });
  
  app.delete('/api/patients/:id', async (req, res) => {
    try {
      const patient = await Patient.findByIdAndDelete(req.params.id);
      if (!patient) return res.status(404).json({ error: 'Patient not found' });
      res.json({ message: 'Patient deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Error deleting patient' });
    }
  });
  

  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });