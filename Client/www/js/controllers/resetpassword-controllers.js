angular.module('iTRides.resetPasswordControllers', [])

	.controller('ResetPasswordCtrl', function($scope,$http,$ionicLoading, $timeout, Server, $window, $state) {



		$scope.resetPassword = function(email){
			console.log('email: ' + email);
			var new_password = Math.random().toString(36).slice(-8);
			$http.post(Server.url + 'user/resetPassword',
				{
					'email' : email,
					'password' : new_password
				})
				.success(function(data, status, headers, config) {
					// Send e-mail with new passwor
					if(data)
						$state.go('login');
					$ionicLoading.hide();
				})
				.error(function(data, status, headers, config) {
					console.log("Error reseting password: " + status);
					$ionicLoading.hide();
				});
		}

	});
