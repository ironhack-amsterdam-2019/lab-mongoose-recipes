require('dotenv').config();

const hbs = require('hbs');
const mongoose = require('mongoose');
const express = require('express');
const http = require('http');
const path = require('path');
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser');
const session = require('express-session')

hbs.registerHelper('ifvalue', function (conditional, options) {
  if (options.hash.value === conditional) {
    return options.fn(this)
  } else {
    return options.inverse(this);
  }
});

// Connection to the database "recipeApp"
mongoose.connect('mongodb://127.0.0.1/recipeApp', {
    useCreateIndex: true,
    useFindAndModify: false,
    useNewUrlParser: true
  })
  .then(() => {
    console.log('Connected to Mongo!');
  }).catch(err => {
    console.error('Error connecting to mongo', err);
  });

const app = express();

app.use(session({
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  //cookie: { secure: true }
}))
app.use(cookieParser());
app.use(bodyParser.urlencoded({
  extended: true
}));

function checkIfLoggedIn(req, res, next) {
  if (req.session.user) {
    res.locals.loggedIn = true;
    res.locals.username = `${req.session.user}`;
  } else {
    res.locals.loggedIn = false;
  }
  next();
};

app.use(checkIfLoggedIn);

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
hbs.registerPartials(path.join(__dirname, 'views', 'partials'));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', require('./routes/home'));

app.use('/recipes', require('./routes/recipes'));

app.use('/recipe', require('./routes/recipe'));

app.use('/cooks', require('./routes/cooks'));

app.use('/cook', require('./routes/cook'));

app.use('/users', require('./routes/login'));
app.use('/users', require('./routes/logout'));
app.use('/users', require('./routes/signup'));

// catch 404 and render a not-found.hbs template
app.use((req, res, next) => {
  res.status(404);
  res.render('not-found');
});

app.use((err, req, res, next) => {
  // always log the error
  console.error('ERROR', req.method, req.path, err);

  // only render if the error ocurred before sending the response
  if (!res.headersSent) {
    res.status(500);
    res.render('error');
  }
});

let server = http.createServer(app);

server.on('error', error => {
  if (error.syscall !== 'listen') {
    throw error
  }

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(`Port ${process.env.PORT} requires elevated privileges`);
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(`Port ${process.env.PORT} is already in use`);
      process.exit(1);
      break;
    default:
      throw error;
  }
});

server.listen(process.env.PORT, () => {
  console.log(`Listening on http://localhost:${process.env.PORT}`);
});