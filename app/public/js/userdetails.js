var newUser = angular.module('newUser', []);

var model = {};

newUser.run(function($http) {
});

newUser.controller('usercontroller', ['$scope','$http', function($scope, $http){
    var name;
    var image;
    var email;

    //function that gets the current registered user information from google+
    function onSignIn(googleUser) {
            var profile = googleUser.getBasicProfile();
            name = profile.getName();
            image = profile.getImageUrl();
            localStorage.setItem("pic", image); //saving the user's picture
            var newchar = '*';
            image = image.split('/').join(newchar);
            email = profile.getEmail();
            localStorage.setItem("email", email); //saving the user's email 

            var url = "https://finalshvilws.herokuapp.com/createTraveler/" + email +"/" + name + "/" + image;
            $http.get(url).success(function(data){
                if(data == "exists") window.location.assign("http://shenkar.html5-book.co.il/2015-2016/ws1/dev_174/route.html");
                else window.location.assign("http://shenkar.html5-book.co.il/2015-2016/ws1/dev_174/createroute.html");
            });
    }

    window.onSignIn = onSignIn;
}]);

