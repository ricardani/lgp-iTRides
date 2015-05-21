angular.module('iTRides.listFeedbacksControllers', [])

    .controller('ListFeedbacksCtrl', function($scope, $window, $state, $http, $ionicLoading, Server) {

    /*    $http.get(Server.url + 'api/ride/getMyRequestedRides').
            success(function(data, status, headers, config) {
                $scope.requestedRides = data;
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
            });*/


        $scope.getNumberComplete = function(num) {
            return new Array(Math.floor(num));
        };

        $scope.getNumberEmpty = function(num) {
            return new Array(Math.floor(5-num));
        };

        $scope.feedbackList = [
        {
            rideID: '1',
            user: 'João Castro',
            startLocation: 'Braga',
            destination: 'Lisboa',
            date: '15/07/2014',
            stars:'4',
            message: 'Not bad at all'
        },{
            rideID: '2',
            user: 'Manuel Castro',
            startLocation: 'Braga',
            destination: 'Porto',
            date: '21/07/2014',
            stars:'2',
            message: 'Not so good'
        }

        ]
    })

;
