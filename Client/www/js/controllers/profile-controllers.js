angular.module('iTRides.profileControllers', [])



.controller('ProfileCtrl', function($scope,$http,$ionicLoading,$ionicPopup, $timeout, Server, $window, $state) {

    $http.get(Server.url + 'api/profile/getProfileInfo').
        success(function(data, status, headers, config) {
            $scope.user = data;
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

		$scope.getNumberComplete = function(num) {
			return new Array(Math.floor(num));
		};

		$scope.getNumberEmpty = function(num) {
			return new Array(Math.floor(5-num));
		};

		$scope.getNumberHalf = function(num) {
			if(num % 1 === 0){
				//é inteiro
				return new Array(0);
			}
			else
			{
				//é float
				return new Array(1);
			}
		};

         $scope.showConfirm = function() {
           var confirmPopup = $ionicPopup.confirm({
             title: 'Consume Ice Cream',
             template: 'Are you sure you want to eat this ice cream?'
           });
           confirmPopup.then(function(res) {
             if(res) {
               console.log('You are sure');
             } else {
               console.log('You are not sure');
             }
           });
         };


    $scope.logout = function () {
        localStorage.removeItem('SessionToken');
        delete $window.sessionStorage.token;
        $state.go('login');
    };

})
