angular.module('iTRides.searchControllers', [])

.controller('SearchCtrl', function($scope, $filter, $window, $ionicModal, $ionicLoading, $timeout, $http, Server) {
	$scope.selectedRideType = 0;
	$scope.startDistrito = '';
	$scope.startConcelho = '';
	$scope.dateSelected='';
  $scope.count = 0;
  $scope.dateFilter= null;
  $scope.municipalityFilter = null;
  $scope.districtFilter = null;




/*
  console.log('first municipality ' + $scope.municipalityFilter);
  console.log('first date ' + $scope.dateFilter);
  console.log('first district ' + $scope.districtFilter); */

  $http.post(Server.url + 'api/ride/getRides').
    success(function(data,status,headers,config) {
      if (data) {
        $scope.rides = data;
        $ionicLoading.hide();
          console.log($scope.rides);
      }

    })
    .error(function(data,status,headers,config) {
      $ionicLoading.hide();
    } );


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




  $scope.selectedRideType = 0;
      $scope.collection = ["Casa>Trabalho", "Trabalho>Casa", "Ocasional"];
      $scope.district = 'Distrito';
      $scope.municipality = 'Concelho';


    //  $scope.street = 'Rua';
    //  $scope.info = 'Info';
      $scope.districts = ["Aveiro","Beja","Braga","Bragança","Castelo Branco",
                          "Coimbra","Évora","Faro","Guarda","Leiria","Lisboa",
                          "Portalegre","Porto","Santarém","Setúbal","Viana do Castelo",
                          "Vila Real","Viseu", "Angra do heroísmo", "Horta",
                          "Ponta Delgada", "Funchal"];

	$scope.collection = ["Casa>Trabalho", "Trabalho>Casa", "Ocasional"];

	$scope.itemClicked = function ($index) {
		$scope.selectedRideType = $index;
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

   /*   $ionicModal.fromTemplateUrl('streets.html', {
        scope: $scope,
        animation: 'slide-in-up'
      }).then(function(modalS) {
        $scope.modalStreet = modalS;
      }); */

   /*   $ionicModal.fromTemplateUrl('info.html', {
        scope: $scope,
        animation: 'slide-in-up'
      }).then(function(modalI) {
        $scope.modalInfo = modalI;
      });*/

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

    /*  $scope.showModalStreet = function() {
        $scope.modalStreet.show();
      }; */

   /*   $scope.showModalInfo = function() {
        $scope.modalInfo.show();
      };*/

      $scope.showModalWorkLocation = function() {
        $scope.modalWorkLocation.show();
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

      $scope.itemClicked = function ($index) {
        $scope.selectedRideType = $index;
      };


       $scope.workLocationSelected = function(workLocation) {

        $scope.workLocation = workLocation;

        /*TODO o resto dos casos */

        $scope.modalWorkLocation.hide();

      };

   /*   $scope.streetSelected = function(street) {
        $scope.street = street;

        $scope.modalStreet.hide();
      }*/

    /*  $scope.infoSelected = function(info) {
        $scope.info = info;

        $scope.modalInfo.hide();
      }*/

      $scope.districtSelected = function(district) {


        $scope.municipality = 'Concelho';
        $scope.municipalityFilter = null;
        $scope.district = district;

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

        $scope.districtFilter = $scope.district;
        console.log($scope.districtFilter);
        $scope.modalDistrict.hide();



      };

      $scope.municipalitySelected = function(municipality) {

        $scope.municipality = municipality;
        $scope.municipalityFilter = municipality;

        /*TODO o resto dos casos */

        console.log($scope.municipalityFilter)

        $scope.modalMunicipality.hide();

      };

/*
   $scope.rides = [
   { date: 'Apr 24 2015',
     district: 'Aveiro',
     municipality: ''
  },
  { date: 'Apr 24 2015',
    district: 'Braga',
    municipality: 'Amares'
  } ,
  {
    date: 'Apr 20 2015',
     district: 'Braga',
     municipality: ''
  },
  { date: 'Apr 20 2012',
     district: 'Aveiro',
     municipality: ''
  },

  { date: 'Jan 12 1999',
     district: 'Porto',
     municipality: ''
  },
  { date: 'Jan 12 1999',
     district: 'Porto',
     municipality: ''
  },
    { date: 'Jan 12 1999',
     district: 'Porto',
     municipality: 'Amarante'
  },
  { date: 'Jan 13 1999',
     district: 'Porto',
     municipality: 'Amarante'
  }
  ];
*/


	$scope.rides2 = [{
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
