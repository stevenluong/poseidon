var os = require('os');
var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);



    var loadavg = os.loadavg();
    var loadavgi = 0;
    var mem = 0;
    setInterval(function(){ 
        loadavgi = os.loadavg()[0]
        console.log(os.loadavg());
        var free = os.freemem();
        var total = os.totalmem();
        memi = Math.round((total-free)/total*100)
        console.log(memi)
    }, 1000);


