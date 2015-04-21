angular.module('iTRides.homeControllers', [])

    .controller('HomeCtrl', function($scope, $http, $ionicLoading, $timeout) {

        //test load screen
        $http.get('http://www.w3schools.com/angular/customers.php').
            success(function(data, status, headers, config) {
                //window.alert(JSON.stringify(data));
                console.log("Success");
                $ionicLoading.hide();
            }).
            error(function(data, status, headers, config) {
                console.log(JSON.stringify(config));
                $ionicLoading.hide();
            });

        $scope.notifications = [{
            id: 0,
            name: 'Ben Sparrow',
            photo: 'https://pbs.twimg.com/profile_images/514549811765211136/9SgAuHeY.png',
            msgType:'Enter',
            rideDate:'2 Abril 8:30h'
        }, {
            id: 1,
            name: 'Max Lynx',
            photo: 'https://avatars3.githubusercontent.com/u/11214?v=3&s=460',
            msgType:'Exit',
            rideDate:'16 Maio 17:00h'
        }, {
            id: 2,
            name: 'Andrew Jostlin',
            photo: 'https://pbs.twimg.com/profile_images/491274378181488640/Tti0fFVJ.jpeg',
            msgType:'Cancel',
            rideDate:'24 Abril 8:45h'
        }, {
            id: 3,
            name: 'Adam Bradleyson',
            photo: 'https://pbs.twimg.com/profile_images/479090794058379264/84TKj_qa.jpeg',
            msgType:'Cancel',
            rideDate:'1 Junho 9:00h'
        }, {
            id: 4,
            name: 'Perry Governor',
            photo: 'https://pbs.twimg.com/profile_images/491995398135767040/ie2Z_V6e.jpeg',
            msgType:'Enter',
            rideDate:'25 Dezembro 12:00h'
        }, {
            id: 5,
            name: 'Ben Sparrow',
            photo: 'https://pbs.twimg.com/profile_images/514549811765211136/9SgAuHeY.png',
            msgType:'Exit',
            rideDate:'25 Dezembro 12:00h'
        }, {
            id: 6,
            name: 'Andrew Jostlin',
            photo: 'https://pbs.twimg.com/profile_images/491274378181488640/Tti0fFVJ.jpeg',
            msgType:'Enter',
            rideDate:'24 Abril 8:45h'
        }, {
            id: 7,
            name: 'Max Lynx',
            photo: 'https://avatars3.githubusercontent.com/u/11214?v=3&s=460',
            msgType:'Exit',
            rideDate:'16 Maio 17:00h'
        }];

        $scope.myNextRide = {
            id:0,
            startLocation : 'Rua Professor António Gomes, Braga',
            date: '15 de fevereiro',
            time_start: '8:00h',
            passengers: [
                {
                    name: 'Tiago Gonçalves',
                    photo:'https://pbs.twimg.com/profile_images/491274378181488640/Tti0fFVJ.jpeg'
                },{
                    name: 'Fernanda Santos',
                    photo:'https://lh3.googleusercontent.com/-IYWkoctkgdo/AAAAAAAAAAI/AAAAAAAAAAA/v3okpkLGc_4/s46-c-k-no/photo.jpg'
                },{
                    name: 'Leonardo Ribeiro',
                    photo:'https://pbs.twimg.com/profile_images/491995398135767040/ie2Z_V6e.jpeg'
                }],
            destination: 'Avenida Lusíadas, Viseu'
        };

        $scope.myNextRequest = {
            id:0,
            startLocation : ' Rua Alberto de Oliveira, Coimbra',
            date: '24 de maio',
            time_start: '15:30h',
            owner : {
                name: 'Celia Bell',
                photo: 'https://lh3.googleusercontent.com/-IYWkoctkgdo/AAAAAAAAAAI/AAAAAAAAAAA/v3okpkLGc_4/s46-c-k-no/photo.jpg'
            },
            destination: 'Rua Artes Bairro de Santa Luzia, Porto'
        };

        $scope.removeNotification = function (index) {
            $scope.notifications.splice(index, 1);

        };

        $scope.removeAllNotification = function () {

            while($scope.notifications.length > 0){
                $scope.removeNotification($scope.notifications.length - 1);
            }
        };



    })

;
