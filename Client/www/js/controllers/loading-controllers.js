angular.module('iTRides.loadingControllers', [])

    .controller('LoadingCtrl', function($scope, $state, $window) {

        $window.sessionStorage.token = localStorage.getItem('SessionToken');

        if ($window.sessionStorage.token && $window.sessionStorage.token != null && $window.sessionStorage.token != 'null') {
            $state.go('home');
        }else{
            $state.go('login');
        }
    })
;
