var os = require('os');
var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);

server.listen(80);


io.on('connection', function (socket) {
    var loadavg = os.loadavg()[0]/2;
    var loadavgi = 0;
    var mem = 0;
    socket.emit("loadavg",loadavg);
    setInterval(function(){ 
        loadavgi = os.loadavg()[0]/2
        socket.emit("loadavgi",loadavgi);
        var free = os.freemem();
        var total = os.totalmem();
        memi = Math.round((total-free)/total*100)
        socket.emit("memi",memi);
        //console.log(memi)
    }, 1000);

});

