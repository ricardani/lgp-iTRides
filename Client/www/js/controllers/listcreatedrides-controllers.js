angular.module('iTRides.listCreatedRidesControllers', [])

    .controller('listCreatedRidesCtrl', function($scope, $window, $state, $http, Server, $ionicLoading, $ionicPopup) {

        $http.get(Server.url + 'api/ride/getMyRides').
            success(function(data, status, headers, config) {
                $scope.createdRides = data;
                $ionicLoading.hide();
            }).
            error(function(data, status, headers, config) {
                console.log(JSON.stringify(data));
                if(status === 401){
                    delete window.sessionStorage.token;
                    localStorage.removeItem('SessionToken');
                    $state.go('login');
                }
                $ionicLoading.hide();
            });

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
                        text: 'Boleia pré-definida',
                        type: 'button-energized',
                        onTap: function(e) {
                            $state.go('createRide', {'createNew': 'createInfo'});
                        }
                    }
                ]
            });
            myPopup.then(function(res) {
            });
        };
    })

;
