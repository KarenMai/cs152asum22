require('dotenv').config()
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const layouts = require("express-ejs-layouts");
const axios = require('axios');
const auth = require('./routes/auth');
const session = require("express-session"); 
const MongoDBStore = require('connect-mongodb-session')(session);

// *********************************************************** //
//  Loading JSON datasets
// *********************************************************** //
const courses = require('./public/data/courses20-21.json')

// *********************************************************** //
//  Loading models
// *********************************************************** //
const Course = require('./models/Course')
const InterestCharity = require('./models/InterestCharity')

// *********************************************************** //
//  Connecting to the database
// *********************************************************** //

const mongoose = require( 'mongoose' );
const mongodb_URI = 'mongodb+srv://summer:'+process.env.MONGO +'@cluster0.czfkc.mongodb.net/test'

mongoose.connect( mongodb_URI, { useNewUrlParser: true, useUnifiedTopology: true } );
// fix deprecation warnings
//mongoose.set('useFindAndModify', false); 
//mongoose.set('useCreateIndex', true);

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {console.log("we are connected!!!")});

// middleware to test is the user is logged in, and if not, send them to the login page
const isLoggedIn = (req,res,next) => {
  if (res.locals.loggedIn) {
    next()
  }
  else res.redirect('/login')
}

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

var store = new MongoDBStore({
  uri: mongodb_URI,
  collection: 'mySessions'
});

// Catch errors
store.on('error', function(error) {
  console.log(error);
});

app.use(require('express-session')({
  secret: 'This is a secret 7f89a789789as789f73j2krklfdslu89fdsjklfds',
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 7 // 1 week
  },
  store: store,
  // Boilerplate options, see:
  // * https://www.npmjs.com/package/express-session#resave
  // * https://www.npmjs.com/package/express-session#saveuninitialized
  resave: true,
  saveUninitialized: true
}));


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(layouts)
app.use(auth)
app.use('/', indexRouter);
app.use('/users', usersRouter);


app.get('/charities',(req,res,next) => {
  res.render('charities')
})

app.post('/charities',
  async (req,res,next) => {
    const state = req.body.state;
    const url= 'https://api.data.charitynavigator.org/v2/Organizations?app_id=d5c6fc87&app_key=' + process.env.CHARITY_API_KEY + '&state=' + state
    try { 
      const response = await axios.get(url)
      console.dir(response.data)
      res.locals.state = state
      res.locals.charities = response.data || []
      res.render('showCharities')
    }
    catch { 
      res.render('noCharityFound')
    }
  })

app.get('/charitiesRecord',
  isLoggedIn,   // redirect to /login if user is not logged in
  async (req,res,next) => {
    try{
      let userId = res.locals.user._id;  // get the user's id
      let charities = await InterestCharity.find({userId:userId}); // lookup the user's todo items
      res.locals.charities = charities;  //make the items available in the view
      res.render("charitiesRecord");  // render to the toDo page
    } catch (e){
      next(e);
    }
  }
  )

app.post('/charitiesRecord/add',
  isLoggedIn,
  async (req,res,next) => {
    try{
      console.log(req.body)
      const {name, type} = req.body; // get title and description from the body
      const userId = res.locals.user._id; // get the user's id
      let data = {name, type, userId,} // create the data object
      let item = new InterestCharity(data) // create the database object (and test the types are correct)
      await item.save() // save the todo item in the database
      res.redirect('/charitiesRecord')  // go back to the todo page
    } catch (e){
      next(e);
    }
  }
  )


app.get("/charitiesRecord/delete/:itemId",
  isLoggedIn,
  async (req,res,next) => {
    try{
      const itemId=req.params.itemId; // get the id of the item to delete
      await InterestCharity.deleteOne({_id:itemId}) // remove that item from the database
      res.redirect('/charitiesRecord') // go back to the todo page
    } catch (e){
      next(e);
    }
  }
)

app.get("/charitiesRecord/completed/:value/:itemId",
  isLoggedIn,
  async (req,res,next) => {
    try{
      const itemId=req.params.itemId; // get the id of the item to delete
      const interested = req.params.value=='true';
      await InterestCharity.findByIdAndUpdate(itemId,{interested}) // remove that item from the database
      res.redirect('/charitiesRecord') // go back to the todo page
    } catch (e){
      next(e);
    }
  }
)

app.get('/uploadDB',
  async (req,res,next) => {
    await Course.deleteMany({});
    await Course.insertMany(courses);

    const num = await Course.find({}).count();
    res.send("data uploaded: "+num)
  }
)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
