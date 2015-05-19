angular.module('iTRides.listDefaultRidesControllers', [])

    .controller('ListDefaultRidesCtrl', function($scope, $window, $state, $http, Server, $ionicLoading, $ionicPopup) {

        $http.get(Server.url + 'api/ride/getMyDefaultRides').
            success(function(data, status, headers, config) {
                $scope.defaultRides = data;
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


        $scope.createRide = function(rideInfo, start_date) {

            //Get nome do local de trabalho
            $http.post(Server.url + 'api/ride/getWorkLocation',
                {
                    '_workLocation': rideInfo._workLocation
                }
            )
                .success(function(data, status, headers, config) {

                    var time_start = new Date(start_date).setHours(new Date(rideInfo.date).getHours(),new Date(rideInfo.date).getMinutes());
                    $http.post(Server.url + 'api/ride/createRide',
                        {
                            '_owner': $window.sessionStorage.token,
                            'seats': rideInfo.seats,
                            'time_start': time_start,
                            'ride_type': rideInfo.ride_type,
                            'type_cost': rideInfo.typeCost,
                            'cost': rideInfo.cost,
                            'locationName': data.name,
                            'homeLocation' : rideInfo.homeLocation
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

                    $ionicLoading.hide();
                }).
                error(function(data, status, headers, config) {
                    /* TODO caso dê erro */
                    $ionicLoading.hide();
                });
        };

        $scope.checkIfInTheFuture = function(inputDate) { //TODO periodo aceitavel (issue: o inputDate esta no formato dd/mm e o today em mm/dd)

            var today = new Date();

            return today < inputDate;
        };

        $scope.showPopup = function(rideInfo) {
            //Mostra o popup inicial
            console.log(JSON.stringify(rideInfo));
            $scope.data = {};
            $scope.data.rideInfo = rideInfo;

            // An elaborate, custom popup
            var myPopup = $ionicPopup.show({
                template:
                    "<input type='text' placeholder='dd/mm/yyyy' ng-model='data.start_date'>",
                title: 'Defina a data do começo da boleia',
                scope: $scope,
                buttons: [
                    { text: 'Cancel' },
                    {
                        text: '<b>Criar Boleia</b>',
                        type: 'button-positive',
                        onTap: function(e) {
                            if(/^(0?[1-9]|[12][0-9]|3[01])\/(0?[1-9]|1[012])\/(199\d|[2-9]\d{3})$/.test($scope.data.start_date.toString())) {
                                if($scope.checkIfInTheFuture(new Date($scope.data.start_date)))
                                    return $scope.data.start_date;
                                else {
                                    $scope.data.start_date = '';
                                    e.preventDefault();
                                }
                            }
                            else {
                                $scope.data.start_date = 'wrongFormat';
                            }
                        }
                    }
                ]
            });
            myPopup.then(function(res) {

                // Caso o input do utilzador esteja num formato incorrecto
                if($scope.data.start_date === 'wrongFormat') {
                    $scope.data.start_date = '';
                    var errorPopup = $ionicPopup.show({
                        template:
                            "<input type='text' placeholder='dd/mm/yyyy' ng-model='data.start_date'><span style='color: red'>Formato da data incorreto </span>",
                        title: 'Defina a data do começo da boleia',
                        scope: $scope,
                        buttons: [
                            { text: 'Cancel' },
                            {
                                text: '<b>Criar boleia</b>',
                                type: 'button-positive',
                                onTap: function(e) {
                                    $scope.data.dateFormat = 'empty';
                                    if(/^(0?[1-9]|[12][0-9]|3[01])\/(0?[1-9]|1[012])\/(199\d|[2-9]\d{3})$/.test($scope.data.start_date.toString())) {
                                        if($scope.checkIfInTheFuture(new Date($scope.data.start_date)))
                                            return $scope.data.start_date;
                                        else {
                                            $scope.data.start_date = '';
                                            e.preventDefault();
                                        }
                                    }
                                    else {
                                        $scope.data.start_date = '';
                                        e.preventDefault();
                                    }
                                }
                            }
                        ]
                    });
                    errorPopup.then(function(res) {
                        $scope.createRide($scope.data.rideInfo,$scope.data.start_date);
                    });
                }
                else {
                    $scope.createRide($scope.data.rideInfo,$scope.data.start_date);
                }
            });
        };

    });
