var route = angular.module('route', []);

var model = {};
var model2 = {};

route.run(function($rootScope, $http, $compile) {
    model.pic =  localStorage.getItem("pic");
    var ml = localStorage.getItem("email");
    
    $http.get("https://finalshvilws.herokuapp.com/getTravelerRoute/" + ml).success(function(data){
        model.segments = data[0].segments;
        model.start = data[0].start_date;
        model.end = data[0].end_date;

        //get sleep place arrays in all segments
        var familyArr = [];
        var globalArr = [];
        for(var i =0; i<data[0].segments.length; i++)
        {
            familyArr[i] =  data[0].segments[i].sleep_place;
            var tmpArr = familyArr[i];
            var sleepArr = [];
            for(var j =0; j<familyArr[i].length; j++)
            {
                sleepArr[j] = tmpArr[j].family_name;
                sleepArr[j] += ' ' + tmpArr[j].phone;
            }
            globalArr[i] = sleepArr;
            data[0].segments[i].sleep_place = sleepArr;
        }

        //convert string dates to date objects
        var sDateArr = (model.start).split(".");
        var sDateString = sDateArr[1] + '/' + sDateArr[0] + '/' + sDateArr[2];
        var sDate = new Date(sDateString);
       
		var eDateArr = (model.end).split(".");
        var eDateString = eDateArr[1] + '/' + eDateArr[0] + '/' + eDateArr[2];
        var eDate = new Date(eDateString);

        var oneDay = 24*60*60*1000; // hours*minutes*seconds*milliseconds
        var diffDays = Math.round(Math.abs((sDate.getTime() - eDate.getTime())/(oneDay)));
        diffDays+=1;

        //day of the week array
        var weekday = new Array(7);
        weekday[0]=  "יום א'";
        weekday[1] = "יום ב'";
        weekday[2] = "יום ג'";
        weekday[3] = "יום ד'";
        weekday[4] = "יום ה'";
        weekday[5] = "יום ו'";
        weekday[6] = "יום ש'";
        
        //build customize string date array
        var changeDate = sDate;
        var dayString;
        var dayNum;
        var daysArr = [];
        for(var i = 0; i<diffDays; ++i)
        {
        	var day = changeDate.getDate();
	        var month = changeDate.getMonth();
            var year = changeDate.getFullYear();
	        month = month+1; 
        	dayString = weekday[changeDate.getDay()];
            dayNum = day + "." + month;
            var date = '{"day": "' + dayNum + '", "string": "' + dayString + '"}';
            date = JSON.parse(date);
        	daysArr[i] = date;
        	changeDate.setDate(sDate.getDate()+1);
        }
        var days = globalArr;
        
        //building the user's route dynamically 
        var route = angular.element(document.querySelector('#route'));
        var htmlString = "";
        var tmpId = "";
        for(var j=0; j<globalArr.length; j++)
        {
            htmlString += "<img src = 'images/routeicon.png'> <p id = 'pRoute'> מ" + model.segments[j].seg_start + " - ל" + model.segments[j].seg_end + "</p>"; 
            var tmpArr = globalArr[j];
            var tmpSelect = "<p class = 'pSleep'> <select class='form-control' id = 'sleepSelect' ng-model = 'sleepSelect'>"
            +"<option value = '0' selected> בחר משפחה ללינה </option>";
            for(var i = 0; i<tmpArr.length; i++)
            {
                tmpSelect += '<option value ="' + tmpArr[i] + '">' + tmpArr[i] + "</option>";
            } 
            //before choosing family for sleep place
            if(model.segments[j].chosen_family.family_name == "none") {
                tmpSelect += '</select> <button type="submit" class="btn btn-default" id="selectBtn"'
                + 'ng-click="chooseFamily(' + model.segments[j].indx +')" ng-model="sleepSelect"> בחר </button> <div class = "clear"> </div> </p> <hr> </hr> ';
                htmlString +=  tmpSelect; 
            }
            //after choosing family for sleep place
            else { 
                var tmpFamily = "<br> <img src = 'images/sleepicon.png'> <p class = 'pSleep'>" + model.segments[j].seg_end + " - משפחת " + model.segments[j].chosen_family.family_name + "</p> <hr> </hr>"; 
                htmlString +=  tmpFamily;
            }
        }
        model.htmlRoute = htmlString;
        model2.dates = daysArr;
        $rootScope.$broadcast('init');
    });
});

route.controller('segmentscontroller', ['$scope', '$rootScope', '$http', '$compile', function($rootScope, $scope, $http, $compile){
	$scope.datesArr = model2;
    $scope.pic = model.pic;
    
    function init() {    
        $scope.htmlRoute = model.htmlRoute;
        var routeDiv = angular.element(document.querySelector('#route'));
        var linkingFunction = $compile( $scope.htmlRoute);
        var elem = linkingFunction($scope);
        routeDiv.append(elem);  
    }

    var unbindHandler = $rootScope.$on('init', function($scope){
        init();
        unbindHandler();
    });

    $scope.chooseFamily = function(indx){
        var fm = $scope.sleepSelect;
        var newStr = fm.split(" ");
        var ml = localStorage.getItem("email");
        var url = "https://finalshvilws.herokuapp.com/updateFamily/" + ml +"/" + indx + "/" + newStr[0] + "/" + newStr[1];
        $http.get(url).success(function(data){
            window.location.assign("http://shenkar.html5-book.co.il/2015-2016/ws1/dev_174/route.html");
        });
    } 
}]);



