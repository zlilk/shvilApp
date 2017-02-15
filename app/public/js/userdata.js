var userData = angular.module('userData', []);

var model = {};

userData.run(function($rootScope ,$http) {
    var ml = localStorage.getItem("email");
    $http.get("https://finalshvilws.herokuapp.com/getUserDetails/" + ml).success(function(data){
        model = data;
        $rootScope.$broadcast('init');
    });
});

userData.controller('routecontroller', ['$scope', '$rootScope', function($rootScope, $scope){
    function init() {
        $scope.name  = model.name;
        $scope.img = model.image;
        $scope.start = model.start_date;
        $scope.end = model.end_date;
        $scope.dir = model.dir;
    }
    var unbindHandler = $rootScope.$on('init', function($scope){
        init();
        unbindHandler();
    });
}]);