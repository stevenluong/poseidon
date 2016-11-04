fs = require('fs')
var logFile ='/var/log/apache2/access.log'; 
var lineReader = require('readline').createInterface({
    input: fs.createReadStream(logFile)
});
var visits = {};
var count =0;
var count2 =0;
var now = new Date();
lineReader.on('close',function(){
    //console.log("close");
    console.log("nb total visit on hephaistos: "+count);
    console.log("nb distinct visit on hephaistos: "+count2);
    console.log("nb total visit on server "+Object.keys(visits).length);
    for(var ip in visits){
        //console.log(ip);
        visits[ip].forEach(function(visit){
            if(filter(visit)){
                //console.log("-"+visit.target+"  "+visit.source);
            }
        });
        //console.log("-------");
    };
});
var filter = function(visit){
    visit.target=visit.target.toLowerCase();
    if(visit.target.indexOf(".jpg")!=-1) return false
    if(visit.target.indexOf(".json")!=-1) return false
    if(visit.target.indexOf(".js")!=-1) return false
    if(visit.target.indexOf(".ico")!=-1) return false
    if(visit.target.indexOf(".css")!=-1) return false
    if(visit.target.indexOf(".png")!=-1) return false
    if(visit.target.indexOf("options * http/1.0")!=-1) return false
    return true
}
lineReader.on('line', function (line) {
    var s = line.split("\"");
    var s0 = s[0].split(" ");
    var ip = s0[0];
    var rawDate = s0[3].substring(1);
    var target = s[1];
    var source = s[3];
    var description= s[5];
    var date = parseDate(rawDate);
    var diff = (now - date)/1000/60/60;
    //console.log(diff);
    if(diff<12){
    if(visits[ip]==null){
        visits[ip] = [];
        if(target.indexOf("/hephaistos/http/ ")!=-1)
            count2 = count2+1;
    }
        var visit ={
            ip:ip,
            firstDate:date,
            target:target,
            source:source,
            description:description,
            raw:line
        };
        visits[ip].push(visit);
        //TODO push to ROR
        if(target.indexOf("/hephaistos/http/ ")!=-1){
            //console.log(visit);
            count = count +1;
            //console.log(count);
        }else{
            //console.log(visit);
        }
    }
    //}
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
