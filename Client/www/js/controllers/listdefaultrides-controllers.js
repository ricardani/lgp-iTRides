angular.module('iTRides.listDefaultRidesControllers', [])

    .controller('ListDefaultRidesCtrl', function($scope, $window, $state, $location, $http, Server, $ionicLoading, $ionicPopup) {

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
                            console.log(JSON.stringify(data));
                            $ionicLoading.hide();
                        }
                    }).
                    error(function(data, status, headers, config) {
                        console.log("ERRO2: " + rideInfo);
                        $ionicLoading.hide();
                    });

                    $ionicLoading.hide();
                }).
                error(function(data, status, headers, config) {
                    console.log('ERRO: ' + rideInfo);
                    $ionicLoading.hide();
                });
        };

        $scope.checkIfInTheFuture = function(inputDate) { //TODO periodo aceitavel (issue: o inputDate esta no formato dd/mm e o today em mm/dd)

            var today = new Date();

            return today < inputDate;
        };

        $scope.showPopup = function(rideInfo) {
            //Mostra o popup inicial

            var wantToCreate = false;

            var canceled = false;
            $scope.data = {};
            $scope.data.rideInfo = rideInfo;

            // An elaborate, custom popup

            var choosePopup = $ionicPopup.show({
              template:
                  "Deseja criar uma boleia com esta informação?",
              title: 'Boleia pré-definida',
              scope: $scope,
              buttons: [
                  { text: 'Cancelar',
                    type: 'button-energized'
                  },
                  {
                      text: 'Criar Boleia',
                      type: 'button-energized',
                      onTap: function(e) {
                        wantToCreate = true;
                      }
                  }
              ]
            });
            choosePopup.then(function(res) {
              if(wantToCreate) {
                var myPopup = $ionicPopup.show({
                    template:
                        "<input type='date' ng-model='data.start_date'>",
                    title: 'Defina a data do começo da boleia',
                    scope: $scope,
                    buttons: [
                        { text: 'Cancelar',
                          onTap: function(e) {
                            canceled = true;
                          }
                        },
                        {
                            text: '<b>Criar Boleia</b>',
                            type: 'button-energized',
                            onTap: function(e) {
                              if($scope.checkIfInTheFuture(new Date($scope.data.start_date)))
                                  return $scope.data.start_date;
                              else {
                                  $scope.data.start_date = '';
                                  e.preventDefault();
                              }
                            }
                        }
                    ]
                });
                myPopup.then(function(res) {

                  if(!canceled) {
                    var alertPopup = $ionicPopup.alert({
                      title: 'Boleia pré-definida',
                      template: 'Boleia pré-definida foi criada com sucesso!'
                    });
                    $scope.createRide($scope.data.rideInfo,$scope.data.start_date);
                  }
                });
              }
              else {

              }
            });

        }

        $scope.showPopupEdit = function(rideInfo) {

          console.log(rideInfo);

          var wantToEdit = false;

          var canceled = false;
          $scope.data = {};
          $scope.data.rideInfo = rideInfo;

          // An elaborate, custom popup

          var choosePopup = $ionicPopup.show({
            template:
                "Deseja editar esta boleia pré-definida?",
            title: 'Editar Boleia pré-definida',
            scope: $scope,
            buttons: [
                { text: 'Cancelar',
                  type: 'button-energized'
                },
                { text: 'Editar Boleia',
                  type: 'button-energized',
                  onTap: function(e) {
                    wantToEdit = true;
                  }
                }
            ]
          });
          choosePopup.then(function(res) {
            if(wantToEdit){
              $location.path('editRide/' + rideInfo._id +'/rideInfo');
            }
            else {

            }
          });
        }

        $scope.showPopupEliminate = function(rideInfo) {

          console.log(rideInfo);

          var wantToDelete = false;

          var canceled = false;
          $scope.data = {};
          $scope.data.rideInfo = rideInfo;

          // An elaborate, custom popup

          var choosePopup = $ionicPopup.show({
            template:
                "Deseja eliminar esta boleia pré-definida?",
            title: 'Eliminar Boleia pré-definida',
            scope: $scope,
            buttons: [
                { text: 'Cancelar',
                  type: 'button-energized'
                },
                { text: 'Eliminar',
                  type: 'button-energized',
                  onTap: function(e) {
                    wantToDelete = true;
                  }
                }
            ]
          });
          choosePopup.then(function(res) {
            if(wantToDelete) {
              $http.post(Server.url + 'api/ride/deleteDefaultRide',
              {
                'rideID': rideInfo._id
              })
              .success(function(data, status, headers, config) {
                if(data){
                  var alertPopup = $ionicPopup.alert({
                    title: 'Boleia pré-definida',
                    template: 'Boleia pré-definida foi eliminada com sucesso!'
                  });
                  $state.go('profile');
                  $ionicLoading.hide();
                }
              }).
              error(function(data, status, headers, config) {
                var alertPopup = $ionicPopup.alert({
                  title: 'Boleia pré-definida',
                  template: 'Ocorreu um erro ao eliminar a boleia pré-definida'
                });
                $ionicLoading.hide();
              });
            }
            else {

            }
          });
        };

    });
