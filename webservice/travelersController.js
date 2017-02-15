var mongoose = require('mongoose');
var Traveler = require('./traveler');

//creating new user in mlab
exports.createUser = function(mail, name, pic, callback){
    var newchar = '/';
    pic = pic.split('*').join(newchar);
    var query = Traveler.find({}).select('email');
    query.exec(function(err,mails){
        for(var i = 0; i<mails.length; i++)
        {
            if(mails[i].email == mail) return callback("exists");   
        }
        var newUser = new Traveler ({
                full_name: name,
                image: pic,
                email: mail,
                routes:[]
        }); 
        newUser.save();
        callback("newuser"); 
    });
}

//adding a new route to traveler
exports.updateUserData = function(startDate, endDate, startPt, dir, km, mail, segments, callback){ 
    var query = Traveler.findOne().where('email', mail);
    var routeJson = '{"start_date": "' + startDate + '",';      
    routeJson += '"end_date": "' + endDate + '",';
    routeJson += '"start_pt": "' + startPt + '",';
    routeJson += '"direction": "' + dir + '",';
    routeJson += '"km_per_day": "' + km + '",';
    routeJson += '"segments": '+ JSON.stringify(segments) +'}';
    var newRouteJson = JSON.parse(routeJson);
    query.exec(function(err,doc){
        doc.set('routes', newRouteJson);
        doc.save();
        callback("updated")
    });
}

//getting the traveler route
exports.getTravelerRoute = function(mail, callback) {
    var query = Traveler.findOne().where('email', mail);
    query.exec(function(err,traveler){
        callback(traveler.routes); 
    }); 
}

//getting the current traveler info
exports.getUserDetails = function(mail, callback){
    var query = Traveler.findOne().where('email', mail).select('full_name image routes');
    query.exec(function(err,traveler){
        var name =  traveler.full_name;
        var image = traveler.image;
        var startDate = traveler.routes[0].start_date;
        var endDate = traveler.routes[0].end_date;
        var dir = traveler.routes[0].direction;
        if(dir=="north") dir ="מצפון לדרום";
        else dir = "מדרום לצפון";
        var dataJson = '{"name": "'+ name +'",'
        + '"image": "'+ image +'",'
        + '"start_date": "'+ startDate +'",'
        + '"end_date": "'+ endDate +'",'
        + '"dir": "'+ dir +'"}';
        
        dataJson = JSON.parse(dataJson);
        callback(dataJson); 
    });         
}

//getting the current day traveler's route
exports.getRouteByDay = function(date, mail, callback) {
    var query = Traveler.findOne().where('email', mail).select('routes');
    query.exec(function(err,traveler){
        route = traveler.routes[0];
        var km = route.km_per_day;
        var startPt, endPt, sleep;
        for(var i = 0; i<route.segments.length; i++)
        {
            if(date == route.segments[i].day)
            {
                startPt = route.segments[i].seg_start;
                endPt = route.segments[i].seg_end;
                sleep = route.segments[i].sleep_place[0];
            }
        }
        var dataJson = '{"start": "'+ startPt +'",'
        + '"end": "'+ endPt +'",'
        + '"km": "'+ km +'",'
        + '"family": "' + sleep.family_name + '",' 
        + '"phone": "' + sleep.phone + '"}';
        dataJson = JSON.parse(dataJson);
        callback(dataJson); 
    }); 
}

//updates chosen family for sleep place 
exports.updateFamily = function(mail, indx, familyName, familyPhone, callback){ 
    var query = Traveler.findOne().where('email', mail);
    query.exec(function(err,traveler){
        var segs = traveler.routes[0].segments; 
        var segIndx;
        for(var i = 0; i<segs.length; i++)
        {
            if(segs[i].indx == indx) {
                segIndx = i;
                break;
            }
        }
        var tmp = traveler.routes[0];
        var familyJson = '{"family_name": "' + familyName + '",';      
        familyJson += '"phone": "' + familyPhone + '"}';
        var newfamilyJson = JSON.parse(familyJson);
        tmp.segments[segIndx].chosen_family = newfamilyJson;
        traveler.set('routes', tmp);
        traveler.save();
        callback("updatad");
    }); 
}