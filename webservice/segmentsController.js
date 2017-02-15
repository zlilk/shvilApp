var mongoose = require('mongoose');
var Segment = require('./segment');

exports.getAllSegments = function(callback) {
    var getSegments = getSegmentsNow(callback); 
    function getSegmentsNow(callback){
        var query = Segment.find({}).select('seg_start seg_end indx');
        query.exec(function(err,segment){
            console.log(segment);
            callback(segment);
        });  
    }  
}

exports.calculateRoute = function(startDate, endDate, startPt, dir, kmDay, callback){
    var totalDays, totalKm, numOfSegs, firstSeg, lastIndx, firstIndx, segArr;
    totalDays = calculateDates();
    totalKm = totalDays * kmDay;
    numOfSegsUser = totalKm / kmDay;
    numOfSegs = totalKm / 5;
    
    //if too many days were chosen and not enough
    if(numOfSegs > 6) return callback("error");
    
    //parsing the dates into datesArr array
    var startDateArr = startDate.split('.');
    var sDate = new Date(startDateArr[2], startDateArr[1]-1, startDateArr[0]);
    var changeDate = sDate;
    var datesArr = [];
    for(var i = 0; i<totalDays; ++i)
    {
        var day = changeDate.getDate();
        var month = changeDate.getMonth();
        var year = changeDate.getFullYear();
        month = month+1; 
        if(day<10) { day='0'+day; } 
        if(month<10) { month='0'+month; } 
        datesArr[i] = day + "." + month + "." + year;  
        changeDate.setDate(sDate.getDate()+1);
    }

    var first = getFirstSegIndex(callback); 

    //getting the first segment according to start point and direction
    function getFirstSegIndex(callback){
        if(dir == "north"){
            var firstSeg = Segment.find({'seg_start':startPt}).select('indx');   
        }
        else if(dir == "south"){
            var firstSeg = Segment.find({'seg_end':startPt}).select('indx');
        }
        firstSeg.exec(function(err,segment){
            firstIndx = segment[0].indx;
            calcEndSeg(firstIndx, callback);
        });
    }

    //getting the end segment according to the first segment and no. of days
    function calcEndSeg(firstIndx, callback){
        if(dir == "north") {
            lastIndx = firstIndx + (numOfSegs - 1);
        }
        else if(dir == "south") {
            lastIndx = firstIndx - (numOfSegs - 1);
        }
        getSegs(firstIndx, lastIndx, callback);
    }

    //getting the route segments according to the km per day that the user chose
    function getSegs(firstIndx, lastIndx, callback){
        if(dir=="north"){
          segArr = Segment.find({}).where('indx').gt(firstIndx-1).lt(lastIndx+1).select('seg_start seg_end indx sleep_place');  
        } else if(dir=="south"){
          segArr = Segment.find({}).where('indx').gt(lastIndx-1).lt(firstIndx+1).select('seg_start seg_end indx sleep_place');  
        }
        segArr.exec(function(err,segment){
             if(dir == "north"){
                 if(kmDay == 5)
                 {
                    var newSegments = "[";
                    for(var i = firstIndx, j=0; i<=lastIndx; i++,j++)
                    {
                        var newJson = '{"indx": "' + i +'",';
                        newJson+='"seg_start": "'+ segment[j].seg_start +'",'; 
                        newJson+='"seg_end": "' + segment[j].seg_end + '",';
                        newJson+='"day": "'+ datesArr[j] +'",';
                        newJson+='"sleep_place": ' + JSON.stringify(segment[j].sleep_place) + ','; 
                        newJson+='"chosen_family": {"family_name": "none", "phone": "none"} },';
                        newSegments+=newJson;
                    }
                    newSegments = newSegments.substring(0, newSegments.length-1);
                    newSegments += ']';
                    var newSegmentsJson = JSON.parse(newSegments);
                    callback(newSegmentsJson);
                 }   
                 if(kmDay == 10)
                 {
                    var newSegments = "[";
                    for(var i = firstIndx, j=0, k=0; i<=lastIndx; i+=2,j+=2,k++)
                    {
                        var newJson = '{"indx": "' + i +'",';
                        newJson+='"seg_start": "'+ segment[j].seg_start +'",'; 
                        newJson+='"seg_end": "' + segment[j+1].seg_end + '",';
                        newJson+='"day": "'+ datesArr[k] +'",';
                        newJson+='"sleep_place": ' + JSON.stringify(segment[j+1].sleep_place) + ','; 
                        newJson+='"chosen_family": {"family_name": "none", "phone": "none"} },';
                        newSegments+=newJson;
                    }
                    newSegments = newSegments.substring(0, newSegments.length-1);
                    newSegments += ']';
                    var newSegmentsJson = JSON.parse(newSegments);
                    callback(newSegmentsJson);
                 }
                 if(kmDay == 15)
                 {
                    var newSegments = "[";
                    for(var i = firstIndx, j=0, k=0; i<=lastIndx; i+=3,j+=3,k++)
                    {
                        var newJson = '{"indx": "' + i +'",';
                        newJson+='"seg_start": "'+ segment[j].seg_start +'",'; 
                        newJson+='"seg_end": "' + segment[j+2].seg_end + '",';
                        newJson+='"day": "'+ datesArr[k] +'",';
                        newJson+='"sleep_place": ' + JSON.stringify(segment[j+2].sleep_place) + ',';
                        newJson+='"chosen_family": {"family_name": "none", "phone": "none"} },';
                        newSegments+=newJson;
                    }
                    newSegments = newSegments.substring(0, newSegments.length-1);
                    newSegments += ']';
                    var newSegmentsJson = JSON.parse(newSegments);
                    callback(newSegmentsJson);
                 }
            } else if(dir =="south"){
                if(kmDay == 5)
                { 
                    var newSegments = "[";
                    for(var i = firstIndx, j=(segment.length)-1, k=0; i>=lastIndx; i-=1,j-=1,k++)
                    {
                        var newJson = '{"indx": "' + i +'",';
                        newJson+='"seg_start": "'+ segment[j].seg_end +'",'; 
                        newJson+='"seg_end": "' + segment[j].seg_start + '",';
                        newJson+='"day": "'+ datesArr[k] +'",';
                        newJson+='"sleep_place": ' + JSON.stringify(segment[j].sleep_place) + ','; 
                        newJson+='"chosen_family": {"family_name": "none", "phone": "none"} },';
                        newSegments+=newJson;
                    }
                    newSegments = newSegments.substring(0, newSegments.length-1);
                    newSegments += ']';
                    var newSegmentsJson = JSON.parse(newSegments);
                    callback(newSegmentsJson);
                }
                 if(kmDay == 10)
                 {
                    var newSegments = "[";
                    for(var i = firstIndx, j=(segment.length)-1, k=0; i>=lastIndx; i-=2,j-=2, k++)
                    {
                        var newJson = '{"indx": "' + i +'",';
                        newJson+='"seg_start": "'+ segment[j].seg_end +'",'; 
                        newJson+='"seg_end": "' + segment[j-1].seg_start + '",';
                        newJson+='"day": "'+ datesArr[k] +'",';
                        newJson+='"sleep_place": ' + JSON.stringify(segment[j-1].sleep_place) + ','; 
                        newJson+='"chosen_family": {"family_name": "none", "phone": "none"} },';
                        newSegments+=newJson;
                    }
                    newSegments = newSegments.substring(0, newSegments.length-1);
                    newSegments += ']';
                    var newSegmentsJson = JSON.parse(newSegments);
                    callback(newSegmentsJson);
                 }
                 if(kmDay == 15)
                 {
                    var newSegments = "[";
                    for(var i = firstIndx, j=(segment.length)-1, k=0; i>=lastIndx; i-=3,j-=3, k++)
                    {
                        var newJson = '{"indx": "' + i +'",';
                        newJson+='"seg_start": "'+ segment[j].seg_end +'",'; 
                        newJson+='"seg_end": "' + segment[j-2].seg_start + '",';
                        newJson+='"day": "'+ datesArr[k] +'",';
                        newJson+='"sleep_place": ' + JSON.stringify(segment[j-2].sleep_place) + ',';
                        newJson+='"chosen_family": {"family_name": "none", "phone": "none"} },';
                        newSegments+=newJson;
                    }
                    newSegments = newSegments.substring(0, newSegments.length-1);
                    newSegments += ']';
                    var newSegmentsJson = JSON.parse(newSegments);
                    callback(newSegmentsJson);
                 }
            }  
        });
    }

    //calculating total days
    function calculateDates(){
        var oneDay = 24*60*60*1000; // hours*minutes*seconds*milliseconds
        var firstDateArr = startDate.split('.');
        var firstDate = new Date(firstDateArr[2], firstDateArr[1]-1, firstDateArr[0]);
        var secondDateArr = endDate.split('.');
        var secondDate = new Date(secondDateArr[2], secondDateArr[1]-1, secondDateArr[0]);
        var diffDays = Math.round(Math.abs((firstDate.getTime() - secondDate.getTime())/(oneDay)));
        diffDays+=1;
        return diffDays;
    }    
}