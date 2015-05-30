angular.module('iTRides', ['ionic', 'ngCordova', 'ngFileUpload', 'ui.unique', 'iTRides.homeControllers' , 'iTRides.banUsersControllers', 'iTRides.searchControllers', 'iTRides.profileControllers',
    'iTRides.loginControllers','iTRides.resetPasswordControllers', 'iTRides.footerControllers', 'iTRides.createRideControllers', 'iTRides.signupControllers',
    'iTRides.loadingControllers', 'iTRides.listDefaultRidesControllers', 'iTRides.listRequestedRidesControllers','iTRides.rideDetailsControllers',
    'iTRides.listCreatedRidesControllers', 'iTRides.listWorkLocationControllers', 'iTRides.editProfileControllers', 'iTRides.editRideControllers', 'iTRides.createWorkLocationControllers',
    'iTRides.userInfoControllers', 'iTRides.services', 'iTRides.confirmAccountControllers', 'iTRides.listFeedbacksControllers','iTRides.adminpageControllers', 'iTRides.searchUsers'])

    .run(function($ionicPlatform) {
        $ionicPlatform.ready(function() {
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

            .state('networkError', {
                url: "/networkError",
                views: {
                    'content': {
                        templateUrl: 'templates/networkError.html',
                        controller: 'NetworkErrorCtrl'
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
                url: "/rideDetails/:rideID/:backState",
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
                url: "/createRide/:createNew",
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

            .state('editRide', {
                url: "/editRide/:rideID/:editType",
                views: {
                    'header': {
                        templateUrl: 'templates/header.html',
                        controller: ''
                    },
                    'content': {
                        templateUrl: 'templates/editRide.html',
                        controller: 'EditRideCtrl'
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
            .state('listWorkLocation', {
                url: "/listWorkLocation",
                views: {
                    'header': {
                        templateUrl: 'templates/header.html',
                        controller: ''
                    },
                    'content': {
                        templateUrl: 'templates/listWorkLocation.html',
                        controller: 'ListWorkLocationCtrl'
                    },
                    'footer': {
                        templateUrl: 'templates/footer.html',
                        controller:'FooterCtrl'
                    }
                }
            })

            .state('listDefaultRides', {
                url: "/listDefaultRides",
                views: {
                    'header': {
                        templateUrl: 'templates/header.html',
                        controller: ''
                    },
                    'content': {
                        templateUrl: 'templates/listDefaultRides.html',
                        controller: 'ListDefaultRidesCtrl'
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
            .state('userInfo', {
                url: "/userInfo/:userID",
                views: {
                    'header': {
                        templateUrl: 'templates/header.html',
                        controller: ''
                    },
                    'content': {
                        templateUrl: 'templates/userInfo.html',
                        controller: 'UserProfileCtrl'
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

            .state('banUsers', {
                url: "/banUsers",
                views: {
                    'header': {
                        templateUrl: 'templates/header.html',
                        controller: ''
                    },
                    'content': {
                        templateUrl: 'templates/banUsers.html',
                        controller: 'BanUsersCtrl'
                    },
                    'footer': {
                        templateUrl: 'templates/footer.html',
                        controller:'FooterCtrl'
                    }
                }
            })

            .state('confirmAccount', {
                url: "/confirmAccount",
                views: {
                    'content': {
                        templateUrl: 'templates/confirmAccount.html',
                        controller: 'ConfirmAccountCtrl'
                    }
                }
            })

            .state('listFeedbacks', {
                url: "/listFeedbacks",
                views: {
                    'header': {
                        templateUrl: 'templates/header.html',
                        controller: ''
                    },
                    'content': {
                        templateUrl: 'templates/listFeedbacks.html',
                        controller: 'ListFeedbacksCtrl'
                    },
                    'footer': {
                        templateUrl: 'templates/footer.html',
                        controller:'FooterCtrl'
                    }
                }
            })


            .state('adminPage', {
                url: "/adminPage",
                views: {
                    'header': {
                        templateUrl: 'templates/header.html',
                        controller: ''
                    },
                    'content': {
                        templateUrl: 'templates/adminPage.html',
                        controller: 'AdminCtrl'
                    },
                    'footer': {
                        templateUrl: 'templates/footer.html',
                        controller:'FooterCtrl'
                    }
                }
            })


            .state('searchUsers', {
                url: "/searchUsers",
                views: {
                    'header': {
                        templateUrl: 'templates/header.html',
                        controller: ''
                    },
                    'content': {
                        templateUrl: 'templates/searchUsers.html',
                        controller: 'SearchUsersCtrl'
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
