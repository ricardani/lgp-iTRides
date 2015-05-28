angular.module('iTRides.editProfileControllers', [])

	.controller('EditProfileCtrl', function($scope, $http, $ionicLoading, $timeout, Server, $window, $state, Upload, $ionicPopup) {

		$http.get(Server.url + 'api/profile/getProfileInfo').
			success(function(data, status, headers, config) {
				$scope.user = data;
				/*if($scope.user.photo || $scope.user.photo.indexOf('http') === -1)
				 {
				 $scope.user.photo = Server.url + 'img?imgID=' + $scope.user.id + '.png';
				 console.log($scope.user.photo);
				 }*/
				$ionicLoading.hide();
			}).
			error(function(data, status, headers, config) {
				console.log(JSON.stringify(config));
				if(status === 401){
					delete window.sessionStorage.token;
					localStorage.removeItem('SessionToken');
					$state.go('login');
				}
				$ionicLoading.hide();
			});


			updateProfileError = function() {
				var alertPopup = $ionicPopup.alert({
                    title: 'Editar Perfil',
                    template: 'Ocorreu um erro ao editar o seu perfil. Por favor tente de novo.'
                });
			}

			updateProfileSuccess = function() {
				var alertPopup = $ionicPopup.alert({
                    title: 'Editar Perfil',
                    template: 'O seu perfil foi editado com sucesso!'
                });
			}

		$scope.submitChanges = function(new_name, new_contact, new_residency,old_password, new_password, confirm_new_password) {

			if(new_name == "" || new_name==undefined) {
				new_name = $scope.user.name;
			}

			if(new_contact == "" || new_contact==undefined){
				new_contact = $scope.user.contact;
			}

			if(new_residency == "" || new_residency==undefined){
				new_residency = $scope.user.residency;
			}

			if (old_password == "" || old_password == undefined) {
				$http.post(Server.url + 'api/profile/updateProfile',
					{
						'name' : new_name,
						'contact': new_contact,
						'residency' : new_residency
					})
					.success(function(data, status, headers, config) {
						if(data){
							$state.go('profile');
						}
						$ionicLoading.hide();
							updateProfileSuccess();
					})
					.error(function(data, status, headers, config) {
						updateProfileError();
						$ionicLoading.hide();
					});
			} else if (new_password == confirm_new_password) {
				$http.post(Server.url + 'api/profile/updateProfilePassword',
					{
						'name' : new_name,
						'contact': new_contact,
						'residency' : new_residency,
						'old_password' : old_password,
						'new_password' : new_password
					})
					.success(function(data, status, headers, config) {
						if(data){
							$state.go('profile');
						}
						$ionicLoading.hide();
						updateProfileSuccess();
					})
					.error(function(data, status, headers, config) {
						updateProfileError();
						$ionicLoading.hide();
					});
			}
		};


		$scope.preview = function(input) {
			if (input.files && input.files[0]) {
				var reader = new FileReader();

				reader.onload = function (e) {
					$('#previewImage').attr('src', e.target.result);
					console.log(e.target.result);
				};

				reader.readAsDataURL(input.files[0]);

				var file = input.files[0];
				Upload.upload({
					url: Server.url + 'api/profile/updateImg',
					method: 'POST',
					fields: {},
					file: file
				}).progress(function (evt) {
					var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
					//console.log('progress: ' + progressPercentage + '% ' + evt.config.file.name);
				}).success(function (data, status, headers, config) {
					//console.log('file ' + config.file.name + 'uploaded. Response: ' + data);
					var alertPopup = $ionicPopup.alert({
						title: 'Imagem de Perfil',
						template: 'Imagem foi alterada com sucesso!'
					});
					$ionicLoading.hide();
				});

			}
		}

	});