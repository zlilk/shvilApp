var routeForm = angular.module('routeForm', []);

var model = {};

routeForm.run(function($http) {
    $http.get("https://finalshvilws.herokuapp.com/getSegments").success(function(data){
        
        //gtting all start points and end points 
        var placeJson = '[';
        for(var i = 1; i<7; i++)
        {
            for (var j=0; j<6; j++) {
                if(i == data[j].indx){ 
                    placeJson += '{ "place": "' + data[j].seg_start + '", "id" :' + (i) + '},';
                    if(i==6) {
                         placeJson += '{ "place": "' + data[j].seg_end + '", "id" :' + (i+1) + '},';  
                    }
                }
            }
        }
        placeJson = placeJson.substring(0, placeJson.length-1);
        placeJson += ']';
        var parsedPlaces = JSON.parse(placeJson);
        model.listPlace = parsedPlaces;  
    });
});

routeForm.controller('routecontroller', ['$scope','$http',function($scope, $http){
    $scope.list = model;
    
    //send the form details by ng-click
    $scope.sendDetails = function(){
        var sd = $scope.sDate;
        var ed = $scope.eDate;
        var sp = $scope.sPoint;
        var dr = $scope.dir;
        var df = $scope.diff;

        //convers start and end date from date object to string
        var sDay = sd.getDate();
        var sDayString = sDay.toString(); 
        if(sDay<10) { 
            sDayString = "0" + sDayString;
        }

        var sMonth = sd.getMonth();
        sMonth = sMonth+1;
        var sMonthString = sMonth.toString(); 
        if(sMonth<10) { 
            sMonthString = "0" + sMonthString;
        }

        var sYear = sd.getFullYear();
        var sDate = sDayString + '.' + sMonthString + '.' + sYear;

        var eDay = ed.getDate();
        var eDayString = eDay.toString(); 
        if(eDay<10) { 
            eDayString = "0" + eDayString;
        }

        var eMonth = ed.getMonth();
        eMonth = eMonth+1;
        var eMonthString = eMonth.toString(); 
        if(eMonth<10) { 
            eMonthString = "0" + eMonthString;
        }

        var eYear = ed.getFullYear();
        var eDate = eDayString + '.' + eMonthString + '.' + eYear;
        
        var ml = localStorage.getItem("email");
        var url = "https://finalshvilws.herokuapp.com/calculate/" + sDate +"/" + eDate + "/" + sp 
        +"/" + dr +"/" + df + "/" + ml;
        $http.get(url).success(function(data){
            //if too many days were chosen and not enough segments
            if(data == "error") {
                alert("יש לבחור פחות ימים!");
                window.location.assign("http://shenkar.html5-book.co.il/2015-2016/ws1/dev_174/createroute.html");
            }
            else window.location.assign("http://shenkar.html5-book.co.il/2015-2016/ws1/dev_174/route.html");
        });
    };
}]);
