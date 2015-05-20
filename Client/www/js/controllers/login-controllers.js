angular.module('iTRides.loginControllers', [])

    .controller('LoginCtrl', function($scope, $state, $http, $window, $ionicLoading, Server, $ionicPopup) {

        $scope.user = {
            email:localStorage.getItem('iTRides_Email'),
            password:localStorage.getItem('iTRides_Password')
        };

        $scope.login = function (user) {
            $scope.user = user;
            if(user.email && user.password){
                $http.post(Server.url + 'user/login', {'email': user.email, 'password': user.password}).
                    success(function(data, status, headers, config) {
                        if(data.activated){
                            $window.sessionStorage.token = data.token;
                            localStorage.setItem('SessionToken', data.token );
                            localStorage.setItem('iTRides_Email', $scope.user.email);
                            localStorage.setItem('iTRides_Password', $scope.user.password);
                            $state.go('home');
                        }else{
                            delete $window.sessionStorage.token;
                        }
                        $ionicLoading.hide();
                    }).
                    error(function(data, status, headers, config) {
                        $ionicLoading.hide();
                        if(status === 404){
                            $ionicPopup.alert({
                                title: 'Login',
                                template: 'Conta não existe!'
                            });
                        }else if(status === 400){
                            $ionicPopup.alert({
                                title: 'Login',
                                template: 'Conta não ativada!'
                            });
                        }else{
                            $ionicPopup.alert({
                                title: 'Login',
                                template: 'Não foi possível fazer login!'
                            });
                        }
                        delete $window.sessionStorage.token;
                        localStorage.removeItem('SessionToken');

                    });
            }else{
                $ionicPopup.alert({
                    title: 'Login',
                    template: 'Introduza o seu endereço de email e password'
                });
            }
        };
    })
;
