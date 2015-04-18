angular.module('iTRides.createRideControllers', [])

.controller('CreateRideCtrl', function($scope, $ionicModal, $timeout, $http) {

  $scope.createRide = function (newRide) {

    if(newRide.type == "Trabalho->Casa") {
      $http.post('http://localhost:8080/api/ride/createDR',
          { 'startLocation' : [{ "district": newRide.startDistrict,
                                  "municipality": newRide.startMunicipality,
                                  "street": newRide.startStreet
                               }],
            'destination' : [{ "district": newRide.destinationDistrict,
                               "municipality": newRide.destinationMunicipality,
                               "street": newRide.destinationStreet
                            }],
            'ride_type': newRide.type,
            'time_start': newRide.hour}
        ).
        success(function(data, status, headers, config) {
          if(data)
          /* TODO caso funcione */
        }).
        error(function(data, status, headers, config) {
          /* TODO caso dê erro */
      });

    }
    else if(newRide.type == "Ocasional") {
      $http.post('http://localhost:8080/api/ride/createCR',
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
          if(data)
          /* TODO caso funcione */
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
