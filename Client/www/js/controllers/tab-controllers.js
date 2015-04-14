angular.module('iTRides.tabControllers', [])

.controller('TabCtrl', function($scope) {
	$scope.tabSelected ="home";
})

.controller('TabSelectionCtrl', function($scope) {
	$scope.collection = ["Home", "Profile", "Search"];

	$scope.itemClicked = function ($index) {
		$scope.tabSelected = $index;
	};
})
;
