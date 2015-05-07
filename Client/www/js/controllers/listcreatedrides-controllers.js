angular.module('iTRides.listCreatedRidesControllers', [])

    .controller('listCreatedRidesCtrl', function($scope, $window, $state, $http, Server, $ionicLoading) {

        $http.get(Server.url + 'api/ride/getMyRides').
            success(function(data, status, headers, config) {
                $scope.createdRides = data;
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
