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

    $scope.removeRideClicked = function() {
      $http.post(Server.url + 'api/ride/deleteRequestedRide',
              {
                'ownerName': 'Pedro Santos',
                'ride_type': 'CT',
                'workLocationName': 'Escritório do Sr. Miguel',
                'homeLocation' : {
                    'district' : 'Aveiro',
                    'municipality' : 'Arouca',
                    'street' : 'Rua',
                    'info' : 'Só para testar'
                }
              }
      )
      .success(function(data, status, headers, config) {
          if(data){
              /* TODO caso funcione */
              $ionicLoading.hide();
          }
      }).
      error(function(data, status, headers, config) {
          /* TODO caso dê erro */
          $ionicLoading.hide();
      });
    }

		$scope.getNumberComplete = function(num) {
			return new Array(Math.floor(num));
		}

		$scope.getNumberEmpty = function(num) {
			return new Array(Math.floor(5-num));
		}

		$scope.getNumberHalf = function(num) {
			if(num % 1 === 0){
				//é inteiro
				return new Array(0);
			}
			else
			{
				//é float
				return new Array(1);
			}
		}

        $scope.logout = function () {
            localStorage.removeItem('SessionToken');
            delete $window.sessionStorage.token;
            $state.go('login');
        };

})
