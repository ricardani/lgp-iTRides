angular.module('iTRides.listWorkLocationControllers', [])

    .controller('ListWorkLocationCtrl', function($scope, $http, $ionicLoading, $window, $state, Server, $ionicPopup) {

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
            $http.post(Server.url + 'api/admin/deleteWorkLocation', {
                "workLocationID": $scope.workLocations[index].id
            }).
                success(function(data, status, headers, config) {
                    $scope.workLocations.splice(index, 1);
                    $ionicLoading.hide();
                    $ionicPopup.alert({
                        title: 'Local de trabalho',
                        template: 'O local de trabalho foi elimindado com sucesso!'
                    });
                }).
                error(function(data, status, headers, config) {
                    console.log(JSON.stringify(data));
                    $ionicLoading.hide();
                    $ionicPopup.alert({
                        title: 'Local de trabalho',
                        template: 'Ocorreu um erro a eliminar o local de trabalho!'
                    });
                });
        };
    })
;
