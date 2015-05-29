angular.module('iTRides.userInfoControllers', [])

	.controller('UserProfileCtrl', function($scope, $http, $ionicLoading, $timeout, Server, $stateParams, $window, $state, Upload, $ionicModal) {

    $scope.rideMessages = [];

		$http.post(Server.url + 'api/profile/getUserInfo', {
      'userID': $stateParams.userID
    }).
			success(function(data, status, headers, config) {
				$scope.user = data;

        //Obtem, no maximo, 10 feedbacks das boleias criadas pelo user
        for(var i=0, j=0; i < $scope.user.requestedUserRides.length && j < 10; i++) {
          var ride = $scope.user.requestedUserRides[i];
          for(var rideFeedbacks=0; rideFeedbacks < ride.feedback.length; rideFeedbacks++) {
            $scope.rideMessages.push(ride.feedback[rideFeedbacks]);
            j++;
          }
        }
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

    $ionicModal.fromTemplateUrl('rideFeedback.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modalF) {
        $scope.modalFeedback = modalF;
    });

    $scope.hideRideFeedbackModal = function() {
      $scope.modalFeedback.hide();
    }

    $scope.seeRideFeedback = function() {
      $scope.modalFeedback.show();
    }

    $scope.getNumberComplete = function(num) {
			if(num < 0)
				return new Array(Math.floor(0));
			else
      	return new Array(Math.floor(num));
    };

    $scope.getNumberEmpty = function(num) {
			if(num < 0)
				return new Array(Math.floor(5));
			else
        return new Array(Math.floor(5-num));
    };

    $scope.getNumberHalf = function(num) {
				if(num < 0) {
					return new Array(0);
				}
        else if(num % 1 === 0){
            //é inteiro
            return new Array(0);
        }
        else
        {
            //é float
            return new Array(1);
        }
    };

	});
