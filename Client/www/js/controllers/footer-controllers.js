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

        $http.get(Server.url + 'api/profile/getProfileInfo').
            success(function(data, status, headers, config) {
                $scope.user = data;
                console.log($scope.user.permission);
                $ionicLoading.hide();
            }).
            error(function(data, status, headers, config) {
                console.log(JSON.stringify(config));
                if(status === 401){
                    delete window.sessionStorage.token;
                    localStorage.removeItem('SessionToken');
                    $state.go('login');
                }
                $ionicLoading.hide();
           });

    

    });
