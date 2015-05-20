angular.module('iTRides.rideDetailsControllers', [])

    .controller('RideDetailsCtrl', function($scope, $ionicLoading, $ionicPopup, $timeout, $state, $stateParams, Server, $http, $cordovaCalendar) {
        $http.get(Server.url + 'api/ride/getRide',  {
            params: {rideID : $stateParams.rideID}
        }).
            success(function(data, status, headers, config) {
                $scope.ride = data;

                $scope.rideNotAvailable = !$scope.ride.id;

                $ionicLoading.hide();
            }).
            error(function(data, status, headers, config) {
                console.log(data);
                if(status === 401){
                    delete window.sessionStorage.token;
                    localStorage.removeItem('SessionToken');
                    $state.go('login');
                }
                $state.go('home');
                $ionicLoading.hide();
            });

        $scope.deleteRide = function() {
            if($scope.ride.myStatus === 'myRide') {
                var confirmPopup = $ionicPopup.confirm({
                    title: 'Apagar boleia',
                    template: 'Confirme o seu pedido'
                });
                confirmPopup.then(function(res) {
                    if(res) {
                        $http.post(Server.url + 'api/ride/deleteRide',
                            {
                                'rideID': $stateParams.rideID
                            }
                        )
                            .success(function(data, status, headers, config) {
                                if(data){
                                    var alertPopup = $ionicPopup.alert({
                                        title: 'Apagar boleia',
                                        template: 'A sua boleia foi apagada com sucesso'
                                    });
                                    alertPopup.then(function(res) {
                                    });
                                    /* TODO caso funcione */
                                    $state.go('home');
                                    $ionicLoading.hide();
                                }
                            }).
                            error(function(data, status, headers, config) {
                                /* TODO caso dê erro */
                                $ionicLoading.hide();
                            });
                    } else {

                    }
                    $ionicLoading.hide();
                });
            }
        };

        $scope.removeRideRequest = function() {
            if($scope.ride.myStatus === 'myRequest') {

                var confirmPopup = $ionicPopup.confirm({
                    title: 'Cancelar pedido de boleia',
                    template: 'Confirme o seu pedido'
                });
                confirmPopup.then(function(res) {
                    if(res) {
                        $http.post(Server.url + 'api/ride/deleteRequestedRide',
                            {
                                'rideID': $stateParams.rideID
                            }
                        )
                            .success(function(data, status, headers, config) {
                                if(data){
                                    var alertPopup = $ionicPopup.alert({
                                        title: 'Cancelar pedido de boleia',
                                        template: 'O seu pedido foi cancelado com sucesso'
                                    });
                                    alertPopup.then(function(res) {
                                    });
                                    /* TODO caso funcione */
                                    $state.go('home');
                                    $ionicLoading.hide();
                                }
                            }).
                            error(function(data, status, headers, config) {
                                /* TODO caso dê erro */
                                $ionicLoading.hide();
                            });
                    } else {

                    }
                    $ionicLoading.hide();
                });
            }
        };

        $scope.requestRide = function() {
            if($scope.ride.myStatus === 'other') {

                var confirmPopup = $ionicPopup.confirm({
                    title: 'Solicitar boleia',
                    template: 'Confirme o seu pedido'
                });
                confirmPopup.then(function(res) {
                    if(res) {

                        $http.post(Server.url + 'api/ride/requestRide',
                            {
                                'rideID': $stateParams.rideID
                            }
                        )
                            .success(function(data, status, headers, config) {
                                if(data){

                                    var alertPopup = $ionicPopup.alert({
                                        title: 'Solicitar boleia',
                                        template: 'O seu pedido foi aceite'
                                    });
                                    alertPopup.then(function(res) {
                                    });
                                    /* TODO caso funcione */
                                    $state.go('home');
                                    $ionicLoading.hide();
                                }
                            }).
                            error(function(data, status, headers, config) {
                                /* TODO caso dê erro */
                                $ionicLoading.hide();
                            });
                    }
                    else {

                    }
                });
            }
        };

        $scope.addToCalendar = function(){
            var rideDate = new Date(Date.parse($scope.ride.date));
            rideDate.setMinutes(rideDate.getMinutes() - 15);
            var startDate = {
                year : rideDate.getFullYear(),
                month : rideDate.getMonth(),
                day : rideDate.getDate(),
                hour : rideDate.getHours(),
                minutes : rideDate.getMinutes()
            };
            rideDate.setMinutes(rideDate.getMinutes() + 60);
            var endDate = {
                year : rideDate.getFullYear(),
                month : rideDate.getMonth(),
                day : rideDate.getDate(),
                hour : rideDate.getHours(),
                minutes : rideDate.getMinutes()
            };

            $cordovaCalendar.createEvent({
                title: 'Boleia de ' + $scope.ride.ownerName,
                location: $scope.ride.startLocation,
                notes: 'Não te atrases!',
                startDate: new Date(startDate.year, startDate.month, startDate.day, startDate.hour, startDate.minutes, 0, 0, 0),
                endDate: new Date(endDate.year, endDate.month, endDate.day, endDate.hour, endDate.minutes, 0, 0, 0)
            }).then(function (result) {
                console.log("Event created successfully");
                $ionicPopup.alert({
                    title: 'Adicionar Boleia ao Calendario',
                    template: 'Boleia adicionada ao calendario com sucesso'
                });
            }, function (err) {
                $ionicPopup.alert({
                    title: 'Adicionar Boleia ao Calendario',
                    template: 'Ocorreu um Erro! Tente mais tarde.'
                });
            });
        };

    })

;
