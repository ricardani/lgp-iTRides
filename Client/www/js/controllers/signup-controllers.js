angular.module('iTRides.signupControllers', [])

    .controller('SignupCtrl', function($scope, $state, $http, $ionicLoading, Server) {

        $scope.signup = function (newUser) {

            if(newUser.password == newUser.confirmPassword) {
                $http.post(Server.url + 'user/register', {'firstName' : newUser.firstName,
                    'lastName' : newUser.lastName,
                    'email': newUser.email,
                    'password': newUser.password}).
                    success(function(data, status, headers, config) {
                        if(data)
                            $state.go('login'); /* TODO mudar para uma pagina a dizer para ir ao email confirmar */
                        $ionicLoading.hide();
                    }).
                    error(function(data, status, headers, config) {
                        console.log("Can´t signup " + status);
                        $ionicLoading.hide();
                    });

            }
            else { /* TODO mensagem a dizer que password e confirm nao são iguais */

            }

        };

    })
;
