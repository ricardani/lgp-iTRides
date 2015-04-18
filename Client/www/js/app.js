angular.module('iTRides', ['ionic', 'iTRides.homeControllers', 'iTRides.searchControllers', 'iTRides.profileControllers',
    'iTRides.loginControllers', 'iTRides.footerControllers', 'iTRides.createRideControllers', 'iTRides.signupControllers',
     'iTRides.services'])

    .run(function($ionicPlatform) {
        $ionicPlatform.ready(function() {
            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)
            if(window.cordova && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            }
            if(window.StatusBar) {
                StatusBar.styleDefault();
            }
        });
    })

    .config(function($stateProvider, $urlRouterProvider) {
        $stateProvider

            .state('home', {
                url: "/home",
                views: {
                    'header': {
                        templateUrl: 'templates/header.html',
                        controller: ''
                    },
                    'content': {
                        templateUrl: 'templates/home.html',
                        controller: 'HomeCtrl'
                    },
                    'footer': {
                        templateUrl: 'templates/footer.html',
                        controller:'FooterCtrl'
                    }
                }
            })

            .state('search', {
                url: "/search",
                views: {
                    'header': {
                        templateUrl: 'templates/header.html',
                        controller: ''
                    },
                    'content': {
                        templateUrl: 'templates/search.html',
                        controller: 'SearchCtrl'
                    },
                    'footer': {
                        templateUrl: 'templates/footer.html',
                        controller:'FooterCtrl'
                    }
                }
            })

            .state('profile', {
                url: "/profile",
                views: {
                    'header': {
                        templateUrl: 'templates/header.html',
                        controller: ''
                    },
                    'content': {
                        templateUrl: 'templates/profile.html',
                        controller: 'ProfileCtrl'
                    },
                    'footer': {
                        templateUrl: 'templates/footer.html',
                        controller:'FooterCtrl'
                    }
                }
            })

            .state('rideDetails', {
                url: "/rideDetails",
                views: {
                    'header': {
                        templateUrl: 'templates/header.html',
                        controller: ''
                    },
                    'content': {
                        templateUrl: 'templates/rideDetails.html',
                        controller: ''
                    },
                    'footer': {
                        templateUrl: 'templates/footer.html',
                        controller:'FooterCtrl'
                    }
                }
            })

            .state('login', {
                url: "/login",
                views: {
                    'content': {
                        templateUrl: 'templates/login.html',
                        controller: 'LoginCtrl'
                    }
                }
            })

            .state('signup', {
                url: "/signup",
                views: {
                    'content': {
                        templateUrl: 'templates/signup.html',
                        controller: 'SignupCtrl'
                    }
                }
            })

            .state('createRide', {
                url: "/createRide",
                views: {
                    'header': {
                        templateUrl: 'templates/header.html',
                        controller: ''
                    },
                    'content': {
                        templateUrl: 'templates/createRide.html',
                        controller: 'CreateRideCtrl'
                    },
                    'footer': {
                        templateUrl: 'templates/footer.html',
                        controller:'FooterCtrl'
                    }
                }
            })

        ;

        // if none of the above states are matched, use this as the fallback
        $urlRouterProvider.otherwise('/login');
    });
