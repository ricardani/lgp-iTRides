angular.module('iTRides.searchUsers', [])

    .controller('SearchUsersCtrl', function($scope, $state, $window, $http, Server, $ionicLoading) {

        $http.get(Server.url + 'api/profile/getAllUsers').
            success(function(data, status, headers, config) {
                $scope.users = data;
                $scope.usersTemp = data;
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
    })

;
