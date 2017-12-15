angular.module('psdnetAppControllers').controller('mainController', function ($scope, $state, $http, $interval, $location, $rootScope, $anchorScroll) {


  $rootScope.modalOpen = false;
  $rootScope.modalForced = false;



  $scope.typeof = function(val) {
    return typeof val;
  }

  //, cfpLoadingBar, $timeout
  //UNIV LOADER!!!!!
  //  $scope.start = function() {
  //   cfpLoadingBar.start();
  // };

  // $scope.complete = function () {
  //   cfpLoadingBar.complete();
  // }


  // fake the initial load so first time users can see it right away:
  //$scope.start();
  // $scope.fakeIntro = true;
  // $timeout(function() {
  //   $scope.complete();
  //   $scope.fakeIntro = false;
  // }, 750);

  //List of routes NOT to add the blank buffer to.
  //'contact
  var bufferRouteExceptions = ['profiles', 'contact', 'signup.mentor-form', 'signup.mentee-form', 'signup.mentor-info', 'signup.mentee-info', 'signup.mentorship',
    'terms-and-conditions', 'mentorship-program-agreement', 'narratives', 'profile.matches', 'profile.assignedMentor',
    'profile.assignedMentees', 'profile.modules', 'contentManager', 'contentManager.accounts', 'contentManager.timeline',
    'contentManager.pages', 'profile.activity', 'contentManager.forums', 'contentManager.calendar', 'contentManager.reports',
    'profile.mentorship', 'standalone-module'];
  //add the blank page buffer on route change.
  //DISABLED BACK BUFFER FOR PRESENTATION
  //WS: READDED JUST THE CURRENT PATH FOR THE MODUlE
  $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
    $scope.currentPath = $location.path();
  })
  /*

    console.log(toState.name);
    if(bufferRouteExceptions.includes(toState.name)){
      console.log('Skipping buffer');
      return;
    }
    console.log("Starting route change!");
    $('#page-buffer').css('display', 'block');
  });*/

  assignActiveNav();


  $rootScope.PageLoaded = function () {
    $('#page-buffer').css('display', 'none');
  }

  //help popovers
  $scope.HelpMap = {
    //state names
    home: {
      mainHelp: {
        title: 'mainHelp Title',
        content: 'mainHelp content'
      },
      other: {
        title: 'other Title',
        content: 'other content'
      }
    },
    profile: {
      calendar: {
        title: 'Calendar help title',
        content: 'Calendar help content.'
      }
    }
  };
  createGeneralHelpPopover();

  function createGeneralHelpPopover() {
    /*var pageId = $location.$$path;
    pageId = pageId.substring(1, pageId.length);
    console.log(pageId);
    var page = $scope.HelpMap[pageId];

    var popoverTemplate;
    var body = $('body');
    $('.popover').remove();
    for (var pop in page) {
        if (!page.hasOwnProperty(pop)) continue;

        console.log(page[pop].content);

        popoverTemplate = $(
          '<script class="popover" type="text/ng-template">'+
          '</script>');
        body.append(popoverTemplate);
    }*/
  }


  $rootScope.$on("$stateChangeSuccess", function (event, toState, toParams, fromState, fromParams) {
    createGeneralHelpPopover();

    // console.log("before check: " + $rootScope.userProfile);
    // console.log(toState.name)
    //   switch (toState.name){
    //   case "signup.metee-form":
    //   case "signup.mentor-form":
    //   console.log("going back to signup page");
    //   console.log("after check: " + $rootScope.userProfile);
    //   $location.path( "/signup/user");
    //   }
  })

  $rootScope.chatAuthorized = false;
  //$rootScope.userProfile = false;
  $rootScope.newMessages = 0;
  $rootScope.chatStatus = [];

  $scope.newMessagesCount = 0;

  $scope.chat = null;
  $scope.chatid = null;

  $scope.loginMessage = null;

  //login checker
  //ensure you are logged in, if not, then open up modal
  $scope.loggedIn = function () {
    if (!$rootScope.userProfile) {
      console.log("not logged in, opening modal");
      if (!$rootScope.modalOpen) {
        $rootScope.modalOpen = true;
        $rootScope.modalForced = true;
        setTimeout(() => {
          console.log("triggermodal");
          angular.element('#nav-login').triggerHandler('click');
        });
      }
      return false;
    } else if ($rootScope.userProfile.status == 'unverified') {
      $state.go('signup.mentorship', {}, {location: 'replace'});
      return false;
    }
    return true;
  }


  $rootScope.profileRedirect = function(status, toState, event) {
    var redirect;

    switch (status) {
      case 'unverified'://temp, will be deleted after 24h if account is not verified.
        redirect = 'signup.mentorship';
        break;
      case 'verified'://community account
        redirect = 'profile.calendar';
        break;
      case 'menteeInTraining'://after applying for mentorship. While training if incomplete. School email not verified.
      case 'menteeSeeking'://Once a mentee is vetted and before a mentor as been found.
        if ($rootScope.userProfile.mentee[0].completedProgram) {
          redirect = 'profile.calendar';
        } else {
          redirect = 'profile.timeline';
        }
        break;
      case 'mentee'://mentee during the program.
        $rootScope.chatAuthorized = false;
        redirect = 'profile.timeline';
        break;
      case 'mentorInTraining'://after applying for mentorship. While training if incomplete. Police check not verified.
        redirect = 'profile.timeline';
        break;
      case 'mentor'://mentor that is accepting mentee requests.
        $rootScope.chatAuthorized = false;
        console.log($rootScope.userProfile.mentor[0].mentees);
        if ($rootScope.userProfile.mentor[0].mentees.length > 0) {
          redirect = 'profile.calendar';
        } else {
          redirect = 'profile.mentorship';
        }
        break;
      case 'admin':
        redirect = 'adminPanel';
        break;
      default:
        redirect = 'home';
    }

    console.log("redirecting to "+redirect);

    if (toState == undefined || toState != redirect) {
      $rootScope.validateStateMovement(redirect, true, event);
    }
  }

  $rootScope.validateStateMovement = function(toState, replace, event) {
    // console.log("state: ",toState);
    // console.log($state.current.name);
    // console.log(event);
    // if (event != undefined && $state.current.name == toState) {
    //   console.log("event prevented");
    //   event.preventDefault();
    //   $state.reload();
    // } else {
      if (replace) {
        $state.go(toState, {}, {location: 'replace'});
      } else {
        $state.go(toState);
      }
    // }
  }


  $scope.isEmpty = function(obj) {
    for (let prop in obj)
      if (obj.hasOwnProperty(prop))
        return false;
    return true;
  };
  $scope.isObject = function(test) {
    if (test instanceof Object) {
      return true;
    }
    return false;
  };


  //nav expanded
  $(document).on('show.bs.collapse', '#main-nav', function () {
    $('body').css('overflow', 'hidden');
    $('nav.navbar + .noclick').show();
  });
  //nav collapsed
  $(document).on('hidden.bs.collapse', '#main-nav', function () {
    $('body').css('overflow', '');
    $('nav.navbar + .noclick').hide();
  });
  //nav ignored
  $(document).on('click', function (e) {
    var container = $('nav.navbar');
    var nav = container.find('#main-nav');
    if (nav.hasClass('in') && !container.is(e.target) && container.has(e.target).length === 0) {
      nav.collapse('hide');
    }
  });
  //nav followed
  $(document).on('click', 'nav.navbar', function (e) {
    var nav = $(this).find('#main-nav');
    if (nav.hasClass('in') && ($('.navbar-link').is(e.target) || $('.navbar-link').has(e.target).length)) {
      nav.removeClass('in').addClass('collapse');
      $('body').css('overflow', '');
      $('nav.navbar + .noclick').hide();
    }
  });
  //nav relaxed
  var mq = window.matchMedia("(min-width: 768px)"); //768px after bootstrap
  mq.addListener(function () {
    if (mq.matches) {
      $('#main-nav').removeClass('in').addClass('collapse');
      $('body').css('overflow', '');
      $('nav.navbar + .noclick').hide();
    }
  });

  /* //anchor positioning
   var m30 = window.matchMedia("(min-width:30em)");
   m30.onchange = function(){adjustAnchorHeight();};
   var m45 = window.matchMedia("(min-width:45em)");
   m45.onchange = function(){adjustAnchorHeight();};
   var m48 = window.matchMedia("(min-width:48em)");
   m48.onchange = function(){adjustAnchorHeight();};
   var m60 = window.matchMedia("(min-width:60em)");
   m60.onchange = function(){adjustAnchorHeight();};
   var m75 = window.matchMedia("(min-width:75em)");
   m75.onchange = function(){adjustAnchorHeight();};
   $scope.$on('$viewContentLoaded',function(event){adjustAnchorHeight();});
   //$(window).bind('load',function(event){adjustAnchorHeight();});
 
   function adjustAnchorHeight() {
     console.log('adjusting anchors');
     var anchors = $('a.anchor');
     var val = -$('.navbar-header').outerHeight();
     if (window.location.href.split("#")[1].split("/")[1] == "profile") {
       val -= $('.dash-offset').css('margin-top').split("px")[0];
       console.log('profile');
     }
     anchors.each(function() {
       console.log($(this));
       $(this).css('top',val);
     });
   }*/

  $scope.gotoAnchor = function (anchor) {
    console.log('going to anchor ' + anchor)
    var newHash = anchor;
    if ($location.hash() !== newHash) {
      // set the $location.hash to `newHash` and
      // $anchorScroll will automatically scroll to it
      $location.hash(anchor);
    } else {
      // call $anchorScroll() explicitly,
      // since $location.hash hasn't changed
      $anchorScroll();
    }
  };

  $scope.gotoAnchorAndForget = function(anchor) {
    var element = $('#'+anchor);
    if (element) {
      var newScroll = element.offset().top - $anchorScroll.yOffset();
      $(window).scrollTop(newScroll);
    }
  }



  $scope.$on('$viewContentLoaded', function (event) {

    if (typeof $state.$current.data != 'undefined') {
      document.title = $state.current.data.pageTitle + " - CommunAbility";
    }
    else {
      document.title = "Home - CommunAbility";
    }
    assignActiveNav();

  });



  $scope.$on('$locationChangeStart', function (event) {

    window.scrollTo(0, 0);

    var dashnav = $('.dashnav ul').css({
      transition: '0s',
    });
    setTimeout(function () {
      dashnav.css({
        right: 0
      });
    });
    setTimeout(function () {
      dashnav.css({
        transition: '0.1s',
      });
    });

  });

  function assignActiveNav() {
    //removed at Charles' request
    /*var currentSection = $state.current.name.split(".")[0];
    console.log(currentSection);

    if (currentSection != "") {
      var mainNav = $('nav.navbar-custom ul.navbar-nav');
      var actives = mainNav.children('li.active');

      var newActive = true;
      if (actives.length > 0) {
        actives.each(function(){
          if ($(this).hasClass(currentSection)) {
            newActive = false;
          } else {
            $(this).removeClass('active');
          }
        });
      }

      if (newActive) {
        mainNav.children('li.nav-'+ currentSection)
          .addClass('active');
      }
    }*/
  }

  $rootScope.userIsMentee = function() {
    if (!$scope.userProfile) {
      return undefined;
    }
    switch($scope.userProfile.status) {
      case 'menteeInTraining':
      case 'menteeSeeking':
      case 'mentee':
        return true;
      case 'mentorInTraining':
      case 'mentor':
        return false;
      default:
        return undefined;
    }
  }

  var displayedDates = [[], [], [], []];
  $scope.UpdateChat = function () {
    displayedDates = [[], [], [], []];

    $scope.chats = {
      'current': [],
      'past': []
    };
    if (!$rootScope.chatAuthorized) {
      return;
    }


    var mentee, mentor;

    let isMentee = $rootScope.userIsMentee();
    if (isMentee) {
      mentee = $scope.userProfile.email;
      //current chats
      mentor = $scope.userProfile.mentee[0].mentor;
      getChats(true, mentee, mentor);
      //past chats
      for (let i=0; i<$scope.userProfile.mentee[0].pastMentors.length; ++i) {
        mentor = $scope.userProfile.mentee[0].pastMentors[i];
        getChats(false, mentee, mentor, i)
      }
    } else {
      mentor = $scope.userProfile.email;
      //current chats
      for (let i=$scope.userProfile.mentor[0].mentees.length-1; i>=0; --i) {
        mentee = $scope.userProfile.mentor[0].mentees[i];
        getChats(true, mentee, mentor);
      }
      //past chats
      for (let i=0; i<$scope.userProfile.mentor[0].pastMentees.length; ++i) {
        mentee = $scope.userProfile.mentor[0].pastMentees[i];
        getChats(false, mentee.email, mentor, mentee.index)
      }
    }

    function getChats(currentChats, mentee, mentor, index = -1) {
      $http.post('/chat/Update', {
        'mentee': mentee,
        'mentor': mentor,
        'index': index,
        'auth': $rootScope.chatAuthorized
      }).then(function (response) {

        console.log(response);

        var time;
        currentChats ? time = 'current' : time = 'past';
        
        $scope.chats[time].splice(0,0,response.data.chats)

        if ($scope.chats[time][0]) {
          var numberOfChats = 4;
          for (var i = 0; i < numberOfChats; i++) {
            for (var j = 0; j < $scope.chats[time][0][i].messages.length; j++) {
              if (DateCheck($scope.chats[time][0][i].messages[j].date, i)) {
                var dateSeparator = {
                  date: $scope.chats[time][0][i].messages[j].date,
                  id: $scope.chats[time][0][i].messages[j].id + 0.5,
                  flag: "dateSeparator",
                  status: "marker",
                  content: "",
                  sender: ""
                };

                $scope.chats[time][0][i].messages.splice(j, 0, dateSeparator);
              }
            }

          }
        }
      });
    }
  };

  $interval(CheckForNewMessages, 2000);
  function CheckForNewMessages() {
    if ($rootScope.userProfile) {
      if ($scope.userProfile.status === 'mentor' || $scope.userProfile.status === 'mentorFull') {
        if ($rootScope.userProfile.mentor[0].mentees.length == 0)
          return;
      }
      if ($scope.userProfile.status === 'mentee' || $scope.userProfile.status === 'mentor' || $scope.userProfile.status === 'mentorFull') {
        $http.get('/chat/checkForNewMessages').then(function (res) {
          console.log(res.status);
          if (res.status == 401 || res.status == 400) {
            $rootScope.userProfile = null;
            $state.go('home');
          }
          if (res.data.messages.length > 1) {
            if ($scope.newMessages < res.data.messages[0] + res.data.messages[1]) {
              $scope.UpdateChat();
            }
            $scope.newMessages = res.data.messages[0] + res.data.messages[1];
          }
          else {
            if ($scope.newMessages < res.data.messages) {
              $scope.UpdateChat();
            }
            $scope.newMessages = res.data.messages;
          }
          $rootScope.chatStatus = res.data.chatStatus;
        });
      }
    }
  };

  DateCheck = function (msgDate, chat) {


    var temp = new Date(msgDate);
    var simpleDate = "" + temp.getFullYear() + temp.getMonth() + temp.getDate();
    if (displayedDates[chat].indexOf(simpleDate) === -1) {

      displayedDates[chat].push(simpleDate);
      return true;
    }
    return false;
  };
  $scope.logout = function () {
    $rootScope.userProfile = false;
    $rootScope.newMessages = null;
    $http.get('/logout').then(function (res) {
      if (res) {
        console.log("Log out successful");
      }
      $state.reload(); //to forcefully get rid of ghost account
    });

  };
  // first add raf shim
  // http://www.paulirish.com/2011/requestanimationframe-for-smart-animating/
  window.requestAnimFrame = (function () {
    return window.requestAnimationFrame ||
      window.webkitRequestAnimationFrame ||
      window.mozRequestAnimationFrame ||
      function (callback) {
        window.setTimeout(callback, 1000 / 60);
      };
  })();
});
