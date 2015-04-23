angular.module('iTRides.profileControllers', [])



.controller('ProfileCtrl', function($scope, $window, $state) {

        $scope.user = {
            name: 'Raquel Gomes', photo: 'https://lh3.googleusercontent.com/-IYWkoctkgdo/AAAAAAAAAAI/AAAAAAAAAAA/v3okpkLGc_4/s46-c-k-no/photo.jpg', email: 'raquel_gomes@itgrow.com', contact: '913 637 973', rating: 3
        };

        $scope.defaultRides = [{
        	id:0,
        	name: 'Trabalho',
        	day: 'Segunda Feira',
        	start_time: '07:30'
        }, {
        	id:1,
        	name: 'Casa',
        	day: 'Segunda Feira',
        	start_time: '18:30'
        }, {
        	id:2,
        	name: 'Trabalho',
        	day: 'Terça Feira',
        	start_time: '08:00'
        }];

        $scope.number = 5-$scope.user.rating;
		$scope.getNumber = function(num) {
		    return new Array(num);   
		}

        $scope.logout = function () {
            delete $window.sessionStorage.token;
            $state.go('loading');
        };

})
