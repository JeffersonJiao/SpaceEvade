//load images
    
var spaceship = new Image();
var bg = new Image();
var fg = new Image();
var pipeNorth = new Image();
var pipeSouth = new Image();
spaceship.src = "/assets/imgs/spaceship.png";
bg.src ="/assets/imgs/bg.png"
fg.src = "/assets/imgs/fg.png";
pipeNorth.src = "/assets/imgs/pipeNorth.png";
pipeSouth.src = "/assets/imgs/pipeSouth.png";

var globalDistanceFromSensor = 0; 

$(document).ready(function(){
  
    //connect socket
    var socket = io.connect('http://localhost:8080');
    
    ///request new distance from the server
    socket.emit("getNewDistance",function(){

    });

    ///receive distance from the ultra sonic(server)
    socket.on('distance',function(data){
        globalDistanceFromSensor = Math.round(data);
        socket.emit("getNewDistance",function(){});
    });


});

$(window).on('load',function(){

        //var declarations
        var gap = 120;
        var constant = pipeNorth.height + gap;
        var bX = 10;
        var disVal = 30;
        var tempDistance = 30;
        //initialize canvas
        var cvs = $("#canvas").get(0);
        var ctx = cvs.getContext("2d");
        var pipe = [];
        var score = 0;
        var isPaused = false;
        pipe[0] ={
            x: cvs.width,
            y: 0
        };
        var isStart = false;
    // draw images
    window.requestAnimFrame = (function() {
        return  window.requestAnimationFrame       ||
                window.webkitRequestAnimationFrame ||
                window.mozRequestAnimationFrame    ||
                function(callback) {
                    window.setTimeout(callback, 1000 / 60);
                };
    })();

    setTimeout(function(){
        isStart = true;
    },1000);
    function draw(){
        if(!isPaused){
        if(isStart){
            disVal = globalDistanceFromSensor;
            if(disVal > 400 || disVal == null){
                disVal = tempDistance;
            }
            else{
                tempDistance = disVal;
            }
            disVal*=5;
        }
        ctx.drawImage(bg,0,0);
        console.log(disVal);
        for(var i=0 ;i < pipe.length;i++){
            ctx.drawImage(pipeNorth,pipe[i].x,pipe[i].y);
            ctx.drawImage(pipeSouth,pipe[i].x, pipe[i].y + constant);

            pipe[i].x --;
            if(pipe[i].x == 20){
                pipe.push({
                    x: cvs.width,
                    y: Math.floor(Math.random()*pipeNorth.height)- pipeNorth.height
                })
            }

            if(bX + spaceship.width >= pipe[i].x && bX <= pipe[i].x + pipeNorth.width && (disVal  <=pipe[i].y + pipeNorth.height || disVal + spaceship.height >= pipe[i].y + constant)
                ||  disVal + spaceship.height >= cvs.height - fg.height){
                    isPaused = true;
                    $("#saveScore").show();
            }

            if(pipe[i].x  == 5){
                score++;
            }
        }
        
        ctx.drawImage(fg,0,cvs.height - fg.height);
        ctx.drawImage(spaceship,bX,disVal)
        ctx.fillStyle = "#000";
        ctx.font = "20px Verdana";
        ctx.fillText("Score: " + score, 10,cvs.height-20);
        }


        requestAnimationFrame(draw);
    }

    draw();
    
    
     $("#saveScore").on('click',function(){
        location.reload(); 
     });
});