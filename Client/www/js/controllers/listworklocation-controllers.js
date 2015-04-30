angular.module('iTRides.listWorkLocationControllers', [])

.controller('ListWorkLocationCtrl', function($scope, $http, $ionicLoading, $window, $state, Server) {

  $http.get(Server.url + 'api/admin/getWorkLocations').
      success(function(data, status, headers, config) {
          $scope.workLocations = data;
          $ionicLoading.hide();
      }).
      error(function(data, status, headers, config) {
          console.log(JSON.stringify(data));
          $ionicLoading.hide();
      });

  $scope.removeWorkLocation = function (index) {
      $http.post(Server.url + 'api/ride/deleteWorkLocation', {
        "workLocationName": $scope.workLocations[index].name
      }).
          success(function(data, status, headers, config) {
              $scope.workLocations.splice(index, 1);
              $ionicLoading.hide();
          }).
          error(function(data, status, headers, config) {
              console.log(JSON.stringify(data));
              $ionicLoading.hide();
          });
  };
})
