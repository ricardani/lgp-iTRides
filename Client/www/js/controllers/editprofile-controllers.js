angular.module('iTRides.editProfileControllers', [])

    .controller('EditProfileCtrl', function($scope,$http,$ionicLoading, $timeout, Server, $window, $state) {
      /*$scope.user = {
		name: 'Pedro Santos', contact: '918707722', email: 'pedromiguelsousasantos@hotmail.com', photo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTCDSF0HoaraKpFp0hwiYbZwF_1Ns3s3F8ttX3ySSZ7TlUGefrOEw'
	  };*/
		$http.get(Server.url + 'api/profile/getProfileInfo').
	        success(function(data, status, headers, config) {
	          	$scope.user = data;
	            $ionicLoading.hide();
	        }).
	        error(function(data, status, headers, config) {
	            console.log(JSON.stringify(config));
	            $ionicLoading.hide();
	    });


    $scope.submitChanges = function(new_name, new_contact) {
      	console.log('Name :' + new_name);
      	console.log(new_contact);
      
      	if(new_name == "" || new_name==undefined) {
      		new_name = $scope.user.name;
      		console.log("name unchanged");
      	}

      	if(new_contact == "" || new_contact==undefined){
      		new_contact = $scope.user.contact;
      		console.log("contact unchanged");	
      	}

      	newFirstName = new_name.substr(0,new_name.indexOf(' '));
		newLastName = new_name.substr(new_name.indexOf(' ')+1); 

      	/*$http.post(Server.url + 'user/updateInfo', {'firstName' : newFirstName,
	        'lastName' : newLastName,
	        'email': newEmail,
	        success(function(data, status, headers, config) {
	            if(data)
	                $state.go('profile'); 
	            $ionicLoading.hide();
	        }).
	        error(function(data, status, headers, config) {
	            console.log("Error updating information " + status);
	            $ionicLoading.hide();
        });*/



    }

   });