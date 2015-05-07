angular.module('iTRides.listRequestedRidesControllers', [])

    .controller('listRequestedRidesCtrl', function($scope, $window, $state, $http, $ionicLoading, Server) {

        $http.get(Server.url + 'api/ride/getMyRequestedRides').
            success(function(data, status, headers, config) {
                $scope.requestedRides = data;
                $ionicLoading.hide();
            }).
            error(function(data, status, headers, config) {
                console.log(JSON.stringify(data));
                if(status === 401){
                    delete window.sessionStorage.token;
                    localStorage.removeItem('SessionToken');
                    $state.go('login');
                }
                $ionicLoading.hide();
            });
    })

;
