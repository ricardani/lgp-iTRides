angular.module('iTRides.homeControllers', [])

    .controller('HomeCtrl', function($scope) {
        // Some fake testing data
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


        $scope.removeNotification = function (index) {
            $scope.notifications.splice(index, 1);
        };



    })

;
