angular.module('iTRides.profileControllers', [])



    .controller('ProfileCtrl', function($scope,$http,$ionicLoading,$ionicPopup, $timeout, Server, $window, $state) {

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

        $scope.getNumberComplete = function(num) {
            if(num<0){
      				return new Array(0);
      			} else {
      				return new Array(Math.floor(num));
      			}
        };

        $scope.getNumberEmpty = function(num) {
      			if(num<0){
      				return new Array(5);
      			} else {
      				return new Array(Math.floor(5-num));
      			}
        };

        $scope.getNumberHalf = function(num) {
    			if(num<0){
    				return new Array(0);
    			} else {
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
        };

        $scope.showConfirm = function() {

            var myPopup = $ionicPopup.show({
                template: 'Deseja especificar já a data da boleia ou criar uma boleia pré-definida?',
                title: 'Criar Boleia',
                scope: $scope,
                buttons: [
                    { text: 'Boleia',
                        type: 'button-energized',
                        onTap: function(e) {
                            $state.go('createRide', {'createNew': 'createNow'});
                        }
                    },
                    {
                        text: '<b>Boleia pré-definida</b>',
                        type: 'button-energized',
                        onTap: function(e) {
                            $state.go('createRide', {'createNew': 'createInfo'});
                        }
                    }
                ]
            });
            myPopup.then(function(res) {
                console.log('Tapped!', res);
            });
        };


        $scope.logout = function () {
            localStorage.removeItem('SessionToken');
            delete $window.sessionStorage.token;
            $state.go('login');
        };

    })
