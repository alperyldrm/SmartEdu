const express = require('express');
const pageRoute = require('./routers/pageRoute');

const app = express();

//TEMPLATE ENGINE
app.set('view engine', 'ejs');

//MIDDLEWARE FUNCTIONS
app.use(express.static('public'));

//ROUTER
app.use('/', pageRoute);

const port = 3000;
app.listen(port, () => {
  console.log(`App started on port: ${port}`);
});
