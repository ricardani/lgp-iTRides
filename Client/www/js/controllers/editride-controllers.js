angular.module('iTRides.editRideControllers', [])

    .controller('EditRideCtrl', function($scope, $state, $window, $ionicModal, $ionicLoading, $timeout, $stateParams, $http, Server, $ionicPopup) {

        $scope.costTypeOptions = [
            { id: 'Pago pela empresa', name: 'Pago pela empresa', value: 'Pago pela empresa' },
            { id: 'Pagar ao condutor', name: 'Pagar ao condutor', value: 'Pagar ao condutor' }
        ];
        $scope.ride = {};

        $scope.editType = $stateParams.editType;

        $scope.selectedRideType = 0;
        $scope.collection = ["Casa>Trabalho", "Trabalho>Casa", "Ocasional"];
        $scope.district = 'Distrito';
        $scope.districtValidation = "";
        $scope.changeDistrict = false;
        $scope.municipality = 'Concelho';
        $scope.municipalityValidation = "";

        $scope.districts = ["Aveiro","Beja","Braga","Bragança","Castelo Branco",
            "Coimbra","Évora","Faro","Guarda","Leiria","Lisboa",
            "Portalegre","Porto","Santarém","Setúbal","Viana do Castelo",
            "Vila Real","Viseu", "Angra do heroísmo", "Horta",
            "Ponta Delgada", "Funchal"];
        $scope.municipalities = [];
        $scope.streets = [];

        $scope.workLocation = "Local de trabalho";
        $scope.workLocationValidation = "";
        $scope.workLocations = [];

        /*Occasional Ride variable */
        $scope.occasional= {"startAddress": "", "startIdentifier": "", "destinationAddress": "", "destinationIdentifier": ""};

        if($scope.editType === 'ride') {
          $http.get(Server.url + "api/ride/getRideToEdit", {
              params: {rideID : $stateParams.rideID}
          })
          .success(function(data, status, headers, config) {
              if(data == null) {
                  console.log('Não exite boleia com esse id');
              }
              else {
                  $scope.ride = data;
                  var startDate = new Date(data.time_start);

                  $scope.ride.date = startDate;
                  $scope.ride.hour = startDate;

                  if($scope.ride.ride_type == 'CT' || $scope.ride.ride_type == 'TC') {
                      if($scope.ride.ride_type == 'CT')
                          $scope.selectedRideType = 0;
                      else if($scope.ride.ride_type == 'TC')
                          $scope.selectedRideType = 1;

                      $scope.districtSelected($scope.ride.homeLocation.district);
                      $scope.changeDistrict= true;
                      $scope.municipality = $scope.ride.homeLocation.municipality;
                      $scope.ride.street = $scope.ride.homeLocation.street;
                      $scope.ride.locationInfo = $scope.ride.homeLocation.info;

                      $http.post(Server.url + "api/ride/getWorkLocation", {
                          '_workLocation': $scope.ride._workLocation
                      })
                          .success(function(data, status, headers, config) {
                              $scope.workLocation = data.name;
                          })
                          .error(function(data, status, headers, config) {
                              $ionicLoading.hide();
                          });

                  }
                  else if($scope.ride.ride_type == 'Ocasional') {
                      $scope.selectedRideType = 2;

                      $scope.occasional = {"startAddress": $scope.ride.startLocation.address, "startIdentifier": $scope.ride.startLocation.identifier, "destinationAddress": $scope.ride.destination.address, "destinationIdentifier": $scope.ride.destination.identifier};

                  }
                  else {
                      console.log('Wrong ride_type');
                  }

              }

              $ionicLoading.hide();
          }).
          error(function(data, status, headers, config) {
              $ionicLoading.hide();
          });
        }
        else if($scope.editType === 'rideInfo') {
          $http.get(Server.url + "api/ride/getRideInfoToEdit", {
              params: {rideInfoID : $stateParams.rideID}
          })
          .success(function(data, status, headers, config) {
              if(data == null) {
                  console.log('Não exite boleia pré-definida com esse id');
              }
              else {
                $scope.ride = data;
                var startDate = new Date(data.time_start);

                $scope.ride.hour = startDate;
                $scope.ride.rideInfoName = data.name;

                  if($scope.ride.ride_type == 'CT' || $scope.ride.ride_type == 'TC') {
                      if($scope.ride.ride_type == 'CT')
                          $scope.selectedRideType = 0;
                      else if($scope.ride.ride_type == 'TC')
                          $scope.selectedRideType = 1;

                      $scope.districtSelected($scope.ride.homeLocation.district);
                      $scope.changeDistrict= true;
                      $scope.municipality = $scope.ride.homeLocation.municipality;
                      $scope.ride.street = $scope.ride.homeLocation.street;
                      $scope.ride.locationInfo = $scope.ride.homeLocation.info;

                      $http.post(Server.url + "api/ride/getWorkLocation", {
                          '_workLocation': $scope.ride._workLocation
                      })
                          .success(function(data, status, headers, config) {
                              $scope.workLocation = data.name;
                          })
                          .error(function(data, status, headers, config) {
                              $ionicLoading.hide();
                          });

                  }
                  else if($scope.ride.ride_type == 'Ocasional') {
                      $scope.selectedRideType = 2;

                      $scope.occasional = {"startAddress": $scope.ride.startLocation.address, "startIdentifier": $scope.ride.startLocation.identifier, "destinationAddress": $scope.ride.destination.address, "destinationIdentifier": $scope.ride.destination.identifier};

                  }
                  else {
                      console.log('Wrong ride_type');
                  }

              }

              $ionicLoading.hide();
          }).
          error(function(data, status, headers, config) {
              $ionicLoading.hide();
          });
        }
        else {
          $state.go('profile');
        }

        editRideSuccess = function() {
            var alertPopup = $ionicPopup.alert({
                title: 'Editar Boleia',
                template: 'Boleia editada com sucesso!'
            });
        };

        editRideError= function() {
            var alertPopup = $ionicPopup.alert({
                title: 'Editar Boleia',
                template: 'Ocorreu um problema ao editar a sua boleia.'
            });
        };

        $scope.editRide = function (ride) {

            ride.date.setHours(ride.hour.getHours(), ride.hour.getMinutes());

            if($scope.selectedRideType == 0)
                ride.ride_type = 'CT';
            else if($scope.selectedRideType == 1)
                ride.ride_type = 'TC';

            if(ride.ride_type == "CT" || ride.ride_type == "TC") {
                $http.post(Server.url + 'api/ride/editRide',
                    {
                        'rideID': ride._id,
                        'seats': ride.seats,
                        'time_start': ride.date,
                        'ride_type': ride.ride_type,
                        'cost': ride.cost,
                        'locationName': $scope.workLocation,
                        'homeLocation' : {
                            "district": $scope.district,
                            "municipality": $scope.municipality,
                            "street": ride.street,
                            "info": ride.locationInfo
                        }
                    }
                )
                .success(function(data, status, headers, config) {
                    if(data){
                        editRideSuccess();
                        $state.go('profile');
                        $ionicLoading.hide();
                    }
                }).
                error(function(data, status, headers, config) {
                    /* TODO caso dê erro */
                    editRideError();
                    $ionicLoading.hide();
                });

            }
            else if(ride.ride_type == "Ocasional") {

                $http.post(Server.url + 'api/ride/editRide',
                    {
                        'rideID': ride._id,
                        'seats': ride.seats,
                        'time_start': ride.date,
                        'ride_type': ride.ride_type,
                        'type_cost': ride.type_cost,
                        'cost': ride.cost,
                        'startLocation' : {
                            "address": $scope.occasional.startAddress,
                            "identifier": $scope.occasional.startIdentifier
                        },
                        'destination' : {
                            "address": $scope.occasional.destinationAddress,
                            "identifier": $scope.occasional.destinationIdentifier
                        }
                    }
                )
                .success(function(data, status, headers, config) {
                    if(data){
                        editRideSuccess();
                        $state.go('profile');
                        $ionicLoading.hide();
                    }
                }).
                error(function(data, status, headers, config) {
                    /* TODO caso dê erro */
                    editRideError();
                    $ionicLoading.hide();
                });
            }
        };

        $scope.editRideInfo = function (rideInfo) {

            if($scope.selectedRideType == 0)
              rideInfo.ride_type = 'CT';
            else if($scope.selectedRideType == 1)
              rideInfo.ride_type = 'TC';

            if(rideInfo.ride_type == "CT" || rideInfo.ride_type == "TC") {
                $http.post(Server.url + 'api/ride/editRideInfo',
                    {
                        'rideInfoID': rideInfo._id,
                        'seats': rideInfo.seats,
                        'time_start': rideInfo.hour,
                        'ride_type': rideInfo.ride_type,
                        'cost': rideInfo.cost,
                        'rideInfoName': rideInfo.rideInfoName,
                        'locationName': $scope.workLocation,
                        'homeLocation' : {
                            "district": $scope.district,
                            "municipality": $scope.municipality,
                            "street": rideInfo.street,
                            "info": rideInfo.locationInfo
                        }
                    }
                )
                .success(function(data, status, headers, config) {
                    if(data){
                        editRideSuccess();
                        $state.go('profile');
                        $ionicLoading.hide();
                    }
                }).
                error(function(data, status, headers, config) {
                    /* TODO caso dê erro */
                    editRideError();
                    $ionicLoading.hide();
                });

            }
            else if(rideInfo.ride_type == "Ocasional") {

                $http.post(Server.url + 'api/ride/editRideInfo',
                    {
                        'rideID': rideInfo._id,
                        'seats': rideInfo.seats,
                        'time_start': rideInfo.date,
                        'ride_type': rideInfo.ride_type,
                        'type_cost': rideInfo.type_cost,
                        'cost': rideInfo.cost,
                        'startLocation' : {
                            "address": $scope.occasional.startAddress,
                            "identifier": $scope.occasional.startIdentifier
                        },
                        'destination' : {
                            "address": $scope.occasional.destinationAddress,
                            "identifier": $scope.occasional.destinationIdentifier
                        }
                    }
                ).
                    success(function(data, status, headers, config) {
                        if(data){
                            editRideSuccess();
                            $state.go('profile');
                            $ionicLoading.hide();
                        }
                    }).
                    error(function(data, status, headers, config) {
                        /* TODO caso dê erro */
                        editRideError();
                        $ionicLoading.hide();
                    });
            }
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

        $scope.showModalDistrict = function() {
            $scope.modalDistrict.show();
        };

        $scope.showModalMunicipality = function() {
            if($scope.district != 'Distrito')
                $scope.modalMunicipality.show();
        };

        $scope.showModalWorkLocation = function() {
            $scope.modalWorkLocation.show();
        };

        //Cleanup the modal when we're done with it!
        $scope.$on('$destroy', function() {
            $scope.modalDistrict.remove();
            $scope.modalMunicipality.remove();
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

        $scope.itemClicked = function ($index) {
            $scope.selectedRideType = $index;
        };

        $scope.workLocationSelected = function(workLocation) {

            $scope.workLocation = workLocation;

            $scope.workLocationValidation = "";

            /*TODO o resto dos casos */

            $scope.modalWorkLocation.hide();

        };

        $scope.districtSelected = function(district) {

            if($scope.changeDistrict) {
                $scope.municipality = 'Concelho';
                $scope.municipalityValidation = "";
            }
            $scope.district = district;
            $scope.districtValidation = "";

            if(district == "Aveiro")
                $scope.municipalities = ["Águeda","Albergaria-a-velha", "Anadia","Arouca",
                    "Aveiro", "Castelo de Paiva", "Espinho", "Estarreja",
                    "Santa Maria da Feira", "Ílhavo", "Mealhada", "Murtosa",
                    "Oliveira de Azeméis", "Oliveira do Bairro", "Ovar",
                    "S.João da Madeira", "Sever do Vouga", "Vagos", "Vale de Cambra"]
                ;
            else if(district == "Beja")
                $scope.municipalities = ["Aljustrel","Almodôvar", "Alvito","Barrancos",
                    "Beja", "Castro Verde", "Cuba", "Ferreira do Alentejo",
                    "Mértola", "Moura", "Odemira", "Serpa",
                    "Vidigueria"]
                ;
            else if(district == "Braga")
                $scope.municipalities = ["Amares","Barcelos", "Braga","Cabeceiras de Basto",
                    "Celorico de Basto", "Esposende", "Fafe", "Guimarães",
                    "Póvoa de Lanhoso", "Terras de Bouro", "Vieira do Minho",
                    "Vila Nova de Famalicão", "Vila Verde", "Vizela"]
                ;
            else if(district == "Bragança")
                $scope.municipalities = ["Alfândega da Fé","Bragança", "Carrazeda de Ansiães",
                    "Freixo de Espada a Cinta", "Macedo de Cavaleiros",
                    "Miranda do Douro", "Mirandela", "Mogadouro",
                    "Torre de Moncorvo","Vila Flor", "Vimioso", "Vinhais"]
                ;
            else if(district == "Castelo Branco")
                $scope.municipalities = ["Belmonte","Castelo Branco", "Covilhã",
                    "Fundão", "Idanha-a-Nova", "Oleiros",
                    "Penamacor", "Proença-a-Nova", "Sertã",
                    "Vila de Rei","Vila Velha de Rodão"]
                ;
            else if(district == "Coimbra")
                $scope.municipalities = ["Arganil","Cantanhede", "Coimbra",
                    "Condeixa-a-Nova", "Figueira da foz", "Góis",
                    "Lousã", "Mira", "Miranda do Corvo",
                    "Montemor-o-Velho","Oliveira do Hospital",
                    "Pampilhosa da Serra", "Penacova", "Penela",
                    "Soure", "Tábua", "Vila Nova de Poiares"]
                ;

            else if(district == "Évora")
                $scope.municipalities = ["Alandroal","Arraiolos", "Borba",
                    "Estremoz", "Évora", "Montemor-o-Novo",
                    "Mora", "Mourão", "Portel","Redondo",
                    "Reguengos de Monsaraz", "Vendas Novas",
                    "Viana do Castelo", "Vila Viçosa"]
                ;
            else if(district == "Faro")
                $scope.municipalities = ["Albufeira","Alcoutim", "Aljezur",
                    "Castro Marim", "Fora", "Lagoa",
                    "Lagos", "Loulé", "Monchique","Olhão",
                    "Portimão", "S.Brás de Alportel",
                    "Silves", "Tavira", "Vila do Bispo",
                    "Vila Real de Santo António"]
                ;
            else if(district == "Guarda")
                $scope.municipalities = ["Aguiar da Beira","Almeida", "Celorico da Beira",
                    "Figueira de Castelo Rodrigo", "Fornos de Algodres",
                    "Gouveira", "Guarda", "Manteigas", "Mêda",
                    "Pinhel", "Sabugal", "Seia",
                    "Trancoso", "Vila Nova de Foz Côa"]
                ;
            else if(district == "Leiria")
                $scope.municipalities = ["Alcobaça","Alvaiázere", "Ansião",
                    "Batalha", "Bombarral", "Caldas da Rainha",
                    "Castanheira de Pêra", "Figueiro dos Vinhos",
                    "Leiria","Marinha Grande", "Nazaré",
                    "Óbidos", "Pedrogão Grande", "Peniche",
                    "Pombal", "Porto de Mós"]
                ;
            else if(district == "Lisboa")
                $scope.municipalities = ["Alenquer", "Amadora","Arruda dos Vinhos", "Azambuja",
                    "Cadaval", "Cascais", "Lisboa","Loures", "Lourinhã",
                    "Mafra", "Odivelas","Oeiras", "Sintra",
                    "Sobral de Monte Agraço", "Torres Vedras",
                    "Vila Franca de Xira"]
                ;
            else if(district == "Portalegre")
                $scope.municipalities = ["Alter do Chão","Arronches", "Avis","Campo Maior",
                    "Castelo de Vide", "Crato","Elvas", "Fronteira",
                    "Gavião","Marvão", "Monforte","Nisa", "Ponte de Sôr",
                    "Portalegre","Sousel"]
                ;
            else if(district == "Porto")
                $scope.municipalities = ["Amarante","Baião", "Felgueiras","Gondomar",
                    "Lousada", "Maia","Marco de Canaveses", "Matosinhos",
                    "Paços de Ferreira","Paredes", "Penafiel","Porto",
                    "Póvoa de Varzim","Santo Tirso","Valongo",
                    "Vila do Conde", "Vila Nova de Gaia", "Trofa"]
                ;
            else if(district == "Santarém")
                $scope.municipalities = ["Abrantes","Alcanena", "Almeirim","Alpiarça",
                    "Benavente", "Cartaxo","Chamusca", "Constância",
                    "Coruche","Entrocamento", "Ferreira do Zêzere",
                    "Golegã", "Mação","Rio Maior","Salvaterra de Magos",
                    "Santarém","Sardoal", "Tomar","Torres Novas",
                    "Vila Nova da Barquinha", "Ourém"]
                ;
            else if(district == "Setúbal")
                $scope.municipalities = ["Alcacer do Sal","Alcochete", "Almada","Barreiro",
                    "Grândola", "Moita","Montijo", "Palmela",
                    "Santiago do Cacém","Seixal", "Sesimbra",
                    "Setúbal", "Sines"]
                ;
            else if(district == "Viana do Castelo")
                $scope.municipalities = ["Arcos de Valdevez","Caminha", "Melgaço","Monção",
                    "Paredes de Coura", "Ponte da Barca","Ponte de Lima",
                    "Valença","Viana do Castelo", "Vila Nova de Cerveira"]
                ;
            else if(district == "Vila Real")
                $scope.municipalities = ["Alijó","Boticas", "Chaves","Mesão Frio",
                    "Mondim de Basto", "Montalegre","Murça", "Peso da Régua",
                    "Ribeira de Pena","Sabrosa", "Santa Marta de Penaguião",
                    "Valpaços", "Vila Pouca de Aguiar","Vila Real"]
                ;
            else if(district == "Viseu")
                $scope.municipalities = ["Armamar","Carregal do Sal", "Castro Daire","Cinfães",
                    "Lamego", "Mangualde","Moimenta da Beira", "Mortágua",
                    "Nelas","Oliveira de Frades", "Penalva do Castelo",
                    "Penedono", "Resende","Santa Comba Dão","S.João da Pesqueira",
                    "S.Pedro do Sul","Satão", "Sernancelhe","Tabuaço",
                    "Tarouca", "Tondela", "Vila Nova de Paiva", "Viseu", "Vouzela"]
                ;
            else if(district == "Angra do Heroismo")
                $scope.municipalities = ["Angra do Heroísmo","Calheta(Açores)", "Santa Cruz da Graciosa",
                    "Velas", "Vila Praia da Vitória"]
                ;
            else if(district == "Horta")
                $scope.municipalities = ["Corvo","Horta", "Lajes das Flores","Lajes do Pico",
                    "Madalena", "Santa Cruz das Flores","S.Roque do Pico"]
                ;
            else if(district == "Ponta Delgada")
                $scope.municipalities = ["Lagoa(Açores)","Nordeste", "Ponta Delgada","Povoação",
                    "Ribeira Grande", "Vila Franca do Campo","Vila do Porto"]
                ;
            else if(district == "Funchal")
                $scope.municipalities = ["Calheta(Madeira)","Câmara de Lobos", "Funchal","Machico",
                    "Ponta do Sol", "Porto Moniz","Porto Santo", "Ribeira Brava",
                    "Santa Cruz","Santana", "S.Vicente"]
                ;

            $scope.modalDistrict.hide();



        };

        $scope.municipalitySelected = function(municipality) {

            $scope.municipality = municipality;
            $scope.municipalityValidation = "";

            /*TODO o resto dos casos */

            $scope.modalMunicipality.hide();

        };

    })

    .controller('editRideTypeCtrl', function($scope) {

    });
