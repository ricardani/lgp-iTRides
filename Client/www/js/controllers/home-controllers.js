angular.module('iTRides.homeControllers', [])

    .controller('HomeCtrl', function($scope, $http, $ionicLoading, $ionicPopup, $timeout, Server, $state) {


        $scope.dateLimit = 10;

        $http.get(Server.url + 'api/profile/getNotifications').
            success(function(data, status, headers, config) {
                $scope.notifications = data;
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

        $http.get(Server.url + 'api/profile/getNextRide').
            success(function(data, status, headers, config) {
                $scope.myNextRide = data;
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

        $http.get(Server.url + 'api/profile/getNextRequestedRide').
            success(function(data, status, headers, config) {
                $scope.myNextRequest = data;
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

        $http.get(Server.url + 'api/ride/getMyPastRides').
            success(function(data, status, headers, config) {
                $scope.pastRides = data;
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
                        type: 'button-positive',
                        onTap: function(e) {
                            $state.go('createRide', {'createNew': 'createNow'});
                        }
                    },
                    {
                        text: '<b>Boleia pré-definida</b>',
                        type: 'button-positive',
                        onTap: function(e) {
                            $state.go('createRide', {'createNew': 'createInfo'});
                        }
                    }
                ]
            });
            myPopup.then(function(res) {
            });
        };

        $scope.showPopup = function(rideID) {
            $scope.data = {}
            var myPopup = $ionicPopup.show({
                template: '<input ng-model="data.rating" type="number" min="1" max="5">  <br> <input ng-model="data.message" type="text" placeholder="Deixe uma pequena mensagem">',
                title: 'Avalie esta boleia',
                scope: $scope,
                buttons: [
                    {
                        text: '<b>Avaliar</b>',
                        type: 'button-positive',
                        onTap: function(e) {
                            if (!$scope.data.rating && !$scope.data.message.length) {
                                //don't allow the user to close unless he enters a valid rating
                                e.defaultPrevented();
                            } else {
                                console.log('ride ' + rideID + ' -> Rating: ' + $scope.data.rating + '      message:' + $scope.data.message);
                                $http.post(Server.url + 'api/ride/rideFeedback',
                                    {
                                        'rideID' : rideID,
                                        'feedback': $scope.data.rating,
                                        'message': $scope.data.message
                                    })
                                    .success(function(data, status, headers, config) {
                                        if(data)
                                            $state.go($state.current, {}, {reload: true});
                                        $ionicLoading.hide();
                                    })
                                    .error(function(data, status, headers, config) {
                                        console.log("Error rating ride " + status);
                                        $ionicLoading.hide();
                                    });
                            }
                        }
                    },
                    {text: 'Cancelar'}
                ]
            });

        };

        $scope.removeNotification = function (index) {
            $scope.notifications.splice(index, 1);

        };

        $scope.removeAllNotification = function () {

            while($scope.notifications.length > 0){
                $scope.removeNotification($scope.notifications.length - 1);
            }
        };



    })

;
