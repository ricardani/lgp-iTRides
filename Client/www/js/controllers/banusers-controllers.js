angular.module('iTRides.banUsersControllers', [])

    .controller('BanUsersCtrl', function($scope, $window, $state, $http, Server, $ionicLoading) {

        $http.post(Server.url + 'api/admin/getUsers').
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


        $scope.removeUser = function (index) {
            console.log(JSON.stringify($scope.users));

            $http.post(Server.url + 'api/admin/banUser', {
                "userID": $scope.users[index]._id
            }).
                success(function(data, status, headers, config) {
                    $scope.users.splice(index, 1);
                    $ionicLoading.hide();
                }).
                error(function(data, status, headers, config) {
                    console.log(JSON.stringify(data));
                    $ionicLoading.hide();
                });
        };


        $scope.promoteUser = function(index) {
            $http.post(Server.url + 'api/admin/promoteUser', {
                "userID": $scope.users[index]._id
            }).
                success(function(data, status, headers, config) {
                    $scope.users.splice(index, 1);
                    $ionicLoading.hide();
                }).
                error(function(data, status, headers, config) {
                    console.log(JSON.stringify(data));
                    $ionicLoading.hide();
                });


        };
    });
