angular.module('iTRides.profileControllers', [])



.controller('ProfileCtrl', function($scope,$http,$ionicLoading, $timeout, Server, $window, $state) {

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

    /*
        $http.get(Server.url + 'api/profile/getNextDefaultRides').
            success(function(data, status, headers, config) {
                console.log(data);
                $scope.user = data;
                $ionicLoading.hide();
            }).
            error(function(data, status, headers, config) {
                console.log(JSON.stringify(config));
                $ionicLoading.hide();
        });
    */

        $scope.defaultRides = [{
        	id:0,
        	name: 'Trabalho',
        	day: 'Segunda Feira',
        	start_time: '07:30'
        }, {
        	id:1,
        	name: 'Casa',
        	day: 'Segunda Feira',
        	start_time: '18:30'
        }, {
        	id:2,
        	name: 'Trabalho',
        	day: 'Terça Feira',
        	start_time: '08:00'
        }];

      //$scope.number = 5-$scope.user.rating;
		$scope.getNumber = function(num) {
		    return new Array(num);   
		}

        $scope.logout = function () {
            localStorage.removeItem('SessionToken');
            delete $window.sessionStorage.token;
            $state.go('login');
        };

})
