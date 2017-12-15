//Login modal
angular.module('bootstrapControllers').controller('loginModalCTR', function ($scope, $rootScope, $uibModal, $log) {
  $scope.passwordRetrival = false;
  $scope.open = function (size) {
    $rootScope.modalOpen = true;
    var modalInstance = $uibModal.open({
      animation: true,
      templateUrl: 'loginModal.html',
      controller: 'LoginInstanceCtrl',
      size: size,
      resolve: {
        items: function () {
          return $scope.items;
        }
      }
    });
    modalInstance.result.then(() => {
      console.log("clicked x");
      $rootScope.modalOpen = false;
      $rootScope.modalForced = false;
    }, () => {
      console.log("clicked outside");
      $rootScope.modalOpen = false;
      $rootScope.modalForced = false;
    })
    setTimeout(function () {
      $('.modal-body.login').parent().parent().css({
        'max-width': '27.5em',
        'margin-left': 'auto',
        'margin-right': 'auto'  
      });
    });
  };
});

// Please note that $uibModalInstance represents a modal window (instance) dependency.
// It is not the same as the $uibModal service used above.

angular.module('bootstrapControllers').controller('LoginInstanceCtrl', function ($scope, $rootScope, $uibModalInstance, items, $http, $state) {

  $scope.isPasswordRetrival = false;
  $scope.loginErrorMessage = '';
  $scope.passwordMessage = '';
  $scope.login = function () {
    $http.post('/login', { email: $scope.email, password: $scope.password }).then(function (res) {
      if (res) {
        console.log(res.data);
        $rootScope.userProfile = res.data;
        var pStatus = $rootScope.userProfile.status;
        if (pStatus === "mentee" || pStatus === "menteeInTraining" || pStatus === "menteeSeeking") {
          $rootScope.timelineEvents = $rootScope.userProfile.mentee[0].timeline;
          $rootScope.fullName = $rootScope.userProfile.mentee[0].firstName + " " + $rootScope.userProfile.mentee[0].lastName;
        } else if (pStatus === "mentor" || pStatus === "mentorInTraining" || pStatus === "mentorPending") {
          $rootScope.fullName = $rootScope.userProfile.mentor[0].firstName + " " + $rootScope.userProfile.mentor[0].lastName;
          $rootScope.timelineEvents = $rootScope.userProfile.mentor[0].timeline;

        };
        if ($rootScope.modalForced) {
          var state = $state.current.name;
          console.log(state);
          switch (state) {
            case 'community.forums':
              $state.go('community.forums');
              break;
            case 'community.forums.sub':
              $state.go('community.forums.sub');
              //emits event for forum login, to mark posts for votes. I don't think deletion is possible without retrieving the posts again
              $rootScope.$emit("forumLoginEvent", {});
              break;
            case 'community.forums.permalink':
              $state.go('community.forums.permalink');
              //emits event for forum login, to mark posts for votes. I don't think deletion is possible without retrieving the posts again
              $rootScope.$emit("forumLoginEvent", {});
              break;
            case 'mentorship':
              $state.go('signup.mentorship');
              break;
            case 'signup.user':
              $state.go('signup.mentorship', {}, { location: 'replace' });
              break;
            default:
              console.log("redirecting");
              $rootScope.profileRedirect(res.data.status);
          }
        } else {
          console.log("redirecting");
          $rootScope.profileRedirect(res.data.status);
        }

        $rootScope.modalOpen = false;
        $rootScope.modalForced = false;
        $uibModalInstance.close();
      }
    }, function (errCallback) {
      $scope.loginErrorMessage = 'Invalid username or password.';
    });
  };

  $scope.RetrievePassword = function () {
    $http.post('/passwordRetrieval', { email: $scope.email }).then(function (res) {
      console.log(res);
      if (res.data === true) {
        console.log("email sent");
        $scope.passwordMessage = "Password reset email sent.";
        $uibModalInstance.close();
      }
      else {
        console.log("email error");
        $scope.passwordMessage = res.data.message;
      }
    });
  };
  modalControls($scope, $uibModalInstance);

});
