const express = require('express');
const app = express();
const port = 3000;

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
  console.log('Route received');
  res.render('home', { title: 'Home' });
});

const server = app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
