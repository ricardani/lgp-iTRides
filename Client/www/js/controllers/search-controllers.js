angular.module('iTRides.searchControllers', [])

.controller('SearchCtrl', function($scope) {
	$scope.selectedRideType = 0;
	$scope.startDistrito = '';
	$scope.startConcelho = '';

	
	$scope.date='';

	$scope.dateChange=function(val){
	console.log("on-change",val);
   };

	$scope.collection = ["Casa>Trabalho", "Trabalho>Casa", "Ocasional"];

	$scope.itemClicked = function ($index) {
		$scope.selectedRideType = $index;
	};


})

 	

.controller('RideTypeCtrl', function($scope) {
	
})

.controller('StartAddressCtrl', function($scope, $ionicSideMenuDelegate) {

})
;
