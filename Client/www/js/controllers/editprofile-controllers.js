angular.module('iTRides.editProfileControllers', [])

    .controller('EditProfileCtrl', function($scope, $window, $state) {
      $scope.user = {
		name: 'Pedro Santos', contact: '918707722', email: 'pedromiguelsousasantos@hotmail.com', photo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTCDSF0HoaraKpFp0hwiYbZwF_1Ns3s3F8ttX3ySSZ7TlUGefrOEw'
	  };
    })
;