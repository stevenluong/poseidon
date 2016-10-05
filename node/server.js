var os = require('os');
var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);

server.listen(8088);


io.on('connection', function (socket) {
    socket.emit("loadavg",os.loadavg());
    console.log(os.cpus());
    console.log(os.loadavg());
    setInterval(function(){ 
        socket.emit("loadavgi",os.loadavg()[0]);
    }, 1000);
});
