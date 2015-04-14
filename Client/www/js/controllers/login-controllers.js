angular.module('iTRides.loginControllers', [])

    .controller('LoginCtrl', function($scope, $state) {

        $scope.login = function () {
           $state.go('home');
        };

    })
;
