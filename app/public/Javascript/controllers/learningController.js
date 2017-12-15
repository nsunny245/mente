angular.module('psdnetAppControllers').controller('learningController', function($scope, $http){

  $scope.selected = -1;
  $scope.loadModule = function(index) {
    $('.profile-card-preview .profile-card-main-content').remove();
    if (index == $scope.selected) {
      $scope.selected = -1;
      $scope.gotoAnchorAndForget($scope.data[index].id);
    } else {
      $scope.selected = index;
      setTimeout(function() {
        $('.profile-card-main-content')
          .removeAttr('id')
          .clone()
          .insertAfter('.profile-card-preview:nth-child('+parseInt(index+1)+') .profile-card-preview-content')
          .find('.profile-card-img, .profile-card-name').remove();
        if (window.matchMedia("(min-width:30em)").matches) {
          $scope.gotoAnchorAndForget("profile-card-main");
        } else {
          $scope.gotoAnchorAndForget($scope.data[index].id);
        }
        // setTimeout(function() {
        //   $scope.$apply();
        // }, 0)
      }, 0);
    }
  }
  $scope.closeModule = function() {
    var index = $scope.selected;
    $scope.loadProfile($scope.selected); //closes
    $scope.gotoAnchorAndForget("profile-card-preview-"+ index);
  }

  $scope.colorHighlights = [
    "#00C7B1",
    "#004F71",
    "#E40046",
  ];

  $scope.modules = [];

  //*****************PAGE-BUFFER**********// 
  setTimeout($scope.PageLoaded, 0); /******/
  //*****************PAGE-BUFFER**********// 
  $scope.currentModule;
  $scope.currentSlide = 0;
  $scope.LoadModule = function(module, index){
    $http.post('/modules/request', { module } ).then(function(res){
      $scope.currentModule = res.data;
      $scope.currentSlide = $scope.userProfile.modules[index].currentSlide;
    });
  };
  $scope.NextSlide = function(dir){
    $scope.currentSlide+=dir;
    if($scope.currentSlide < 0 ){
      $scope.currentSlide = 0;
    }
    else if($scope.currentSlide >= $scope.currentModule.slides.length)
    {
      $scope.currentSlide = $scope.currentModule.slides.length-1;
    }
  };
});