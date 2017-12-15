angular.module('psdnetAppControllers').controller('mentorshipTabController', function ($scope, $rootScope, $http, $state) {


  var isMentee = $scope.userIsMentee();

  $scope.listOfMentees = [];
  // $scope.currentModule;
  // $scope.currentSlide = 0;
  // $scope.currentModuleIndex = 0;
  // $scope.completedSlide = 0;
  $scope.listOfModules = [];
  $scope.listOfResources = [];
  $scope.myMentor;

  //LoadModules();
  //LoadDocuments();
  LoadMatchInfo();


  //mentor module completion check
  $scope.modulesAllComplete = true;
  //go thru all the modules to see if you completed them
  function readModules() {
    $rootScope.userProfile.modules.forEach(function (element) {
      console.log("element", element);
      if (!element.completed) {
        $scope.modulesAllComplete = false;
      }
    }, this);
  }

  $scope.enterPostCompletion = function() {
    $http.post('/mentorships/passCompletionMessage')
      .then(function (res) {
        $state.reload();
      },
      function() {
        console.log("failed to pass beyond completion");
      });
  }

  $scope.makeDeclarations = function() {
    $http.post('/mentorship/makeDeclarations')
      .then(function(res){
        $state.reload();
      },
      function () {
        console.log("failed to declare!");
      });
  }

  $scope.reqMentor = function () {
    console.debug("modules complete", $scope.modulesAllComplete);
    console.debug("status", $rootScope.userProfile.status);
    if ($scope.modulesAllComplete && $rootScope.userProfile.status == "menteeInTraining") {
    console.log("request mentor, passed in profile", $scope.profile);
    $http.post('/mentorships/requestMentor', $scope.userProfile.mentee[0]).then(function (secondres) {
      console.log("mentor has been requested");
      $state.reload();
    })
    }
  }


  function LoadMatchInfo() {
    console.log($scope.userProfile.status);
    $http.post('/matched/getinfo').then(function (response) {
      console.log(response);
      if ($scope.userProfile.status == "mentee") {
        $scope.myMentor = response.data;
      }
      else if ($scope.userProfile.status == 'mentor' || $scope.userProfile.status == 'mentorFull') {
        if (response.data.length === 1) {
          $scope.listOfMentees.push(response.data[0]);
        }
        else {
          $scope.listOfMentees = response.data;
        }
      }
    });
  };

  if ($scope.userIsMentee())
  $scope.toggleMentorAcceptingMentees = function(accepting) {
    let removeFromPool = ! accepting;
    $http.post('/mentorships/setMentorAcceptingMentees', {'removeFromPool': removeFromPool})
      .then(function(res){
        $scope.acceptingMentees = accepting;
      });
  }

  $scope.ViewMenteeTimeline = function(index) {
    $http.post('/mentorship/viewMenteeTimeline').then(function (response) {
    });
  };




  /* MENTEE'S MATCHES */

  //request for mentors. Will be called once we receive the confirmation of training completed and school email verified.
  $scope.TestMentorMatch = function(){

    $http.post('/mentorships/requestMentor', $scope.userProfile.mentee[0]).then(function(res){
      console.log(res);
    });
  };


  $scope.mentorMatches = null;

  $scope.CheckMentorMatches = function(){
    if($scope.userProfile.status === 'menteeSeeking'){
      $scope.mentorMatches = $scope.userProfile.mentee[0].matches;
    }
  };

  $scope.SelectMentor = function(mentoremail){
    console.log("Selecting");
    $http.post('/mentorships/selectMentor', {'mentor': mentoremail, 'mentee': $scope.userProfile.email}).then(function(res){
      $state.go('profile.mentorship');
    });
  };

  $scope.LoadMatchFunctionalities = function(){
    console.log("Load match functionalities");
    $('.match-profiles button').on('click', function(e) {
      console.log("clicked mentor");
      console.log($(this));
      actMentorNav($(this));
    });
    $('.section-nav > li > button').on('click', function(e) {
      let index = 1;
      if ($scope.mentorMatches.length >= 3) {
        index = 2;
      }
      console.log("hello",index);
      let autoFirstProfile = $('.match-profiles > li:nth-child('+ index +') button');
      actMentorNav(autoFirstProfile);
      actSectionNav($(this));
    });
  };
  $scope.LoadMatchFunctionalities();

  $scope.$on('$viewContentLoaded', function(e) { //runs twice loading profile itself
      $scope.CheckMentorMatches();
  });
  function actMentorNav(navPath) {
    navPath
      .off('click')
      .on('click', function(e){
        deactMentorNav($(this).parent());
      })
      .parent()
        .addClass('active')
        .siblings('.active').each(function(){
          $(this)
            .removeClass('active')
            .find('button')
              .off('click')
              .on('click', function(e) {
                actMentorNav($(this));
              })
              .find('p:last-of-type').text('+ more info');
        });

    var index = navPath.parent().index() + 1;
    switch (index) {
      case 1:
        css('.section-nav li.active .indicator', 'background-color', '#004F71 !important');
        css('.sections>button:last-child', 'background-color', '#004F71 !important');
        // css('.section-nav li.active h1', 'color', '#004F71 !important');
      break;
      case 2:
        css('.section-nav li.active .indicator', 'background-color', '#00C7B1 !important');
        css('.sections>button:last-child', 'background-color', '#00C7B1 !important');
        // css('.section-nav li.active h1', 'color', '#00C7B1 !important');
      break;
      case 3:
        css('.section-nav li.active .indicator', 'background-color', '#E40046 !important');
        css('.sections>button:last-child', 'background-color', '#E40046 !important');
        // css('.section-nav li.active h1', 'color', '#E40046 !important');
      break;
    }

    var section = $('.section-nav li.active').index() + 1;
    if (0==section) {
      section = 1;
      $('.section-nav li:first-child')
        .addClass('active')
        .siblings().find('button').each(function(){
          $(this)
            .off('click')
            .on('click', function(){
              actSectionNav($(this));
            });
        });
    }

    $('.content li:nth-child('+ index +')')
      .show()
      .children('section:nth-child('+ section +')')
        .show()
        .siblings('section').hide()
      .parent().siblings().each(function(){$(this).hide();});

    navPath.find('p:last-of-type').text('- less info');
    $('.sections>button:last-child').show();
  }

  function actSectionNav(navPath) {
    navPath
      .off('click')
      .parent()
        .addClass('active')
        .siblings('.active').each(function() {
          $(this)
            .removeClass('active')
            .find('button')
              .off('click')
              .on('click', function(){
                actSectionNav($(this));
              });
      });
    var mentor = $('.match-profiles li.active').index() + 1;
    var section = navPath.parent().index() + 1;
    $('.content li:nth-child('+ mentor +') section:nth-child('+ section +')')
      .show()
      .siblings('section').hide();
  }

  function deactMentorNav(navPath) {
    var mentor = navPath.index() + 1;
    navPath.removeClass('active');
    navPath.find('p:last-of-type').text('+ more info');
    var section = $('.section-nav .active').index() + 1;
    $('.section-nav .active').each(function(){$(this).removeClass('active')});
    $('.sections li:nth-child('+ mentor +') section:nth-child('+ section +')')
      .show();
    navPath.find('button')
      .off('click')
      .on('click', function(e){
        actMentorNav($(this));
      });
    $('.section-nav button').each(function(){
      $(this).off('click');
      $(this).on('click', function(e) {
        actMentorNav(navPath.children('button'));
        actSectionNav($(this));
      });
    })
    $('.sections>button:last-child').hide();
    $('.content li').hide();
  }

  /* DECLARATIONS */
  $scope.declarationChoices = [{'value':1},{'value':1},{'value':1}];
  $scope.declarationValues = [];
  $scope.updateDeclarationValue = function (choice) {
    $scope.declarationValues = $scope.declarationValues || [];
    if (choice.checked) {
      $scope.declarationValues.push(choice.value);
      //$scope.declarationValues = [...new Set($scope.value)];
    } else {
      $scope.declarationValues.splice(0,1);
      //$scope.declarationValues = _.without($scope.declarationValues, choice.value);
    }
  };

  $scope.consoleOutInputMeta = function(inputMeta) {
    console.log(inputMeta);
  }
  $scope.resetAllInteractedStates = function(inputMeta) {
    if (typeof inputMeta !== 'undefined') {
      for (let i in inputMeta) {
        (typeof inputMeta[i].beenBlurred !== 'undefined') ? inputMeta[i].beenBlurred = false : '';
        (typeof inputMeta[i].beenChanged !== 'undefined') ? inputMeta[i].beenChanged = false : '';
      }
    }
  };



  /*function LoadModules() {
    // $scope.listOfModules = [
    //   {
    //     'title': "Module Title",
    //     'source': "standalone-module",
    //     'phase': "Training",
    //     'content': "Description of module"
    //   },
    // ];
    $http.post('/modules/getinfo').then(function (response) {
      $scope.listOfModules = response.data;
      console.log(response);
    });
  };

  function LoadDocuments() {
    // $scope.listOfResources = [
    //   {
    //     'title': "Doc Title",
    //     'source': "/pdf/curriculum.pdf",
    //     'phase': "Phase 1",
    //     'content': "Description of document"
    //   },
    //   {
    //     'title': "Link Title",
    //     'source': "www.mediaaccess.org.au/",
    //     'phase': "Training",
    //     'content': "Description of link"
    //   },
    // ];
    $http.post('/documents/getinfo').then(function (response) {
      $scope.listOfResources = response.data;
      console.log(response);
    });
  };

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
        readModules();
      }
      //ADD MAX SLIDES
      $scope.userProfile.modules[$scope.currentModuleIndex].currentSlide = $scope.currentSlide;
      $scope.userProfile.modules[$scope.currentModuleIndex].completed = $scope.currentModule.completed;
      $scope.userProfile.modules[$scope.currentModuleIndex].completedSlide = $scope.completedSlide;
      $http.post('/modules/saveProgress', $scope.userProfile.modules[$scope.currentModuleIndex]).then(function (res) {
        console.log("mentee form signup response: ", res);
        console.log("current module completed: ", $scope.currentModule.completed);
        if ($scope.currentModule.completed) {
          //readModules();
          console.log("$scope.modulesAllComplete: ",$scope.modulesAllComplete);
          console.log("$rootScope.userProfile.status: ", $rootScope.userProfile.status);
          if ($scope.modulesAllComplete && $rootScope.userProfile.status == "mentorInTraining") {
            $http.post('mentor/setpending').then(function (res) {
              if (res.status == 200) {
                console.log("successfully became mentor pending");
              }
            });
          }
          console.log("true");
        }
      });
    }
  };*/

});
