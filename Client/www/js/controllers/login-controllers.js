angular.module('iTRides.loginControllers', [])

    .controller('LoginCtrl', function($scope, $state, $http) {

        $scope.login = function (user) {
          $http.post('http://localhost:8080/api/user/login', {'email': user.email, 'password': user.password}).
            success(function(data, status, headers, config) {
              console.log(data.activated);
              if(data.activated)
                $state.go('home');
              /*else
                 TODO dizer que a conta ainda nao foi confirmada */
            }).
            error(function(data, status, headers, config) {
              console.log("Can´t login");
          });

        };

    })
;
