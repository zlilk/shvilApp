var express = require('express');
var app = express();
var Segment = require('./segmentsController');
var Traveler = require('./travelersController');
var port = process.env.PORT || 3000;

app.set('port', port);
app.use('/',express.static('./public'));
app.use(function(req,res,next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    app.set('json spaces', 4);
    res.set("Content-Type", "application/json");
    next();
});

app.get('/getSegments', function(req,res){
   Segment.getAllSegments(function(segs){
     res.json(segs);
   }); 
});

app.get('/getUserDetails/:ml', function(req,res){
   Traveler.getUserDetails(req.params.ml,function(data){
     res.json(data);
   }); 
});

app.get('/createTraveler/:ma/:na/:pi', function(req,res){
Traveler.createUser(req.params.ma, req.params.na, req.params.pi,function(data){
      res.json(data); 
    });
}); 

app.get('/updateTraveler', function(req,res){
    Traveler.updateUserData(startDate, endDate, startPt, endPt ,dir, segments);
});

app.get('/calculate/:sd/:ed/:sp/:dir/:km/:ml', function(req,res){
    Segment.calculateRoute(req.params.sd,req.params.ed,req.params.sp,req.params.dir,req.params.km,function(segs){
         if(segs == "error") {res.json("error"); }
         else { 
          Traveler.updateUserData(req.params.sd,req.params.ed,req.params.sp,req.params.dir, req.params.km,req.params.ml,segs,function(data){
            res.json(data);
          });  
        }
    });
});

app.get('/getTravelerRoute/:ml', function(req,res){
    Traveler.getTravelerRoute(req.params.ml,function(data){
      res.json(data); 
    });
});

app.get('/getRouteByDay/:date/:mail', function(req,res){
    Traveler.getRouteByDay(req.params.date,req.params.mail,function(data){
      res.json(data); 
    });
});

app.get('/updateFamily/:mail/:indx/:fn/:fp', function(req,res){
    Traveler.updateFamily(req.params.mail,req.params.indx,req.params.fn,req.params.fp,function(data){
      res.json(data); 
    });
});

app.listen(port);
console.log("service is lstening on port " + port);
