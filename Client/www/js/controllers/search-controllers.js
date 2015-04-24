angular.module('iTRides.searchControllers', [])

.controller('SearchCtrl', function($scope, $filter) {
	$scope.selectedRideType = 0;
	$scope.startDistrito = '';
	$scope.startConcelho = '';
	$scope.dateSelected='';
  $scope.dateFilter='';

	$scope.dateChange=function(val){
    $scope.dateSelected = val.toString();
    $scope.month = $scope.dateSelected.substr(4,3);
    $scope.day = $scope.dateSelected.substr(8,2);
    $scope.year = $scope.dateSelected.substr(11,4);
    $scope.dateFilter = $scope.month + " " + $scope.day + " " + $scope.year;
   
   /* console.log("date: ", $scope.dateSelected);
    console.log("filtered: ", $scope.dateFilter);
    console.log("Dia: " + $scope.day );
    console.log("Mes: " + $scope.month );
    console.log("Ano: " + $scope.year );
*/

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



  $scope.dates = [{ date: 'Apr 24 2015'}, { date: 'Apr 24 2015'} , { date: 'Apr 20 2015'},
  { date: 'Apr 20 2012'},{ date: 'Jan 12 1999'}];

    })




.controller('RideTypeCtrl', function($scope) {

})

.controller('StartAddressCtrl', function($scope, $ionicSideMenuDelegate) {

})
;
