//DEPENDENCIES
var fs = require('fs')
var COMMON = require("./common.js");
var kue = require('kue')
, queue = kue.createQueue({
    redis:{
        host: 'redis'
    }
});

//CONF
var server_url = "slapps.fr";
var server_port = "3001";
var visits_path = '/visits.json';
var logFile ='/node/apacheLogs/access.log'; 
//var logFile ='/node/nginxLogs/access.log'; 
var diffLimit = 1;
//INIT
var ips = {};
var counts = {
    status408 : 0,
    status503 : 0,
    bot : 0,
    botDist : 0,
    hephaistos : 0,
    hephaistosDist : 0,
    apollo: 0,
    apolloDist: 0,
    poseidon: 0,
    poseidonDist: 0,
    sl : 0,
    slDist : 0,
    filtered : 0
};
var visits = [];
var filteredVisits = [];
var visitsByIp = {};
var now = new Date();
var isFirst = true;
var lineReader = require('readline').createInterface({
    input: fs.createReadStream(logFile)
});

//BUSINESS
queue.process('visit', function(job, done){
    console.log(job.data);
    COMMON.ror_post(job.data,server_url,server_port,visits_path,function(res){
        console.log(job.data);
        console.log("-- OK --");
        done();
    })
});
lineReader.on('close',function(){
    //console.log("close");
    //for(var ip in ips){
    for(var v in visits){
        var visit = visits[v];
        var ip = visit.ip;
                //console.log(visit);
        //if(descriptionFilter(ips[ip].description)){
        //console.log(ip+' '+ips[ip].description);
        //for(var v in ips[ip].visits){
        //    var visit = ips[ip].visits[v];
        if(visitFilter(visit))
            continue;
        filteredVisits.push(visit);

        if(visitsByIp[ip]==null){
            visitsByIp[ip] = {};
            visitsByIp[ip].visits = [];
            visitsByIp[ip].description= visit.description;
        }
        visitsByIp[ip].visits.push(visit);

        // console.log("-"+visit.target+"  "+visit.source+" "+visit.firstDate);
        //console.log(visit);
        queue.create('visit',visit).save();
        //};
        //console.log("-------");
    };
    distinctCount(visitsByIp);
    console.log(filteredVisits);
    console.log("nb total visit on steven-luong: "+counts.sl);
    console.log("nb distinct visit on steven-luong: "+counts.slDist);
    console.log("nb total visit on hephaistos: "+counts.hephaistos);
    console.log("nb distinct visit on hephaistos: "+counts.hephaistosDist);
    console.log("nb total visit on apollo: "+counts.apollo);
    console.log("nb distinct visit on apollo: "+counts.apolloDist);
    console.log("nb total visit on poseidon: "+counts.poseidon);
    console.log("nb distinct visit on poseidon: "+counts.poseidonDist);

    //console.log("nb total visit on server: "+Object.keys(ips).length);
    console.log("nb total visit on server: "+visits.length);
    console.log("nb filtered visit on server: "+filteredVisits.length);
    console.log("nb distincs visitor on server: "+Object.keys(visitsByIp).length);
    console.log("nb total Bots on server: "+counts.bot);
    console.log("nb distincs Bots on server: "+counts.botDist);
    console.log("nb 408: "+counts.status408);
    console.log("nb 503: "+counts.status503);
    //process.exit(0);
    });
    var distinctCount = function(visitsByIp){
        var refererDist=[];
        var hephaistosDist= [];
        var botDist = [];
        var apolloDist = [];
        var poseidonDist = [];
        var slDist = [];
        for(var i in visitsByIp){
            for(var j in visitsByIp[i].visits){
                var visit = visitsByIp[i].visits[j];
                //hephaistos
                if(visit.target.indexOf("/hephaistos/ ")>0){
                            counts.hephaistos = counts.hephaistos +1;
                            if(hephaistosDist.indexOf(visit.ip)==-1){
                                hephaistosDist.push(visit.ip);
                                //console.log(visit);
                            }
                }
                if(visit.target.indexOf("/apollo/ ")>0){
                            counts.apollo= counts.apollo+1;
                            if(apolloDist.indexOf(visit.ip)==-1){
                                apolloDist.push(visit.ip);
                                //console.log(visit);
                            }
                }
                if(visit.target.indexOf("/poseidon/ ")>0){
                            counts.poseidon= counts.poseidon+1;
                            if(poseidonDist.indexOf(visit.ip)==-1){
                                poseidonDist.push(visit.ip);
                                //console.log(visit);
                            }
                }

                if(visit.target.indexOf("steven-luong")>0){
                            counts.sl= counts.sl+1;
                            if(slDist.indexOf(visit.ip)==-1){
                                slDist.push(visit.ip);
                                //console.log(visit);
                            }
                }

                if(visit.description.toLowerCase().indexOf('bot')>0 || visit.description.toLowerCase().indexOf('spider')>0|| visit.description.toLowerCase().indexOf('feed')>0){
                    counts.bot = counts.bot +1;
                    if(botDist.indexOf(visit.description)==-1)
                                botDist.push(visit.description);

                }
                if(refererDist.indexOf(visit.referer)==-1){
                                refererDist.push(visit.referer);
                                //console.log(visit);
                            }

            }
        }
        counts.hephaistosDist = Object.keys(hephaistosDist).length;
        counts.apolloDist = Object.keys(apolloDist).length;
        counts.poseidonDist = Object.keys(poseidonDist).length;
        counts.botDist= Object.keys(botDist).length;
        counts.slDist= Object.keys(slDist).length;
        for(var i in botDist){
            //console.log(botDist[i]);
        }
        for(var i in refererDist){
            //console.log(refererDist[i]);
        }

    };
    var visitFilter = function(visit){
        visit.target=visit.target.toLowerCase();
        if(visit.target.indexOf(".jpg")>0) return true;
        if(visit.target.indexOf(".json")>0) return true;
        if(visit.target.indexOf(".js")>0) return true;
        if(visit.target.indexOf(".ico")>0) return true;
        if(visit.target.indexOf(".css")>0) return true;
        if(visit.target.indexOf(".png")>0) return true;
        if(visit.target.indexOf("xmlrpc")>0) return true;
        if(visit.ip=="::1") return true;
        if(visit.target.indexOf("options * http/1.0")>0) return true;
        if(visit.raw.indexOf(" 408 ")>0) {
            counts.status408 = counts.status408 + 1;
            return true;
        };
        if(visit.raw.indexOf(" 408 ")>0) {
            counts.status503 = counts.status503 + 1;
            //console.log(visit);
            return true;
        };
        //inside calls 
        if(visit.referer.indexOf("steven-luong.com")>0) return true;
        if(visit.referer.indexOf("contesetdelices")>0) return true;
        if(visit.referer.indexOf("slapps")>0) return true;

        return false;
    };
    lineReader.on('line', function (line) {
        var s = line.split("\"");
        var s0 = s[0].split(" ");
        var ip = s0[0];
        var rawDate = s0[3].substring(1);
        var target = s[1];
        var referer = s[3];
        var description= s[5];
        var date = parseDate(rawDate);
        var diff = (now - date)/1000/60/60;
        if(isFirst){
            console.log(now);
            console.log(date);
            isFirst=false;
        }
        //console.log(diff);
        if(diff<diffLimit){
            var visit ={
                ip:ip,
                firstDate:date,
                target:target,
                referer:referer,
                description:description,
                raw:line
            };
            visits.push(visit);
        }
    });

    var parseDate = function(rawDate){
        //console.log(rawDate);
        var s = rawDate.split(":");
        var s0 = s[0].split("/");
        var day = s0[0];
        var month = s0[1];
        var year = s0[2];
        var hour = s[1];
        var minute = s[2];
        var second = s[3].substring(0,2);
        var date = day+"/"+month+"/"+year+" "+hour+":"+minute+":"+second;
        //console.log(date);
        return new Date(date);
    }
