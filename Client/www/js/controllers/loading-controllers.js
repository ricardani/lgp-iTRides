angular.module('iTRides.loadingControllers', [])

    .controller('LoadingCtrl', function($scope, $state, $window, $http, Server, $ionicLoading) {

        $http.get(Server.url + 'connect').
            success(function(data, status, headers, config) {
                $ionicLoading.hide();
            }).
            error(function(data, status, headers, config) {
                $state.go('networkError');
                $ionicLoading.hide();
            });

        $window.sessionStorage.token = localStorage.getItem('SessionToken');

        if ($window.sessionStorage.token && $window.sessionStorage.token != null && $window.sessionStorage.token != 'null') {
            $state.go('home');
        }else{
            delete window.sessionStorage.token;
            localStorage.removeItem('SessionToken');
            $state.go('login');
        }
    })

    .controller('NetworkErrorCtrl', function($scope, $state, $window) {

        $scope.tryAgain = function() {
            $state.go('loading');
        }

    })
;
