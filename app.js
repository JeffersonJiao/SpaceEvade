var express = require('express');
var bodyParser = require('body-parser');
var game = require('./components/game'); 
var path = require('path');
var http = require('http');
var app = express();
var server = http.createServer(app);
var socket = require('socket.io');
require('events').EventEmitter.defaultMaxListeners = Infinity;
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

app.use(express.static(path.join(__dirname,'public')));

app.get("/",(req,res)=>{
    res.render("home/index");
});



//socket setup 
var io = socket(server.listen(8080));

app.use(function(req,res,next){
  req.io = io;
  next();
});
app.use("/game",game);

console.log('server started on port %s', server.address().port);
