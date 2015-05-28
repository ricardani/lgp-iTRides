angular.module('iTRides.banUsersControllers', [])

    .controller('BanUsersCtrl', function($scope, $window, $state, $http, Server, $ionicLoading) {

        $http.get(Server.url + 'api/profile/getAllUsers').
            success(function(data, status, headers, config) {
                $scope.users = data;
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


        $scope.removeUser = function (userID) {
            $http.post(Server.url + 'api/admin/banUser', {
                "userID": userID
            }).
                success(function(data, status, headers, config) {
                  for(var i=0; i < $scope.users.length; i++) {
                    if($scope.users[i].id === userID)
                      break;
                  }
                  if(i != $scope.users.length)
                    $scope.users.splice(i, 1);
                  $ionicLoading.hide();
                }).
                error(function(data, status, headers, config) {
                    console.log(JSON.stringify(data));
                    $ionicLoading.hide();
                });
        };


        $scope.promoteUser = function(userID) {
            $http.post(Server.url + 'api/admin/promoteUser', {
                "userID": userID
            }).
                success(function(data, status, headers, config) {
                  for(var i=0; i < $scope.users.length; i++) {
                    if($scope.users[i].id === userID)
                      break;
                  }
                  if(i != $scope.users.length)
                    $scope.users.splice(i, 1);
                  $ionicLoading.hide();
                }).
                error(function(data, status, headers, config) {
                    console.log(JSON.stringify(data));
                    $ionicLoading.hide();
                });


        };
    });
