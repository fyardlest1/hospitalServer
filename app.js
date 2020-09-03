const createError = require('http-errors');
const express = require('express');
const path = require('path');
const logger = require('morgan');
const passport = require("passport");
const config = require("./config");

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const hospitalRouter = require('./routes/hospitalRouter');
const promotionRouter = require('./routes/promotionRouter');
const partnerRouter = require('./routes/partnerRouter');
const contactRouter =  require('./routes/contactRouter');

const mongoose = require("mongoose");

// const url = "mongodb+srv://fyardlest:YoodY123789@cluster0.avbyx.mongodb.net/hospitals?retryWrites=true&w=majority";
const url = config.mongoUrl;
const connect = mongoose.connect(url, {
  useCreateIndex: true,
  useFindAndModify: false,
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

connect.then(
  () => console.log("Connected correctly to server"),
  (err) => console.log(err)
);

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(passport.initialize());

app.use("/", indexRouter);
app.use("/users", usersRouter);

app.use(express.static(path.join(__dirname, 'public')));

app.use('/hospitals', hospitalRouter);
app.use('/promotions', promotionRouter);
app.use('/partners', partnerRouter);
app.use('/contact', contactRouter);

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


// mongoose
//   .connect(
//     "mongodb+srv://fyardlest:YoodY123789@cluster0.avbyx.mongodb.net/hospitals?retryWrites=true&w=majority",
//     { useNewUrlParser: true }
//   )
//   .then(() => {
//     app.listen(5000);
//   })
//   .catch((err) => {
//     console.log(err);
//   });

module.exports = app;
