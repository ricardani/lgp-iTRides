angular.module('iTRides.searchControllers', [])

    .controller('SearchCtrl', function($scope, $filter, $window, $ionicModal, $ionicLoading, $timeout, $http, Server) {
        $scope.hasDate = false;
        $scope.hasDistrict = false;
        $scope.hasMunicipality = false;
        $scope.hasWorkLocation = false;
        $scope.seeCounter = true;
        $scope.selectedRideType = -1;
        $scope.collection = ["Casa>Trabalho", "Trabalho>Casa", "Ocasional"];
        $scope.district = 'Distrito';
        $scope.municipality = 'Concelho';
        $scope.workLocation = 'Local de Trabalho';
        $scope.ocasionalStart = 'Local de Partida';
        $scope.ocasionalEnd = 'Local de Chegada';
        $scope.resultRides = [];

        var resetSearch = function(){
            $scope.district = 'Distrito';
            $scope.municipality = 'Concelho';
            $scope.workLocation = 'Local de Trabalho';
            $scope.ocasionalStart = 'Local de Partida';
            $scope.ocasionalEnd = 'Local de Chegada';
            $scope.hasDistrict = false;
            $scope.hasMunicipality = false;
            $scope.hasWorkLocation = false;
        };

        var reloadResuts = function(array){
            $scope.resultRides = array;
        };

        $scope.dateChange = function(val){
            var searchDate = new Date(val.toString());

            if(searchDate >= Date.now()){
                $http.get(Server.url + 'api/ride/getRideForDay',  {
                    params: {searchDate : searchDate}
                }).
                    success(function(data, status, headers, config) {
                        $scope.allRides = data;
                        $scope.hasDate = true;
                        resetSearch();
                        reloadResuts($scope.allRides);
                        $ionicLoading.hide();
                    }).
                    error(function(data, status, headers, config) {
                        console.log(data);
                        if(status === 401){
                            delete window.sessionStorage.token;
                            localStorage.removeItem('SessionToken');
                            $state.go('login');
                        }
                        $ionicLoading.hide();
                        $state.go('home');
                    });
            }else
            {
                $scope.hasDate=false;
            }


        };

        $scope.showResults = function() {
            $scope.seeResults = true;
            $scope.seeCounter = false;
        };

        $scope.hideResults = function() {
            $scope.seeResults = false;
            $scope.seeCounter = true;
        };

        $scope.itemClicked = function (index) {
            $scope.selectedRideType = index;
            switch(index){
                case 0:
                    $scope.filteredRides = $filter('filter')($scope.allRides, {rideType : "CT"});
                    break;
                case 1:
                    $scope.filteredRides = $filter('filter')($scope.allRides, {rideType : "TC"});
                    break;
                case 2:
                    $scope.filteredRides = $filter('filter')($scope.allRides, {rideType : "Ocasional"});
                    break;
            }
            resetSearch();
            reloadResuts($scope.filteredRides);
        };

        $scope.workLocationSelected = function(workLocation) {

            $scope.workLocation = workLocation;

            $scope.hasWorkLocation = true;

            if($scope.hasMunicipality){
                $scope.filteredRidesWithWorkLocation = $filter('filter')($scope.filteredRides, {district : $scope.district, municipality : $scope.municipality, workLocation : $scope.workLocation});
            }else if($scope.hasDistrict){
                $scope.filteredRidesWithWorkLocation = $filter('filter')($scope.filteredRides, {district : $scope.district, workLocation : $scope.workLocation});
            }else{
                $scope.filteredRidesWithWorkLocation = $filter('filter')($scope.filteredRides, {workLocation : $scope.workLocation});
            }

            reloadResuts($scope.filteredRidesWithWorkLocation);

            $scope.modalWorkLocation.hide();
        };

        $scope.districtSelected = function(district) {

            $scope.district = district;
            $scope.municipality = 'Concelho';

            $scope.hasDistrict = true;
            $scope.hasMunicipality = false;

            if($scope.hasWorkLocation){
                $scope.filteredRidesWithDistrict = $filter('filter')($scope.filteredRides, {district : $scope.district, workLocation : $scope.workLocation});
            }else{
                $scope.filteredRidesWithDistrict = $filter('filter')($scope.filteredRides, {district : $scope.district});
            }

            reloadResuts($scope.filteredRidesWithDistrict);

            $scope.modalDistrict.hide();
        };

        $scope.municipalitySelected = function(municipality) {

            $scope.municipality = municipality;

            $scope.hasMunicipality = true;

            if($scope.hasWorkLocation){
                $scope.filteredRidesWithMunicipality = $filter('filter')($scope.filteredRides, {district : $scope.district, municipality : $scope.municipality, workLocation : $scope.workLocation});
            }else{
                $scope.filteredRidesWithMunicipality = $filter('filter')($scope.filteredRides, {district : $scope.district, municipality : $scope.municipality});
            }

            reloadResuts($scope.filteredRidesWithMunicipality);

            $scope.modalMunicipality.hide();
        };

        $scope.startOcasionalSelected = function(start) {
            $scope.ocasionalStart = start;

            $scope.resultRides = $filter('filter')($scope.filteredRides, {startLocation : $scope.ocasionalStart});

            $scope.modalStartOcasional.hide();
        };

        $scope.endOcasionalSelected = function(end) {
            $scope.ocasionalEnd = end;

            $scope.resultRides = $filter('filter')($scope.filteredRides, {destination : $scope.ocasionalEnd});

            $scope.modalEndOcasional.hide();
        };


        /*--------------------- Modals ---------------------*/
        $ionicModal.fromTemplateUrl('districts.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function(modalD) {
            $scope.modalDistrict = modalD;
        });

        $ionicModal.fromTemplateUrl('municipalities.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function(modalM) {
            $scope.modalMunicipality = modalM;
        });

        $ionicModal.fromTemplateUrl('workLocations.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function(modalWL) {
            $scope.modalWorkLocation = modalWL;
        });

        $ionicModal.fromTemplateUrl('startOcasional.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function(modalWL) {
            $scope.modalStartOcasional = modalWL;
        });

        $ionicModal.fromTemplateUrl('endOcasional.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function(modalWL) {
            $scope.modalEndOcasional = modalWL;
        });

        $scope.showModalDistrict = function() {
            $scope.modalDistrict.show();
        };

        $scope.showModalMunicipality = function() {
            $scope.modalMunicipality.show();
        };

        $scope.showModalWorkLocation = function() {
            $scope.modalWorkLocation.show();
        };

        $scope.showModalStartOcasional = function() {
            $scope.modalStartOcasional.show();
        };

        $scope.showModalEndOcasional = function() {
            $scope.modalEndOcasional.show();
        };

        //Cleanup the modal when we're done with it!
        $scope.$on('$destroy', function() {
            $scope.modalDistrict.remove();
            $scope.modalMunicipality.remove();
            //    $scope.modalStreet.remove();
            //    $scope.modalInfo.remove();
            $scope.modalWorkLocation.remove();
        });
        // Execute action on hide modal
        $scope.$on('modal.hidden', function() {
            // Execute action
        });
        // Execute action on remove modal
        $scope.$on('modal.removed', function() {
            // Execute action
        });

        /*--------------------------------------------------*/

    })

;
