const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');
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

//GLOBAL VARIABLES
global.userID = null;

//MIDDLEWARE FUNCTIONS
app.use(express.static('public'));
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(
  session({
    secret: 'my_keyboard_cat',
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({ mongoUrl: 'mongodb://localhost/smartEdu-db' }),
  })
);

//ROUTER
app.use('*', (req, res, next) => {
  userID = req.session.userID;
  next();
});
app.use('/', pageRoute);
app.use('/courses', courseRoute);
app.use('/categories', categoryRoute);
app.use('/users', userRoute);

const port = 3000;
app.listen(port, () => {
  console.log(`App started on port: ${port}`);
});
