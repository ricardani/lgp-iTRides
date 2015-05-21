angular.module('iTRides.rideDetailsControllers', [])

    .controller('RideDetailsCtrl', function($scope, $ionicLoading, $ionicPopup, $timeout, $state, $stateParams, Server, $http, $cordovaCalendar) {

        $scope.goBack = $stateParams.backState;

        $http.get(Server.url + 'api/ride/getRide',  {
            params: {rideID : $stateParams.rideID}
        }).
            success(function(data, status, headers, config) {
                $scope.ride = data;

                if(data === null || data === undefined){
                    $scope.rideNotAvailable = true;
                }else{
                    $scope.rideNotAvailable = !$scope.ride.id;
                }

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
		
		$http.get(Server.url + 'api/profile/getProfileInfo').
            success(function(data1, status, headers, config) {
                $scope.user = data1;
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

        $scope.deleteRide = function() {
            if($scope.ride.myStatus === 'myRide') {
				
				//VERIFICAR SE ESTA A ELIMINAR 24H ANTES
				var now = new Date();
				var rideDate = new Date($scope.ride.date);
				var horas = ((rideDate-now)/1000)/3600;
				
				if(horas>24) {
					var confirmPopup = $ionicPopup.confirm({
						title: 'Apagar boleia',
						template: 'Confirme o seu pedido'
					});
				}
				else if(horas<=24) {
					var confirmPopup = $ionicPopup.confirm({
						title: 'Faltam menos de 24h',
						template: 'Ao apagar boleia será penalizado na sua classificação'
					});
				}				
                
                confirmPopup.then(function(res) {
                    if(res) {
                        $http.post(Server.url + 'api/ride/deleteRide',
                            {
                                'rideID': $stateParams.rideID
                            }
                        )
                            .success(function(data, status, headers, config) {
                                if(data){
									if(horas<=24){
										/*ACTUALIZAR O FEEDBACK*/
										var new_penalties = $scope.user.penalties + 1;
										$http.post(Server.url + 'api/profile/updatePenalties',
										{
											'penalties': new_penalties
										})
										.success(function(data, status, headers, config) {
											/*if(data) 
												$state.go('home');*/
											$ionicLoading.hide();
										})
										.error(function(data, status, headers, config) {
											/*console.log("Error updating feedaverage " + status);*/
											$ionicLoading.hide();
										});
									}
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
