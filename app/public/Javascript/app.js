
var psdnetApp = angular.module('psdnetApp',
  [
    'ngAria',//ng Aria make the website more accessible (see ng documentation).
    'ngRoute',
    'ngAnimate',
    'ui.bootstrap',
    'psdnetAppControllers',
    'psdnetApp.directives.pwCheck',
    'psdnetApp.directives.forum',
    'psdnetApp.directives.post',
    'psdnetApp.directives.psdnetChat',
    'psdnetApp.directives.psdnetMail',
    'psdnetApp.directives.psdnetDatePickerPopUp',
    "psdnetApp.directives.scrollDown",
    "psdnetApp.directives.Modals",
    "psdnetApp.directives.userForms",
    "psdnetApp.directives.home",
    'angular-timeline',
    //'angular-loading-bar',
    'bootstrapControllers',
    'ui.router',
    'angularCSS',
    'ngFileUpload',
    'uiRouterStyles',
    'ui.bootstrap.tabs',
    'ngScrollTo',
    'ngCookies',
    'ngResource',
    //'angular-page-loader',
    'ui.router.title',
    'ngLoadScript',
    'feeds'
  ])
//.config(function(cfpLoadingBarProvider) {
//cfpLoadingBarProvider.includeSpinner = true;
//});
//Constant definitions
psdnetApp.constant("CONSTS", (function () {
  return {
    TIMESLOTLENGTH: 1
  }
})());

psdnetApp.run(['$anchorScroll', function ($anchorScroll) {
  $anchorScroll.yOffset = function () {
    return $('.navbar-custom').outerHeight() + $('.dashboard').outerHeight();
  };
}]);

