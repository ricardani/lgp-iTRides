angular.module('iTRides.adminpageControllers', [])
 
 	.controller('AdminCtrl', function($scope, $filter, $window, $timeout, $ionicLoading, $http, Server) {


 		$http.get(Server.url + 'api/profile/getProfileInfo').
            success(function(data, status, headers, config) {
                $scope.user = data;
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