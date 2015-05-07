angular.module('iTRides.homeControllers', [])

    .controller('HomeCtrl', function($scope, $http, $ionicLoading, $timeout, Server, $state) {

        $http.get(Server.url + 'api/profile/getNotifications').
            success(function(data, status, headers, config) {
                $scope.notifications = data;
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

        $http.get(Server.url + 'api/profile/getNextRide').
            success(function(data, status, headers, config) {
                $scope.myNextRide = data;
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

        $http.get(Server.url + 'api/profile/getNextRequestedRide').
            success(function(data, status, headers, config) {
                $scope.myNextRequest = data;
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

        $scope.removeNotification = function (index) {
            $scope.notifications.splice(index, 1);

        };

        $scope.removeAllNotification = function () {

            while($scope.notifications.length > 0){
                $scope.removeNotification($scope.notifications.length - 1);
            }
        };



    })

;
