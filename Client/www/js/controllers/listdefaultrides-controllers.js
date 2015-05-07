angular.module('iTRides.listDefaultRidesControllers', [])

.controller('ListDefaultRidesCtrl', function($scope, $window, $state, $http, Server, $ionicLoading) {

        $http.get(Server.url + 'api/ride/getMyDefaultRides').
            success(function(data, status, headers, config) {
                $scope.defaultRides = data;
                $ionicLoading.hide();
            }).
            error(function(data, status, headers, config) {
                console.log(JSON.stringify(config));
                if(status === 401){
                    delete window.sessionStorage.token;
                    localStorage.removeItem('SessionToken');
                    $state.go('login');
                }
                $ionicLoading.hide();
            });
});
