angular.module('iTRides.editProfileControllers', [])

    .controller('EditProfileCtrl', function($scope,$http,$ionicLoading, $timeout, Server, $window, $state) {

		$http.get(Server.url + 'api/profile/getProfileInfo').
	        success(function(data, status, headers, config) {
	          	$scope.user = data;
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


    $scope.submitChanges = function(new_name, new_contact, old_password, new_password, confirm_new_password) {
      	      
      	if(new_name == "" || new_name==undefined) {
      		new_name = $scope.user.name;
      		console.log("name unchanged");
      	}

      	if(new_contact == "" || new_contact==undefined){
      		new_contact = $scope.user.contact;
      		console.log("contact unchanged");	
      	}

      	if (old_password == "" || old_password == undefined) {
      		$http.post(Server.url + 'api/profile/updateProfile', 
	      	{
	      		'name' : new_name,
		        'contact': new_contact
		    })
		        .success(function(data, status, headers, config) {
		            if(data)
		                $state.go('profile'); 
		            $ionicLoading.hide();
		        })
		        .error(function(data, status, headers, config) {
		            console.log("Error updating information " + status);
		            $ionicLoading.hide();
	        });
      	} else if (new_password == confirm_new_password) {
      		console.log("changing password");
      		$http.post(Server.url + 'api/profile/updateProfilePassword', 
	      	{
	      		'name' : new_name,
		        'contact': new_contact,
		        'old_password' : old_password,
		        'new_password' : new_password
		    })
		        .success(function(data, status, headers, config) {
		            if(data)
		                $state.go('profile'); 
		            $ionicLoading.hide();
		        })
		        .error(function(data, status, headers, config) {
		            console.log("Error updating information " + status);
		            $ionicLoading.hide();
	        });
      	}



     


    }

   });