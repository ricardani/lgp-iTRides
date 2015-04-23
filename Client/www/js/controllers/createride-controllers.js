angular.module('iTRides.createRideControllers', [])

    .controller('CreateRideCtrl', function($scope, $ionicModal, $timeout, $http, Server) {

        $scope.createRide = function (newRide) {

            if(newRide.type == "Trabalho->Casa") {
                $http.post(Server.url + 'api/ride/createDR',
                        { 'startLocation' : {
                            "location" : {
                              "district": newRide.startDistrict,
                              "municipality": newRide.startMunicipality,
                              "street": newRide.startStreet
                            },
                            "name": newRide.locationName
                        },
                        'destination' : {
                          "location" : {
                            "district": newRide.destinationDistrict,
                            "municipality": newRide.destinationMunicipality,
                            "street": newRide.destinationStreet
                          },
                          "name": newRide.destinationName
                        },
                        'ride_type': newRide.type,
                        'time_start': newRide.hour}
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
                    { 'startLocation' : { "district": newRide.startDistrict,
                        "municipality": newRide.startMunicipality,
                        "street": newRide.startStreet
                    },
                        'destination' : { "district": newRide.destinationDistrict,
                            "municipality": newRide.destinationMunicipality,
                            "street": newRide.destinationStreet
                        },
                        'ride_type': newRide.type,
                        'time_start': newRide.hour}
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
