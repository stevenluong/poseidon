var os = require('os');
var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);

server.listen(8088);


io.on('connection', function (socket) {
    var loadavg = os.loadavg();
    var loadavgi = 0;
    var mem = 0;
    socket.emit("loadavg",loadavg);
    setInterval(function(){ 
        loadavgi = os.loadavg()[0]
        socket.emit("loadavgi",loadavgi);
        memi = Math.round(os.freemem()/os.totalmem()*100)
        socket.emit("memi",memi);
        //console.log(memi)
    }, 1000);

});

