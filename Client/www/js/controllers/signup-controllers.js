angular.module('iTRides.signupControllers', [])

    .controller('SignupCtrl', function($scope, $state, $http, $ionicLoading, $ionicPopup, Server) {

        $scope.noMatchPasswords= false;

        $scope.signup = function (newUser) {

            var emailDomain = newUser.email.substring(newUser.email.indexOf("@") + 1);

            if(emailDomain === "itgrow.pt" || emailDomain === "criticalsoftware.com") {
                if(newUser.password == newUser.confirmPassword) {

                    $http.post(Server.url + 'user/register', {'name' : newUser.name,
                        'email': newUser.email,
                        'password': newUser.password}).
                        success(function(data, status, headers, config) {
                            console.log(JSON.stringify(data));
                            if(data === "WD") {
                                $ionicPopup.alert({
                                    title: 'Registar',
                                    template: 'Dominio do email inválido.\nSó é aceite @itgrow.pt ou @criticalsoftware.com'
                                });
                            }
                            else if(data === "AU") {
                                $ionicPopup.alert({
                                    title: 'Registar',
                                    template: 'Email inserido já está em uso.\n'
                                });
                            }
                            else {
                                if(data)
                                    $state.go('login'); /* TODO mudar para uma pagina a dizer para ir ao email confirmar */
                            }
                            $ionicLoading.hide();
                        }).
                        error(function(data, status, headers, config) {
                            console.log("Can´t signup " + status);
                            $ionicLoading.hide();
                        });

                }
                else { /* TODO mensagem a dizer que password e confirm nao são iguais */
                    $ionicPopup.alert({
                        title: 'Registar',
                        template: 'As palavras-chave não são iguais.'
                    });
                }
            }else{
                $ionicPopup.alert({
                    title: 'Registar',
                    template: 'Os emails tem de ser @itgrow.pt ou criticalsoftware.com'
                });
            }
        };

    })
;
