angular.module('iTRides.profileControllers', [])

.controller('ProfileCtrl', function($scope, $window, $state) {

        $scope.user = {
            name: '', photo: '', contact: ''
        };

        $scope.logout = function () {
            delete $window.sessionStorage.token;
            $state.go('loading');
        }

})

;
