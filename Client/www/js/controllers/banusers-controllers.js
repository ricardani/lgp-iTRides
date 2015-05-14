angular.module('iTRides.banUsersControllers', [])

.controller('BanUsersCtrl', function($scope, $window, $state, $http, Server, $ionicLoading) {

    $http.post(Server.url + 'api/admin/getUsers').
        success(function(data, status, headers, config) {
            $scope.users = data;
			$scope.usersTemp = data;
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


    $scope.removeUser = function (index) {
        console.log(JSON.stringify($scope.users));

        $http.post(Server.url + 'api/admin/banUser', {
          "userID": $scope.users[index]._id
        }).
            success(function(data, status, headers, config) {
                $scope.users.splice(index, 1);
                $ionicLoading.hide();
            }).
            error(function(data, status, headers, config) {
                console.log(JSON.stringify(data));
                $ionicLoading.hide();
            });
    };
	
	$scope.filter = function (string) {
		$scope.users = $scope.usersTemp;
		var temp = [];
		for (i = 0; i < $scope.users.length; i++) { 
			if (($scope.users[i].name.toLowerCase().indexOf(string.toLowerCase()) !=-1) || ($scope.users[i].email.toLowerCase().indexOf(string.toLowerCase())!=-1)) {
				temp.push($scope.users[i]);
			}
		}
		$scope.users = temp;
	};
});
