angular.module('iTRides.loadingControllers', [])

    .controller('LoadingCtrl', function($scope, $state, $window, $ionicLoading) {
        $ionicLoading.show({template: '<ion-spinner icon="lines"></ion-spinner>', hideOnStateChange:true, duration:5000})
        if ($window.sessionStorage.token) {
            console.log("Esta aqui um Token!");
            $state.go('home');
        }else{
            console.log("Nada!");
            $state.go('login');
        }
    })
;
