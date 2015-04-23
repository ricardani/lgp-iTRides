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


	$scope.rides = [{
		    id: 0,
            name: 'Ben Sparrow',
            seats:'2',
            time_start: "8:00",
  			ride_type: "Ocasional",
  			type_cost: "Custo total",
  			cost: 30,
  			name: "Boleia fixe",
  			startLocation: "Antas",
  			destination: "Matosinhos"
        },
        {
		    id: 1,
            name: 'Paulo Silva',
            seats:'4',
            time_start: "18:00",
  			ride_type: "Casa->trabalho",
  			type_cost: "Por pessoa",
  			cost: 10,
  			name: "Vamos trabalhar",
  			startLocation: "Azambuja",
  			destination: "ItGrow Porto"
        }];

    })

 	

.controller('RideTypeCtrl', function($scope) {
	
})

.controller('StartAddressCtrl', function($scope, $ionicSideMenuDelegate) {

})
;
