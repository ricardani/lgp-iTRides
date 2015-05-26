angular.module('iTRides.footerControllers', [])

    .controller('FooterCtrl', function($scope, $filter, $window, $timeout, $ionicLoading, $http, $state, Server) {
        $scope.isHome = false;
        $scope.isProfile = false;
        $scope.isSearch = false;

        if($state.is('home'))
            $scope.isHome = true;
        else if($state.is('profile'))
            $scope.isProfile = true;
        else if($state.is('search'))
            $scope.isSearch = true;
    });
