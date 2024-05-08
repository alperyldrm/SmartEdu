const express = require('express');
const mongoose = require('mongoose');
const pageRoute = require('./routers/pageRoute');
const courseRoute = require('./routers/courseRoute');

const app = express();

//CONNECT DB
mongoose.connect('mongodb://localhost/smartEdu-db').then(() => {
  console.log('DB connected successfully');
});

//TEMPLATE ENGINE
app.set('view engine', 'ejs');

//MIDDLEWARE FUNCTIONS
app.use(express.static('public'));

//ROUTER
app.use('/', pageRoute);
app.use('/courses', courseRoute);

const port = 3000;
app.listen(port, () => {
  console.log(`App started on port: ${port}`);
});
