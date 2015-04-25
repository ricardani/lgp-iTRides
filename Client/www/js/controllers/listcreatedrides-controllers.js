angular.module('iTRides.listCreatedRidesControllers', [])

.controller('listCreatedRidesCtrl', function($scope, $window, $state) {

        $scope.createdRides = [{
                id:0,
                passengers : [
                {
                        name: 'Celia Bell',
                        photo: 'https://lh3.googleusercontent.com/-IYWkoctkgdo/AAAAAAAAAAI/AAAAAAAAAAA/v3okpkLGc_4/s46-c-k-no/photo.jpg'          
                }, {
                        name: 'John Doe',
                        photo: 'https://lh3.googleusercontent.com/-IYWkoctkgdo/AAAAAAAAAAI/AAAAAAAAAAA/v3okpkLGc_4/s46-c-k-no/photo.jpg'
                }, {
                        name: 'Jane Doe',
                        photo: 'https://lh3.googleusercontent.com/-IYWkoctkgdo/AAAAAAAAAAI/AAAAAAAAAAA/v3okpkLGc_4/s46-c-k-no/photo.jpg'
                }],
                day: 'Segunda Feira',
                start_time: '07:30',
                start_street: 'Rua Professor Antonio Gomes',
                start_city: 'Braga',
                destination_street: 'Avenida Lusiadas',
                destination_city: 'Viseu'
        }, {
                id:1,
                passengers : [
                {
                        name: 'Celia Bell',
                        photo: 'https://lh3.googleusercontent.com/-IYWkoctkgdo/AAAAAAAAAAI/AAAAAAAAAAA/v3okpkLGc_4/s46-c-k-no/photo.jpg'          
                }, {
                        name: 'John Doe',
                        photo: 'https://lh3.googleusercontent.com/-IYWkoctkgdo/AAAAAAAAAAI/AAAAAAAAAAA/v3okpkLGc_4/s46-c-k-no/photo.jpg'
                },
                {
                        name: 'Jane Doe',
                        photo: 'https://lh3.googleusercontent.com/-IYWkoctkgdo/AAAAAAAAAAI/AAAAAAAAAAA/v3okpkLGc_4/s46-c-k-no/photo.jpg'
                }
                ],
                day: 'Segunda Feira',
                start_time: '07:30',
                start_street: 'Rua Professor Antonio Gomes',
                start_city: 'Braga',
                destination_street: 'Avenida Lusiadas',
                destination_city: 'Viseu'
        }];


})
