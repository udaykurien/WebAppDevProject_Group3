const express = require('express');
const router = express.Router();


  // Define routes
  router.get('/', (req, res) => {
    console.log('Route received');
    res.render('landing_page', { title: 'Landing Page' });
  });
  
  router.get('/login.html', (req, res) => {
    res.render('login', { title: 'Login' });
  });
  
  router.get('/register.html', (req, res) => {
    res.render('register', { title: 'register' });
  });
  
  router.get('/landing_page.html', (req, res) => {
    res.render('landing_page', { title: 'Landing Page' });
  });
  
  router.get('/index_incident.html', (req, res) => {
    res.render('index_incident', { title: 'Incidents' });
  });
  
  router.get('/new_incident.html', (req, res) => {
    res.render('new_incident', { title: 'New Incident' });
  });
  
  
  router.get('/update_incident.html', (req, res) => {
    res.render('update_incident', { title: 'Update Incident' });
  });
  
  router.get('/login.html', (req, res) => {
    res.render('login', { title: 'Login' });
  });
  
  router.get('/register.html', (req, res) => {
    res.render('register', { title: 'Register' });
  });

module.exports = router;  