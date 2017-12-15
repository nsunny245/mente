angular.module('psdnetAppControllers').controller('ericController', function ($scope, $compile, $http, $rootScope, $state, $window) {
	$window.canDoSlides = true;
	$window.profileType = "";
	//REGEX /([A-Z])/g
	if (!$rootScope.userProfile) {
		canContinue = false;
		return;
	}

	var e = $rootScope.userProfile.status.split(/([A-Z])/g)
	$window.profileType = e[0];
	var canContinue = true;
	var name = ""
	var module = {}

	//lazy loader transfer variables
	$scope.test = "TESTWSREER"; 

	function runChecker() {
		//only ones in training are allowed to "complete" the module
		//this prof check is slightly redundant
		if ($rootScope.userProfile.status === 'menteeInTraining') {
			name = "mentee intro"
		} else if ($rootScope.userProfile.status === 'mentorInTraining') {
			name = "mentor intro"
		} else {
			canContinue = false;
			console.log("invalid permissions");
			return;
		}
		moduleObj = {
			"currentSlide": 10,
			"completedSlide": 10,
			"completed": true,
			"name": name
		}
		$('#footer').append($compile('<button class="standard-button invisible" ng-click="changeState()" id = "end-button" >FINISH</button>')($scope));

		if (!$scope.$$phase) {
			$scope.$apply();
		}
	}
	//literally just checking for the first one...
	if ($rootScope.userProfile) {
		if (!($rootScope.userProfile.modules[0].completed)) {
			runChecker();
		} else {
			$window.canDoSlides = false;
		}
	} else {
		$state.go('home', {}, { reload: true, notify: true });
	}

	$scope.changeState = function () {
		if (canContinue) {
			console.log("finishing");
			//now go ahead and update the timeline status for event to "completed"
			$http.post('/modules/saveProgress', moduleObj).then(function (res) {
				console.log("form signup response: ", res);
				//call 
				if (res.status) {
					console.log("true, it worked, yay!");
					$state.go('profile.timeline', {}, { reload: true });
				}
			})
		} else {
			console.log("You cannot pass!");
		}
	}
})

/*
pass in the name of the module

name, string, completed

*/