psdnetApp.config(['$stateProvider', '$urlRouterProvider', '$locationProvider', '$routeProvider', function ($stateProvider, $urlRouterProvider, $locationProvider, $routeProvider) {
  $urlRouterProvider.otherwise("/home");
  $stateProvider
    .state('test', {
      url: "/test",
      templateUrl: "views/testing.html",
      controller: 'testController',
      data: { pageTitle: 'Foobar' },
    })
    .state('home', {
      url: "/home",
      templateUrl: "views/home.html",
      controller: 'homeController',
      data: { pageTitle: 'Home' },
    })
    .state('about', {
      url: "/about",
      templateUrl: "views/About/about.html",
      controller: 'aboutController',
      data: { pageTitle: 'About' }
    })
    .state('contact', {
      url: "/contact",
      templateUrl: "views/About/contact.html",
      controller: "contactController",
      data: { pageTitle: 'Contact Us' }
    })
    .state('faqs', {
      url: "/faqs",
      templateUrl: "views/About/faqs.html",
      controller: "faqsController",
      data: { pageTitle: 'FAQ\'s' }
    })
    .state('research', {
      url: "/research",
      templateUrl: "views/About/research.html",
      // controller: "researchController",
      data: { pageTitle: 'Research Information' }
    })
    .state('mentorship', {
      url: "/mentorship",
      templateUrl: "views/Mentorship/mentorship.html",
      controller: 'mentorshipController',
      data: { pageTitle: 'Mentorship' }
    })
    .state('signup', {
      url: "/signup",
      templateUrl: "views/Mentorship/signup.html",
      controller: 'signupController',
      data: { pageTitle: 'Signup' }
    })
    .state('signup.user', {
      url: "/user",
      templateUrl: "views/Mentorship/Forms/userForm.html",
      parent: 'signup',
      data: { pageTitle: 'Signup' }
    })
    .state('signup.mentorship', {
      url: "/mentorship",
      templateUrl: "views/Mentorship/Forms/select-type.html",
      parent: 'signup',
      data: { pageTitle: 'Select mentorship' }
    })
    .state('signup.mentee-info', {
      url: "/mentee-info",
      templateUrl: "views/Mentorship/Forms/menteeInfo.html",
      parent: 'signup',
      data: { pageTitle: 'Information on mentorship' }

    })
    .state('signup.mentor-info', {
      url: "/mentor-info",
      templateUrl: "views/Mentorship/Forms/mentorInfo.html",
      parent: 'signup',
      data: { pageTitle: 'Information on mentorship' }
    })
    .state('signup.mentee-form', {
      url: "/mentee-form",
      templateUrl: "views/Mentorship/Forms/menteeForm.html",
      parent: 'signup',
      controller: 'signupController.mentee',
      data: { pageTitle: 'Mentorship application' }
    })
    .state('signup.mentor-form', {
      url: "/mentor-form",
      templateUrl: "views/Mentorship/Forms/mentorForm.html",
      parent: 'signup',
      controller: 'signupController.mentor',
      data: { pageTitle: 'Mentorship application' }
    })
    .state('terms-and-conditions', {
      url: "/terms-and-conditions",
      templateUrl: "views/Legal/terms.html",
      data: { pageTitle: 'Terms and Conditions' }
    })
    .state('privacy-policy', {
      url: "/privacy-policy",
      templateUrl: "views/Legal/privacyPolicy.html",
      data: { pageTitle: 'Privacy Policy' }
    })
    .state('mentorship-program-agreement', {
      url: "/mentorship-program-agreement",
      templateUrl: "views/Legal/mentorshipTerms.html",
      data: { pageTitle: 'Terms and conditions' }
    })
    .state('mEvaluation', {
      url: "/mEvaluation",
      templateUrl: "views/underconstruction.html",
      //templateUrl: "views/Mentorship/evaluation.html",
      controller: 'evaluationController'
    })
    .state('mTraining', {
      url: "/mTraining",
      templateUrl: "views/underconstruction.html",
      //templateUrl: "views/Mentorship/training.html",
      controller: 'trainingController'
    })
    .state('education', {
      url: "/education",
      templateUrl: "views/Education/education.html",
      controller: 'educationController',
      data: { pageTitle: 'Education' }

    })
    .state('education.learning-modules', {
      url: "/modules",
      templateUrl: "views/Education/learning.html",
      parent: 'education',
      controller: 'learningController',
      data: { pageTitle: 'Learning Modules' }
    })
    .state('education.podcasts-webinars', {
      url: "/podcasts-webinars",
      parent: 'education',
      templateUrl: "views/Education/podcasts-webinars.html",
      // templateUrl: "views/underconstruction.html",
      controller: 'podcastController',
      data: { pageTitle: 'Podcasts & Webinars' }
    })
    .state('education.library', {
      url: "/library",
      templateUrl: "views/Education/library.html",
      parent: 'education',
      controller: 'libraryController',
      data: { pageTitle: 'Library' }
    })

    .state('community', {
      url: "/community",
      templateUrl: "views/Community/communityHub.html",
      // controller: 'forumController',
      data: { pageTitle: 'Community' }
    })
    .state('community.forums', {
      url: "/forums",
      templateUrl: "views/Community/forums.html",
      parent: 'community',
      controller: 'forumController',
      data: { pageTitle: 'Forums' }
    })
    .state('community.forums.sub', {
      url: "/subforum",
      templateUrl: "views/Community/sub.html",
      parent: 'community',
      controller: 'forumSubController',
      data: { pageTitle: 'SubForum' },
      params: {
        forumParent: null,
        forumStart: null
      }
    })
    .state('community.forums.permalink', {
      url: "/forums/:postId",
      templateUrl: "views/Community/permalink.html",
      parent: 'community',
      controller: 'forumPermalinkController',
      data: { pageTitle: 'Forum Post Permalink' }
    })
    .state('community.forums.rules', {
      url: "/rules-and-guidelines",
      templateUrl: "views/Community/forum-rules.html",
      parent: 'community',
      data: { pageTitle: 'Forum Rules and Guidlines' }
    })

    .state('community.narratives', {
      url: "/narratives",
      templateUrl: "views/Community/narratives.html",
      parent: 'community',
      controller: 'comnarrativesController',
      data: { pageTitle: 'Inspirational Narratives' }
    })
    .state('community.profiles', {
      url: "/profiles",
      templateUrl: "views/Community/profiles.html",
      parent: 'community',
      controller: 'comprofilesController',
      data: { pageTitle: 'Digital Profiles' }
    })
    .state('profile', {
      url: "/profile",
      templateUrl: "views/Dashboard/profile.html",
      controller: 'profileController',
      data: { pageTitle: 'Profile' }
    })
    .state('profile.chat', {
      url: "/chat",
      templateUrl: "views/Dashboard/Dashboard_views/chat.html",
      controller: 'chatController',
      parent: 'profile',
      onExit: ['$http', function ($http) {
        //$http.post('chat/updateStatus', {'status' : 'away', 'chatID': 'all', 'menteeIndex': 'all'});
      }],
      data: { pageTitle: 'Chat' }
    })
    .state('profile.calendar', {
      url: "/calendar",
      templateUrl: "views/Dashboard/Dashboard_views/calendar.html",
      controller: 'calendarController',
      parent: 'profile',
      data: { pageTitle: 'Calendar' }
    })
    .state('profile.timeline', {
      url: "/timeline",
      templateUrl: "views/Dashboard/Dashboard_views/timeline.html",
      controller: 'timelineController',
      parent: 'profile',
      data: { pageTitle: 'Timeline' }
    })
    //this state is for mentor in training to review where they are
    .state('profile.checklist', {
      url: "/checklist",
      templateUrl: "views/Dashboard/Dashboard_views/checklist.html",
      controller: 'checklistController',
      parent: 'profile',
      data: { pageTitle: 'Checklist' }
    })
    .state('profile.activity', {
      url: "/activity",
      //templateUrl: "views/underconstruction.html",
      templateUrl: "views/Dashboard/Dashboard_views/activity.html",
      parent: 'profile',
      data: { pageTitle: 'Activity' }
    })
    .state('profile.settings', {
      url: "/settings",
      templateUrl: "views/Dashboard/Dashboard_views/settings.html",
      parent: 'profile',
      data: { pageTitle: 'Settings' }
    })
    .state('profile.achievement', {
      url: "/achievement",
      templateUrl: "views/underconstruction.html",
      //templateUrl: "views/Dashboard/Dashboard_views/achievement.html",
      parent: 'profile',
      data: { pageTitle: 'achievement' }
    })
    .state('profile.mentorship-type', {
      url: "/mentorship-type",
      templateUrl: "views/Dashboard/Dashboard_views/mentorship-type.html",
      parent: 'profile',
      data: { pageTitle: 'Mentorship-type' }
    })
    /*.state('profile.matches', {
      url: "/matches",
      templateUrl: "views/Dashboard/Dashboard_views/matches.html",
      parent: 'profile',
      controller: 'matchController',
      data: { pageTitle: 'Matches' }
    })*/
    .state('profile.mentorship', {
      url: "/mentorship",
      templateUrl: "views/Dashboard/Dashboard_views/mentorshipTab.html",
      controller: 'mentorshipTabController',
      parent: 'profile',
      data: { pageTitle: 'Mentorship' }
    })
    .state('profile.assignedMentor', {
      url: "/assignedMentor",
      templateUrl: "views/Dashboard/Dashboard_views/assignedMentor.html",
      parent: 'profile',
      data: { pageTitle: 'Your mentor' }
    })
    .state('profile.assignedMentees', {
      url: "/assignedMentees",
      templateUrl: "views/Dashboard/Dashboard_views/assignedMentees.html",
      parent: 'profile',
      data: { pageTitle: 'Your mentee(s)' }
    })
    .state('profile.modules', {
      url: "/modules",
      templateUrl: "views/Dashboard/Dashboard_views/modules.html",
      controller: 'moduleController',
      parent: 'profile',
      data: { pageTitle: 'Modules' }
    })
    //Articulate module 1 
    .state('articulate-mentorship-module', {
      url: "/mentorshipModule",
      templateUrl: "views/standalone-modules/module-1/articulate-mentorship-module.html",
      controller: 'mentorModuleController',
      params: {
        isIndependent: false,
      },
      data: { pageTitle: 'Mentorship Module' }
    })

    //ERIC's SH-STUFF
    .state('standalone-module', {
      url: "/standaloneModule",
      templateUrl: "views/standalone-modules/e_index.html",
      controller: 'ericController',
      params: {
        isIndependent: false,
      },
      data: { pageTitle: 'Eric Module' }
    })

    //ADMIN
    .state('adminPanel', {
      url: "/adminPanel",
      templateUrl: "views/adminPanel/adminPanel.html",
      controller: 'adminController'
    })
    .state('adminPanel.users', {
      url: "/adminPanel/users",
      templateUrl: "views/adminPanel/userManager.html",
      controller: 'adminController',
      parent: 'adminPanel'
    })
    .state('adminPanel.detailedUserView', {
      url: "/adminPanel/detailedUserView",
      templateUrl: "views/adminPanel/detailedUserView.html",
      controller: 'detailedUserController',
      parent: 'adminPanel',
      params: {
        user: null
      }
    })

    .state('adminPanel.timeline', {
      url: "/adminPanel/timelineManager",
      templateUrl: "views/adminPanel/timelineManager.html",
      controller: 'adminController',
      parent: 'adminPanel'
    })
    .state('adminPanel.pages', {
      url: "/adminPanel/pageManager",
      templateUrl: "views/adminPanel/pageManager.html",
      controller: 'adminController',
      parent: 'adminPanel'
    })
    .state('adminPanel.calendar', {
      url: "/adminPanel/calendarManager",
      templateUrl: "views/adminPanel/calendarManager.html",
      controller: 'adminController',
      parent: 'adminPanel'
    })
    .state('adminPanel.forums', {
      url: "/adminPanel/forums",
      templateUrl: "views/adminPanel/forums.html",
      controller: 'adminController',
      parent: 'adminPanel'
    }).
    state('adminPanel.reports', {
      url: "/adminPanel/reports",
      templateUrl: "views/adminPanel/reports.html",
      controller: 'adminController',
      parent: 'adminPanel'
    });
  //         $locationProvider.html5Mode({
  //   enabled: true,
  //   requireBase: false
  // });
  //this run is seperate from /login routing, it checks state of profile, not status
  //viewcontentloaded/loading might be better
}]).run(function ($rootScope, initProfileService, $state, $window, $location) {
  //GOOGLE ANALYTICS**********************************************
  // initialise google ANALYTICS                               //*
  $window.ga('create', 'UA-104294917-1', 'auto');               //*
  //* Comment out to disable
  // track pageview on state change                            //* There is also a section inside
  $rootScope.$on('$stateChangeSuccess', function (event) {     //* Index.html to disable.
    $window.ga('send', 'pageview', $location.path());        //*
  });                                                          //*
  //GOOGLE ANALYTICS**********************************************
  //TODO, add interecept to load css before state change full
  $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
    return initProfileService.loadVars()
      .then(function () {
        var userExists;
        $rootScope.userProfile ? userExists = true : userExists = false;
        var status;
        if (userExists) {
          status = $rootScope.userProfile.status;
          console.log(status);
        }
        //console.log(toState.name);
        switch (toState.name.split(".")[0]) {

          case "profile": //begin profile flow redirection

            if (userExists) {
              switch (toState.name) {
                case "profile":
                  $rootScope.profileRedirect(status, toState.name, event);
                  break;
                case "profile.calendar":
                case "profile.faqs":
                case "profile.settings":
                  if (status != 'unverified') {
                    break;
                  }
                case "profile.mentorship":
                  if (status != 'unverified' && status != 'verified') {
                    break;
                  }
                case "profile.timeline":
                  if (status != 'unverified' && status != 'verified' && status != 'mentor' && (status != 'menteeInTraining' && status != 'menteeSeeking' || ! $rootScope.userProfile.mentee[0].completedProgram)) {
                    break;
                  }
                case "profile.chat":
                  if (status == 'admin' || status == 'mentor' && ($rootScope.userProfile.mentor[0].mentees.length > 0 || $rootScope.userProfile.mentor[0].completedProgram) || status == 'mentee' || (status == 'menteeInTraining' || status == 'menteeSeeking') && $rootScope.userProfile.mentee[0].completedProgram && ! $rootScope.userProfile.mentee[0].completionMessage) {
                    let isMentee = $scope.userIsMentee()
                    if (isMentee && $rootScope.userProfile.mentee[0].completionMessage || ! isMentee && $rootScope.userProfile.mentor[0].completionMessage) {
                      $rootScope.profileRedirect(status, 'profile.mentorship', event);
                    }
                    break;
                  }
                case "profile.activity":
                  $rootScope.profileRedirect(status, toState.name, event);
              }
            } else {
              $rootScope.validateStateMovement('home', true, event);
            }
            break;

          case "signup": //begin signup flow redirection

            if (userExists) {
              switch (toState.name) {
                case "signup":
                  $state.go('signup.user', {}, { location: 'replace' });
                  break;
                case "signup.mentor-form":
                  if (status == 'unverified') {
                    $rootScope.validateStateMovement('signup.mentor-info', true, event);
                    break;
                  }
                case "signup.mentee-form":
                  if (status == 'unverified' || status == 'verified') {
                    if (status == 'unverified') {
                      $rootScope.validateStateMovement('signup.mentee-info', true, event);
                    }
                    break;
                  }
                case "signup.mentor-info":
                case "signup.mentee-info":
                case "signup.mentorship":
                case "signup.user":
                  if (status == 'unverified' || status == 'verified') {
                    switch (toState.name) { //listing valid pages, default invalid
                      case "signup.mentor-info":
                      case "signup.mentee-info":
                      case "signup.mentorship":
                        break;
                      default:
                        $rootScope.validateStateMovement('signup.mentorship', true, event);
                    }
                  } else {
                    $rootScope.profileRedirect(status, toState.name, event);
                  }
              }
            } else if (toState.name != 'signup.user') { //i.e. if not already there
              $rootScope.validateStateMovement('signup.user', true, event);
            }
            break;

          case "standalone-module":
          //$state.go("home");
          // default:
          //   $state.go("home")
          // }
        }
      })
  })
})
psdnetApp.filter("trustUrl", ['$sce', function ($sce) {
  return function (recordingUrl) {
    return $sce.trustAsResourceUrl(recordingUrl);
  };
}]);
