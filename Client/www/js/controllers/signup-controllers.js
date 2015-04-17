angular.module('iTRides.signupControllers', [])

    .controller('SignupCtrl', function($scope, $state, $http) {

        $scope.signup = function (newUser) {

          if(newUser.password == newUser.confirmPassword) {
            $http.post('http://localhost:8080/api/user/register', {'firstName' : newUser.firstName,
                                                                  'lastName' : newUser.lastName,
                                                                  'email': newUser.email,
                                                                  'password': newUser.password}).
              success(function(data, status, headers, config) {
                if(data)
                  $state.go('home');
              }).
              error(function(data, status, headers, config) {
                console.log("Can´t signup");
            });

          }
          else { /* TODO mensagem a dizer que password e confirm nao são iguais */

          }

        };

    })
;
