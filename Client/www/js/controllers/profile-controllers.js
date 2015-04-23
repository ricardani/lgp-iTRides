angular.module('iTRides.profileControllers', [])



.controller('ProfileCtrl', function($scope, $window, $state) {

        $scope.user = {
            name: 'Raquel Gomes', photo: 'https://lh3.googleusercontent.com/-IYWkoctkgdo/AAAAAAAAAAI/AAAAAAAAAAA/v3okpkLGc_4/s46-c-k-no/photo.jpg', email: 'raquel_gomes@itgrow.com', contact: '913 637 973', rating: 3
        };

        $scope.defaultRides = [];

        $scope.number = 5-$scope.user.rating;
		$scope.getNumber = function(num) {
		    return new Array(num);   
		}

        $scope.logout = function () {
            delete $window.sessionStorage.token;
            $state.go('loading');
        };

})
