angular.module('iTRides.loadingControllers', [])

    .controller('LoadingCtrl', function($scope, $state, $window, $ionicLoading) {
        $ionicLoading.show({template: '<ion-spinner icon="lines"></ion-spinner>', hideOnStateChange:true, duration:5000})
        if ($window.sessionStorage.token) {
            $state.go('home');
        }else{
            $state.go('login');
        }
    })
;
