angular.module('iTRides.listRequestedRidesControllers', [])

.controller('listRequestedRidesCtrl', function($scope, $window, $state) {

        $scope.requestedRides = [{
                id:0,
                owner: 'Celia Bell',
                owner_photo: 'https://lh3.googleusercontent.com/-IYWkoctkgdo/AAAAAAAAAAI/AAAAAAAAAAA/v3okpkLGc_4/s46-c-k-no/photo.jpg',
                day: 'Segunda Feira',
                start_time: '07:30',
                start_street: 'Rua Professor Antonio Gomes',
                start_city: 'Braga',
                destination_street: 'Avenida Lusiadas',
                destination_city: 'Viseu'
        }, {
                id:1,
                owner: 'Fernanda Santos',
                owner_photo: 'https://lh3.googleusercontent.com/-IYWkoctkgdo/AAAAAAAAAAI/AAAAAAAAAAA/v3okpkLGc_4/s46-c-k-no/photo.jpg',
                day: 'Segunda Feira',
                start_time: '07:30',
                start_street: 'Rua Professor Antonio Gomes',
                start_city: 'Braga',
                destination_street: 'Avenida Lusiadas',
                destination_city: 'Viseu'
        }, {
                id:2,
                owner: 'Tiago Gonçalves',
                owner_photo: 'https://lh3.googleusercontent.com/-IYWkoctkgdo/AAAAAAAAAAI/AAAAAAAAAAA/v3okpkLGc_4/s46-c-k-no/photo.jpg',
                day: 'Quinta Feira',
                start_time: '18:30',
                start_street: 'Rua Professor Antonio Gomes',
                start_city: 'Braga',
                destination_street: 'Campo Pequeno',
                destination_city: 'Lisboa'
        }];
})
