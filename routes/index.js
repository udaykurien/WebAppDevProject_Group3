const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('home', { title: 'Home' });
  });

router.get('/home', (req, res) => {
    res.render('home', { title: 'Home' });
});

router.get("/bye", function(req, res){
    res.render("bye");
});

router.get("/resume", function(req, res){
    res.render("resume");
});

router.get("/publications", function(req, res){
    res.render("publications");
});

router.get("/skills", function(req, res){
    res.render("skills");
});

router.get("/media-coverage", function(req, res){
    res.render("media-coverage");
});

router.get("/projects", function(req, res){
    res.render("projects");
});

router.get("/contact", function(req, res){
    res.render("contact");
});

module.exports = router;  