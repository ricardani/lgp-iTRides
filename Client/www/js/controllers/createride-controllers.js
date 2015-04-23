angular.module('iTRides.createRideControllers', [])

    .controller('CreateRideCtrl', function($scope, $ionicModal, $timeout, $http, Server) {

        $scope.createRide = function (newRide) {

            if(newRide.type == "Trabalho->Casa") {
                $http.post(Server.url + 'api/ride/createDR',
                        {
                          'owner_email': newRide.ownerEmail,
                          'rideName': newRide.rideName
                        }
                ).
                    success(function(data, status, headers, config) {
                        if(data){
                            /* TODO caso funcione */
                        }
                    }).
                    error(function(data, status, headers, config) {
                        /* TODO caso dê erro */
                    });

            }
            else if(newRide.type == "Ocasional") {
                $http.post(Server.url + 'api/ride/createCR',
                    {
                      //TODO '_owner': < ID do user actual>,

                      'seats': newRide.seats,
                      'time_start': newRide.hour,
                      'ride_type': newRide.rideType,
                      'type_cost': newRide.typeCost,
                      'cost': newRide.cost,
                      'date': newRide.startingDate,
                      'startLocation' : {
                        "district": newRide.startDistrict,
                        "municipality": newRide.startMunicipality,
                        "street": newRide.startStreet,
                        "info": newRide.startLocationInfo
                      },
                      'destination' : {
                          "district": newRide.destinationDistrict,
                          "municipality": newRide.destinationMunicipality,
                          "street": newRide.destinationStreet,
                          "info": newRide.destinationInfo
                      }
                    }
                ).
                    success(function(data, status, headers, config) {
                        if(data){
                            /* TODO caso funcione */
                        }
                    }).
                    error(function(data, status, headers, config) {
                        /* TODO caso dê erro */
                    });
            }
            else {
                /* TODO caso dê erro ao definir o tipo da boleia */
            }

        };
    })

;
