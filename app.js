const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const pageRoute = require('./routers/pageRoute');
const courseRoute = require('./routers/courseRoute');
const categoryRoute = require('./routers/categoryRoute');
const userRoute = require('./routers/userRoute');

const app = express();

//CONNECT DB
mongoose.connect('mongodb://localhost/smartEdu-db').then(() => {
  console.log('DB connected successfully');
});

//TEMPLATE ENGINE
app.set('view engine', 'ejs');

//MIDDLEWARE FUNCTIONS
app.use(express.static('public'));
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

//ROUTER
app.use('/', pageRoute);
app.use('/courses', courseRoute);
app.use('/categories', categoryRoute);
app.use('/users', userRoute);

const port = 3000;
app.listen(port, () => {
  console.log(`App started on port: ${port}`);
});
