angular.module('iTRides.loginControllers', [])

    .controller('LoginCtrl', function($scope, $state, $http, $window, $ionicLoading, Server) {

        $scope.user = {email:'', password:''};

        $scope.login = function (user) {

            if(user.email && user.password){
                $http.post(Server.url + 'user/login', {'email': user.email, 'password': user.password}).
                    success(function(data, status, headers, config) {
                        console.log(data.activated);
                        if(data.activated){
                            $window.sessionStorage.token = data.token;
                            $state.go('home');
                        }else{
                            delete $window.sessionStorage.token;
                        }

                        $ionicLoading.hide();
                    }).
                    error(function(data, status, headers, config) {
                        console.log("Can´t login");
                        delete $window.sessionStorage.token;
                        $ionicLoading.hide();
                    });
            }else{
                console.log("Email or Password missing!")
            }
        };
    })
;
