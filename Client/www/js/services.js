var iTRides_Services = angular.module('iTRides.services', []);


iTRides_Services.factory('authInterceptor', function ($rootScope, $q, $window) {
    return {
        request: function (config) {
            config.headers = config.headers || {};
            if ($window.sessionStorage.token) {
                config.headers.Authorization = 'Bearer ' + $window.sessionStorage.token;
            }
            return config;
        },
        response: function (response) {
            if (response.status === 401) {
                // handle the case where the user is not authenticated
            }
            return response || $q.when(response);
        }
    };
});

iTRides_Services.config(function ($httpProvider) {
    $httpProvider.interceptors.push('authInterceptor');
    $httpProvider.interceptors.push(function($rootScope) {
        return {
            request: function (config) {
                $rootScope.$broadcast('loading:show');
                return config
            },
            response: function (response) {
                $rootScope.$broadcast('loading:hide');
                return response
            }
        }
    });

});

iTRides_Services.run(function($rootScope, $ionicLoading) {
    $rootScope.$on('loading:show', function() {
        $ionicLoading.show({template: '<ion-spinner icon="lines"></ion-spinner>'});
    });

    $rootScope.$on('loading:hide', function() {
        $ionicLoading.hide();
    })
});

iTRides_Services.factory('Server', function() {
    return {
        //url: 'http://localhost:5000/'
        url: 'https://itrides.herokuapp.com/'
    };
});
