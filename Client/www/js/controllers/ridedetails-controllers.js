angular.module('iTRides.rideDetailsControllers', [])

.controller('RideDetailsCtrl', function($scope, $ionicLoading, $timeout, $state, $stateParams, Server, $http) {
        // Simple POST request example (passing data) :
        $http.get(Server.url + 'api/ride/getRide',  {
            params: {rideID : $stateParams.rideID}
        }).
            success(function(data, status, headers, config) {
              console.log(data);
                $ionicLoading.hide();
            }).
            error(function(data, status, headers, config) {
                console.log(data);
                $ionicLoading.hide();
            });

})

;
