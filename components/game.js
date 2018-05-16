var express = require('express');
var router = express.Router();
var five = require("johnny-five");
var board = new five.Board();

var distance = 0;


board.on("ready",()=>{
    var proximity = new five.Proximity({
      controller: "HCSR04",
      pin: 7
    });
    proximity.on("data", function() {
        distance = this.in;
      });
    //   proximity.on("change", function() {
    //     distance = this.in;
    //   });
    
});  


router.get('/',(req,res)=>{
    req.io.on('connection',function(socket){
        socket.setMaxListeners(0);
        socket.on('getNewDistance',function(){
                req.io.sockets.emit('distance',distance);
        });
    });
    res.render('game/game');
});

module.exports = router