angular.module('iTRides.homeControllers', [])

    .controller('HomeCtrl', function($scope, $http, $ionicLoading, $ionicPopup, $timeout, Server, $state) {
        $scope.dateLimit = 10;

        $http.get(Server.url + 'api/profile/getNotifications').
            success(function(data, status, headers, config) {
                for(var i=0; i < data.length; i++) {
                  if(data[i].msgType == 'Cancel')
                    data[i].rideDate = new Date(data[i].rideDate);
                }
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

        $scope.showPopup = function(rideID) {
            $scope.data = {}
            var myPopup = $ionicPopup.show({
                template: '<input ng-model="data.message" type="text" placeholder="Deixe uma pequena mensagem"> <br>' +
                '<input ng-model="data.rating" type="tel" min="1" max="5" placeholder="Avalie de 1 a 5">',
                title: 'Avalie esta boleia',
                scope: $scope,
                buttons: [
                    {
                        text: '<b>Avaliar</b>',
                        type: 'button-energized',
                        onTap: function(e) {
                            if (!$scope.data.rating && !$scope.data.message) {
                                $ionicPopup.alert({
                                    title: 'Avaliação',
                                    template: 'A avaliação só pode ser entre 1 e 5!'
                                });
                            } else {
                                if($scope.data.rating > 5 || $scope.data.rating < 1 || !$scope.data.rating){
                                    $ionicPopup.alert({
                                        title: 'Avaliação',
                                        template: 'A avaliação só pode ser entre 1 e 5!'
                                    });
                                }else{
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
                        }
                    },
                    {text: 'Cancelar'}
                ]
            });

        };

        $scope.removeNotification = function (index,notification) {

            $http.post(Server.url + 'api/profile/removeNotification',
    					{
    						'notificationID': notification._id
    					})
    					.success(function(data, status, headers, config) {

                $scope.notifications.splice(index, 1);

    						$ionicLoading.hide();
    					})
    					.error(function(data, status, headers, config) {
    						$ionicLoading.hide();
    					});
        };

        $scope.removeAllNotification = function () {

            while($scope.notifications.length > 0){
                $scope.removeNotification($scope.notifications.length - 1);
            }
            $http.get(Server.url + 'api/profile/removeNotifications')
            .success(function(data, status, headers, config) {

              $ionicLoading.hide();
            }).
            error(function(data, status, headers, config) {
              $ionicLoading.hide();
            });
        };



    });
