angular.module('iTRides.loginControllers', [])

    .controller('LoginCtrl', function($scope, $state, $http) {

        $scope.login = function (user) {
          $http.post('http://localhost:8080/api/user/login', {'email': user.email, 'password': user.password}).
            success(function(data, status, headers, config) {
              if(data)
                $state.go('home');
            }).
            error(function(data, status, headers, config) {
              console.log("Can´t login");
          });

        };

    })
;
