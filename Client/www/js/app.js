angular.module('iTRides', ['ionic', 'iTRides.homeControllers', 'iTRides.searchControllers', 'iTRides.profileControllers',
    'iTRides.loginControllers','iTRides.resetPasswordControllers', 'iTRides.footerControllers', 'iTRides.createRideControllers', 'iTRides.signupControllers',
    'iTRides.loadingControllers', 'iTRides.listRidesControllers', 'iTRides.listRequestedRidesControllers','iTRides.rideDetailsControllers',
    'iTRides.listCreatedRidesControllers', 'iTRides.editProfileControllers', 'iTRides.createWorkLocationControllers', 'iTRides.services'])

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

            .state('loading', {
                url: "/loading",
                views: {
                    'content': {
                        templateUrl: 'templates/loading.html',
                        controller: 'LoadingCtrl'
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

            .state('resetPassword', {
                url: "/resetPassword",
                views: {
                    'content': {
                        templateUrl: 'templates/resetPassword.html',
                        controller: 'ResetPasswordCtrl'
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
                url: "/rideDetails/:rideID",
                views: {
                    'header': {
                        templateUrl: 'templates/header.html',
                        controller: ''
                    },
                    'content': {
                        templateUrl: 'templates/rideDetails.html',
                        controller: 'RideDetailsCtrl'
                    },
                    'footer': {
                        templateUrl: 'templates/footer.html',
                        controller:'FooterCtrl'
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
                        //controller: 'CreateRideCtrl as creatRideCtrl'
                    },
                    'footer': {
                        templateUrl: 'templates/footer.html',
                        controller:'FooterCtrl'
                    }
                }
            })

            .state('createWorkLocation', {
                url: "/createWorkLocation",
                views: {
                    'header': {
                        templateUrl: 'templates/header.html',
                        controller: ''
                    },
                    'content': {
                        templateUrl: 'templates/createWorkLocation.html',
                        controller: 'CreateWorkLocationCtrl'
                    },
                    'footer': {
                        templateUrl: 'templates/footer.html',
                        controller:'FooterCtrl'
                    }
                }
            })

            .state('listRides', {
                url: "/listRides",
                views: {
                    'header': {
                        templateUrl: 'templates/header.html',
                        controller: ''
                    },
                    'content': {
                        templateUrl: 'templates/listRides.html',
                        controller: 'ListRidesCtrl'
                    },
                    'footer': {
                        templateUrl: 'templates/footer.html',
                        controller:'FooterCtrl'
                    }
                }
            })

			.state('listRequestedRides', {
                url: "/listRequestedRides",
                views: {
                    'header': {
                        templateUrl: 'templates/header.html',
                        controller: ''
                    },
                    'content': {
                        templateUrl: 'templates/listRequestedRides.html',
                        controller: 'listRequestedRidesCtrl'
                    },
                    'footer': {
                        templateUrl: 'templates/footer.html',
                        controller:'FooterCtrl'
                    }
                }
            })
			.state('editProfile', {
                url: "/editProfile",
                views: {
                    'header': {
                        templateUrl: 'templates/header.html',
                        controller: ''
                    },
                    'content': {
                        templateUrl: 'templates/editProfile.html',
                        controller: 'EditProfileCtrl'
                    },
                    'footer': {
                        templateUrl: 'templates/footer.html',
                        controller:'FooterCtrl'
                    }
                }
            })

			.state('listCreatedRides', {
                url: "/listCreatedRides",
                views: {
                    'header': {
                        templateUrl: 'templates/header.html',
                        controller: ''
                    },
                    'content': {
                        templateUrl: 'templates/listCreatedRides.html',
                        controller: 'listCreatedRidesCtrl'
                    },
                    'footer': {
                        templateUrl: 'templates/footer.html',
                        controller:'FooterCtrl'
                    }
                }
            })
        ;

        // if none of the above states are matched, use this as the fallback
        $urlRouterProvider.otherwise('/loading');
    });
