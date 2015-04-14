angular.module('iTRides.searchControllers', [])

.controller('SearchCtrl', function($scope) {
	$scope.selectedRideType = 0;
	$scope.startDistrito = '';
	$scope.startConcelho = '';
	$scope.startFreguesia = '';
})

.controller('RideTypeCtrl', function($scope) {
	$scope.collection = ["Casa>Trabalho", "Trabalho>Casa", "Ocasional"];

	$scope.itemClicked = function ($index) {
		$scope.selectedRideType = $index;
	};
})

.controller('StartAddressCtrl', function($scope, $ionicSideMenuDelegate) {

})
;
