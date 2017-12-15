angular.module('psdnetAppControllers').controller('moduleController', function ($scope, $http) {
  //*****************PAGE-BUFFER**********// 
  setTimeout($scope.PageLoaded, 0); /******/
  //*****************PAGE-BUFFER**********// 
  $scope.currentModule;
  $scope.currentSlide = 0;
  $scope.currentModuleIndex = 0;
  $scope.completedSlide = 0;
  $scope.LoadModule = function (module, index) {
    $http.post('/modules/request', { "module": module }).then(function (res) {
      $scope.currentModuleIndex = index;
      $scope.currentModule = res.data;
      $scope.completedSlide = $scope.userProfile.modules[index].completedSlide;
      console.log(index);
      $scope.currentSlide = $scope.userProfile.modules[index].currentSlide;
      console.log("current module", $scope.currentModule);
      console.log("current slide", $scope.currentSlide);
    });
  };

  $scope.NextSlide = function (dir) {
    console.log("firing slide");
    $scope.currentSlide += dir;
    if ($scope.currentSlide < 0) {
      $scope.currentSlide = 0;
    }
    else if ($scope.currentSlide >= $scope.currentModule.slides.length) {
      $scope.currentSlide = $scope.currentModule.slides.length - 1;
    } else {
      if ($scope.currentSlide >= $scope.completedSlide) {
        $scope.completedSlide = $scope.currentSlide;
      }
      console.log("else firing slide");
      if (!$scope.currentModule.completed && $scope.currentSlide == $scope.currentModule.slides.length - 1) {
        $scope.currentModule.completed = true;
        //now go ahead and update the timeline status for event to "completed"
        $http.post('/updateEvent', $scope.userProfile.modules[$scope.currentModuleIndex]).then(function (res) {
          console.log("mentee form signup response: ", res);
          //call 
          if (res.status) {
            console.log("true");
          }
        })
      }

      //ADD MAX SLIDES
      $scope.userProfile.modules[$scope.currentModuleIndex].currentSlide = $scope.currentSlide;
      $scope.userProfile.modules[$scope.currentModuleIndex].completed = $scope.currentModule.completed;
      $scope.userProfile.modules[$scope.currentModuleIndex].completedSlide = $scope.completedSlide;
      $http.post('/modules/saveProgress', $scope.userProfile.modules[$scope.currentModuleIndex]).then(function (res) {
        console.log("mentee form signup response: ", res);
        if (res.status) {
          console.log("true");
        }
      });
    }
  };
});