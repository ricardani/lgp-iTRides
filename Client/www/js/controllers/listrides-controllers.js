angular.module('iTRides.listRidesControllers', [])

.controller('ListRidesCtrl', function($scope, $window, $state) {

        $scope.defaultRides = [{
        	id:0,
        	name: 'Trabalho',
                type: 0,
        	day: 'Segunda Feira',
        	start_time: '07:30'
        }, {
        	id:1,
        	name: 'Casa',
                type: 1,
        	day: 'Segunda Feira',
        	start_time: '18:30'
        }, {
        	id:2,
        	name: 'Trabalho',
                type: 0,
        	day: 'Terça Feira',
        	start_time: '08:00'
        }, {
                id:3,
                name: 'Casa',
                type: 1,
                day: 'Terça Feira',
                start_time: '17:30'
        }, {
                id:4,
                name: 'Trabalho',
                type: 0,
                day: 'Quarta Feira',
                start_time: '08:30'
        }, {
                id:5,
                name: 'Casa',
                type: 1,
                day: 'Quarta Feira',
                start_time: '08:00'
        }, {
                id:6,
                name: 'Trabalho',
                type: 0,
                day: 'Quinta Feira',
                start_time: '07:30'
        }, {
                id:7,
                name: 'Casa',
                type: 1,
                day: 'Quinta Feira',
                start_time: '18:30'
        }];
})
