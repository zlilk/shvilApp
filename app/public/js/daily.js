var daily = angular.module('daily', []);

var model = {};

daily.run(function($rootScope, $http) {
    model.pic =  localStorage.getItem("pic");
    
    //geting the current day date
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth()+1;
    var yyyy = today.getFullYear();
    if(dd<10) {
        dd='0'+dd
    } 
    if(mm<10) {
        mm='0'+mm
    } 
    today = dd+'.'+mm+'.'+yyyy;
    model.day = today;

    var ml = localStorage.getItem("email");
    $http.get("https://finalshvilws.herokuapp.com/getRouteByDay/" + today + "/" + ml).success(function(data){
        model.start = data.start;
        model.end = data.end;
        model.km = data.km;
        model.familyName = data.family;
        model.familyPhone = data.phone;
        $rootScope.$broadcast('init');
    });
});

daily.controller('dailycontroller', ['$scope', '$rootScope', function($rootScope, $scope){
    function init() {
        $scope.pic = model.pic;
        $scope.date = model.day;
        $scope.start = model.start;
        $scope.end = model.end;
        $scope.km = model.km;
        $scope.familyName = model.familyName;
        $scope.familyPhone = model.familyPhone;
    }
    var unbindHandler = $rootScope.$on('init', function($scope){
        init();
        unbindHandler();
    });
}]);
