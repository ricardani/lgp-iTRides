angular.module('iTRides.createRideControllers', [])

    .controller('CreateRideCtrl', function($scope, $window, $ionicModal, $filter, $ionicLoading, $timeout, $stateParams, $http, Server, $state, $ionicPopup) {
        //var creatRideCtrl = this; e remover $scope
        $scope.costTypeOptions = [
            { id: 'Pago pela empresa', name: 'Pago pela empresa', value: 'Pago pela empresa' },
            { id: 'Pagar ao condutor', name: 'Pagar ao condutor', value: 'Pagar ao condutor' }
        ];

        $scope.newRide = {type : $scope.costTypeOptions[0].value};

        $scope.createNew = $stateParams.createNew;

        if($scope.createNew == 'createNow') {
        }
        else if($scope.createNew == 'createInfo') {
        }
        else{
        }
            ;//TODO enviar para uma pagina com erro 500

        $scope.selectedRideType = 0;
        $scope.collection = ["Casa>Trabalho", "Trabalho>Casa", "Ocasional"];
        $scope.district = 'Distrito';
        $scope.districtValidation = "";
        $scope.municipality = 'Concelho';
        $scope.municipalityValidation = "";
        $scope.street = 'Rua';
        $scope.streetValidation = "";
        $scope.info = 'Info';
        $scope.infoValidation = "";

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

        $http.get(Server.url + 'api/ride/getWorkLocations').
            success(function(data, status, headers, config) {
                for(i=0; i < data.length; i++) {
                    $scope.workLocations.push(data[i].name);
                }
                $ionicLoading.hide();
            }).
            error(function(data, status, headers, config) {
                console.log(JSON.stringify(data));
                $ionicLoading.hide();
            });

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

        $scope.checkForm = function(newRide, rideType) {

            var noErrors = true;

            if(newRide.seats == null) {
                console.log('missing seats');
                noErrors=false;
            }
            if(newRide.hour == null) {
                console.log('missing hour');
                noErrors=false;
            }
            if(newRide.typeCost == null && rideType == 'Ocasional') {
                console.log('missing type of cost');
                noErrors=false;
            }
            if(newRide.cost == null) {
                console.log('missing cost');
                noErrors=false;
            }
            if(newRide.date == null) {
                console.log('missing date');
                noErrors=false;
            }
            if($scope.workLocation == 'Local de trabalho' && (rideType == 'Trabalho>Casa' || rideType == 'Casa>Trabalho')) {
                $scope.workLocationValidation = "error";
                console.log('missing work location');
                noErrors=false;
            }
            if($scope.district == 'Distrito' && (rideType == 'Trabalho>Casa' || rideType == 'Casa>Trabalho')) {
                $scope.districtValidation = "error";
                console.log('missing district');
                noErrors=false;
            }
            if($scope.municipality == 'Concelho' && (rideType == 'Trabalho>Casa' || rideType == 'Casa>Trabalho')) {
                $scope.municipalityValidation = "error";
                console.log('missing municipality');
                noErrors=false;
            }/*
            if($scope.street == 'Rua' && (rideType == 'Trabalho>Casa' || rideType == 'Casa>Trabalho')) {
                $scope.streetValidation = "error";
                console.log('missing street');
                noErrors=false;
            }
            if($scope.info == 'Info' && (rideType == 'Trabalho>Casa' || rideType == 'Casa>Trabalho')) {
                $scope.infoValidation = "error";
                console.log('missing info');
                noErrors=false;
            }*/


            return noErrors;

        }

        showPopUpSuccess = function() {
            var alertPopup = $ionicPopup.alert({
                title: 'Criar Boleia',
                template: 'Boleia criada com sucesso!'
            });
        }

        showPopUpError = function() {
            var alertPopup = $ionicPopup.alert({
                title: 'Criar Boleia',
                template: 'Ocorreu um problema ao criar a sua boleia. Por favor tente de novo'
            });
        }

        $scope.createRide = function (newRide) {

            //TODO handle the error catched by this if
            if(newRide == null)
                var newRide={};

            var rideType = $scope.collection[$scope.selectedRideType];

            if(!$scope.checkForm(newRide, rideType))
                return; //Se houver um campo nao preenchido, não fazer nada

            newRide.date.setHours(newRide.hour.getHours(),newRide.hour.getMinutes());

            if(rideType == "Trabalho>Casa") {
                $http.post(Server.url + 'api/ride/createRide',
                    {
                        '_owner': $window.sessionStorage.token,
                        'seats': newRide.seats,
                        'time_start': newRide.date,
                        'ride_type': 'TC',
                        'type_cost': newRide.typeCost,
                        'cost': newRide.cost,
                        'locationName': $scope.workLocation,
                        'homeLocation' : {
                            "district": $scope.district,
                            "municipality": $scope.municipality,
                            "street": newRide.destinationStreet,
                            "info": newRide.destinationLocationInfo
                        }
                    }
                )
                .success(function(data, status, headers, config) {
                    if(data){
                        showPopUpSuccess();
                        /* TODO caso funcione */
                        $state.go('profile');
					   $ionicLoading.hide();
                    }
                }).
                error(function(data, status, headers, config) {
                    /* TODO caso dê erro */
                    showPopUpError();
                    $ionicLoading.hide();
                });

            }
            else if(rideType == "Casa>Trabalho") {
                $http.post(Server.url + 'api/ride/createRide',
                    {
                        '_owner': $window.sessionStorage.token,
                        'seats': newRide.seats,
                        'time_start': newRide.date,
                        'ride_type': 'CT',
                        'type_cost': newRide.typeCost,
                        'cost': newRide.cost,
                        'locationName': $scope.workLocation,
                        'homeLocation' : {
                            "district": $scope.district,
                            "municipality": $scope.municipality,
                            "street": newRide.startStreet,
                            "info": newRide.startLocationInfo
                        }
                    }
                )
                .success(function(data, status, headers, config) {
                    if(data){
                        /* TODO caso funcione */
                        showPopUpSuccess();
                        $state.go('profile');
					    $ionicLoading.hide();
                    }
                }).
                error(function(data, status, headers, config) {
                    /* TODO caso dê erro */
                    showPopUpError();
                    $ionicLoading.hide();
                });
            }
            else if(rideType == "Ocasional") {
                $http.post(Server.url + 'api/ride/createRide',
                    {
                        'seats': newRide.seats,
                        'time_start': newRide.date,
                        'ride_type': 'Ocasional',
                        'type_cost': newRide.typeCost,
                        'cost': newRide.cost,
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
                        showPopUpSuccess();
                        $state.go('profile');
          				$ionicLoading.hide();
                    }
                }).
                error(function(data, status, headers, config) {
                    /* TODO caso dê erro */
                    showPopUpError();
                    $ionicLoading.hide();
                });
            }
            else {
                /* TODO caso dê erro ao definir o tipo da boleia */
                $ionicLoading.hide();
            }

        };

        /*------------------Create Ride Info--------------------*/

        $scope.createRideInfo = function (newRide) {

            var rideType = $scope.collection[$scope.selectedRideType];
            var ride_type;
            if(rideType == 'Casa>Trabalho')
                ride_type = 'CT';
            else if(rideType == 'Trabalho>Casa')
                ride_type = 'TC';
            else if(rideType == 'Ocasional')
                ride_type = 'Ocasional';
            else
                console.log('Can`t identify ride type');

            $http.post(Server.url + 'api/ride/createRideInfo',
                {
                    '_owner': $window.sessionStorage.token,
                    'seats': newRide.seats,
                    'time_start': newRide.hour,
                    'ride_type': ride_type,
                    'type_cost': newRide.typeCost,
                    'name': newRide.rideInfoName,
                    'cost': newRide.cost,
                    'workLocationName': $scope.workLocation,
                    'homeLocation' : {
                        "district": $scope.district,
                        "municipality": $scope.municipality,
                        "street": newRide.startStreet,
                        "info": newRide.startLocationInfo
                    }
                }
            )
                .success(function(data, status, headers, config) {
                    if(data){
                        /* TODO caso funcione */
                        $state.go('profile');
                        $ionicLoading.hide();
                    }
                }).
                error(function(data, status, headers, config) {
                    /* TODO caso dê erro */
                    $ionicLoading.hide();
                });

        };
        /*------------------------------------------------------*/

        $scope.workLocationSelected = function(workLocation) {

            $scope.workLocation = workLocation;

            $scope.workLocationValidation = "";

            /*TODO o resto dos casos */

            $scope.modalWorkLocation.hide();

        };

        $scope.streetSelected = function(street) {
            if(street != null) {

                $scope.street = street;

                $scope.streetValidation = "";
            }
        }

        $scope.infoSelected = function(info) {
            if(info != null)
                $scope.info = info;
            else
                $scope.info = "";

            $scope.infoValidation = "";
        }

        $scope.districtSelected = function(district) {


            $scope.municipality = 'Concelho';
            $scope.municipalityValidation = "";

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

    .controller('CreateRideTypeCtrl', function($scope) {

    })

;
