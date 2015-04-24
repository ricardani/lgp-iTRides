angular.module('iTRides.createRideControllers', [])

    .controller('CreateRideCtrl', function($scope, $ionicModal, $ionicLoading, $timeout, $http, Server) {

      $scope.selectedRideType = 0;
      $scope.collection = ["Casa>Trabalho", "Trabalho>Casa", "Ocasional"];

      $scope.itemClicked = function ($index) {
        $scope.selectedRideType = $index;
      };

      $scope.createRide = function (newRide) {

          var rideType = $scope.collection[$scope.selectedRideType];

          console.log(rideType);

          if(rideType == "Trabalho>Casa") {
              $http.post(Server.url + 'api/ride/createDR',
                      {
                        'seats': newRide.seats,
                        'time_start': newRide.hour,
                        'ride_type': rideType,
                        'type_cost': newRide.typeCost,
                        'cost': newRide.cost,
                        'date': newRide.date,
                        'locationName': newRide.locationName,
                        'destination' : {
                            "district": newRide.destinationDistrict,
                            "municipality": newRide.destinationMunicipality,
                            "street": newRide.destinationStreet,
                            "info": newRide.destinationLocationInfo
                        }
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

          }
          else if(rideType == "Casa>Trabalho") {
            $http.post(Server.url + 'api/ride/createDR',
                    {
                      'seats': newRide.seats,
                      'time_start': newRide.hour,
                      'ride_type': rideType,
                      'type_cost': newRide.typeCost,
                      'cost': newRide.cost,
                      'date': newRide.date,
                      'locationName': newRide.locationName,
                      'startLocation' : {
                          "district": newRide.startDistrict,
                          "municipality": newRide.startMunicipality,
                          "street": newRide.startStreet,
                          "info": newRide.startLocationInfo
                      }
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
          }
          else if(rideType == "Ocasional") {
              $http.post(Server.url + 'api/ride/createCR',
                  {
                    'seats': newRide.seats,
                    'time_start': newRide.hour,
                    'ride_type': rideType,
                    'type_cost': newRide.typeCost,
                    'cost': newRide.cost,
                    'date': newRide.date,
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
                          $ionicLoading.hide();
                      }
                  }).
                  error(function(data, status, headers, config) {
                      /* TODO caso dê erro */
                      $ionicLoading.hide();
                  });
          }
          else {
              /* TODO caso dê erro ao definir o tipo da boleia */
              $ionicLoading.hide();
          }

      };
    })

    .controller('CreateRideTypeCtrl', function($scope) {

    })

    .controller('CreateStartAddressCtrl', function($scope, $ionicSideMenuDelegate) {

    })

;
