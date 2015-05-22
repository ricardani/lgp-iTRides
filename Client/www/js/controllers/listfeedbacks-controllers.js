angular.module('iTRides.listFeedbacksControllers', [])

    .controller('ListFeedbacksCtrl', function($scope, $window, $state, $http, $ionicLoading, Server) {

        $http.get(Server.url + 'api/profile/getUserFeedback').
            success(function(data, status, headers, config) {
                $scope.feedbackList = data;
                $ionicLoading.hide();
            }).
            error(function(data, status, headers, config) {
                console.log(JSON.stringify(data));
                if(status === 401){
                    delete window.sessionStorage.token;
                    localStorage.removeItem('SessionToken');
                    $state.go('login');
                }
                $ionicLoading.hide();
            });


        $scope.getNumberComplete = function(num) {
            return new Array(Math.floor(num));
        };

        $scope.getNumberEmpty = function(num) {
            return new Array(Math.floor(5-num));
        };
    })

;
