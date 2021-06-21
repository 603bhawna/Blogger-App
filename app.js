var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session=require('express-session')
var mongoose=require('mongoose')
var bodyParser = require('body-parser');
var  multer=require('multer')
var uploads=multer({dest:'uploads/'})
var expressValidator=require('express-validator')
var hbs=require('express-handlebars')

var url = process.env.DATABASE_URL || "mongodb://localhost:27017/nodeblog21"; 
mongoose.connect(url, { useNewUrlParser: true })
    .then(() => console.log("Connection Successful"))
    .catch(err => console.log(err));
//mongoose.connect('localhost:27017/myEmployee',{useNewUrlParser: true});
let db=mongoose.connection
console.log(db)
db.once('open',function(){
    console.log('connected to mongodb')
})
db.on('error',function(err){
    console.log(err)
})


var routes = require('./routes/index');
var posts = require('./routes/posts');
var categories = require('./routes/categories');

var app = express();

app.locals.moment = require('moment');

//app.locals.truncateText = function(text, length){
//  var truncatedText = text.substring(0, length);
//  return truncatedText;
//}

app.set('views', path.join(__dirname, 'views'));
app.engine('.hbs',hbs({defaultLayout:'layout',extname:'.hbs'}))
app.set('view engine', 'hbs');

app.use(logger('dev'));
//app.use(express.json());
//app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: 'secret',
  saveUninitialized: true,
  resave: true
}));

app.use(expressValidator({
errorFormatter: function(param, msg, value) {
    var namespace = param.split('.')
    , root    = namespace.shift()
    , formParam = root;

  while(namespace.length) {
    formParam += '[' + namespace.shift() + ']';
  }
  return {
    param : formParam,
    msg   : msg,
    value : value
  };
}
}));


app.use(require('connect-flash')());
app.use(function (req, res, next) {
res.locals.messages = require('express-messages')(req, res);
next();
});

app.use('/', routes);
app.use('/posts', posts);
app.use('/categories', categories);

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
