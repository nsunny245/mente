var uiBootstrapModal = angular.module('bootstrapControllers', []);

//shared functionality
var modalControls = function (scope, uibModalInstance) {
  scope.CloseModal = function () {
    uibModalInstance.close();
  };
  scope.cancel = function () {
    uibModalInstance.dismiss('cancel');
  };
}

//this modal pops open when you are trying to delete your profile
uiBootstrapModal.controller('profileDeleteModalCTR', function ($scope, $uibModal, $log) {
  $scope.open = function (size) {
    var modalInstance = $uibModal.open({
      animation: true,
      templateUrl: 'profileDeleteModal.html',
      controller: 'profileDeleteInstanceCtrl',
      size: size,
      resolve: {
        items: function () {
          return $scope.items;

        }
      }
    });
  };
});

//this modal pops open when you try to delete a forum post
uiBootstrapModal.controller('confirmPostDeleteButtonCTR', function ($scope, $uibModal, $log) {
  $scope.open = function (size) {
    var modalInstance = $uibModal.open({
      animation: true,
      templateUrl: 'confirmPostDeleteButton.html',
      controller: 'confirmPostDeleteButtonCtrl',
      scope: $scope,
      size: size,
      resolve: {
        items: function () {
          return $scope.items;
        }
      }
    });
  };
});

uiBootstrapModal.controller('confirmPostDeleteButtonCtrl', function ($scope, $uibModalInstance, items, $http, $state, $window, $rootScope) {
  modalControls($scope, $uibModalInstance);
});



//TODO!!! MAKE THIS WORK
uiBootstrapModal.controller('profileDeleteInstanceCtrl', function ($scope, $uibModalInstance, items, $http, $state, $window, $rootScope) {
  //deletes the profile, sends you back to main 
  $scope.deleteProfile = function (pass) {
    //check is password is valid
    $http.post('/confirmPassword', { email: $rootScope.userProfile.email, password: pass }).success(function (res) {
      if (!res) {
        $scope.pswError = true;
        setTimeout(() => $scope.pswError = false, 500);
      } else {
        $scope.pswError = false;
        var isMentee = $scope.userIsMentee();
        var name;
        switch (isMentee) {
          case true: name = $rootScope.userProfile.mentee[0].firstName +' '+ $rootScope.userIsMentee.mentee[0].lastName; break;
          case false: name = $rootScope.userProfile.mentor[0].firstName +' '+ $rootScope.userIsMentee.mentor[0].lastName; break;
          default: name = $rootScope.userProfile.username; break;
        }
        $http.post('/removeOwnProfile', { email: $rootScope.userProfile.email, name: name, userType: isMentee })
          .then(function (res) {
            if (res) {
              console.log(res.data);
              $uibModalInstance.close();
              $window.location.reload();
            }
          });
      }
    })
  };
  modalControls($scope, $uibModalInstance);
});

//mentor mentee signup modal
uiBootstrapModal.controller('menteeMentorModalCTR', function ($scope, $uibModal, $log) {
  $scope.open = function (tcType) {
    var modalInstance = $uibModal.open({
      animation: true,
      templateUrl: 'menteeMentorModal.html',
      controller: 'MenteeMentorInstanceCtrl',
      scope: $scope, //inherit the scope of the signup controller (parent)
      resolve: {
        items: function () {
          return $scope.tcType = tcType;
        }
      }
    });
  };
});

uiBootstrapModal.controller('MenteeMentorInstanceCtrl', function ($scope, $uibModalInstance, items, $http, $state) {
  $scope.tcType = items;
  //research shared controller scope !!TODO
  $scope.jsonTC = "TERMS AND CONDI";
  $http.post('/contentManager/loadTc', { tcType: $scope.tcType }).then(function successCallback(res) {
    console.log($scope.tcType);
    $scope.jsonTC = res.data;
  }), function errorCallback(res) {
    console.log(res);
  }
  modalControls($scope, $uibModalInstance);
});

//search modal
uiBootstrapModal.controller('searchModalCTR', function ($scope, $uibModal, $log) {
  $scope.open = function (size) {
    var modalInstance = $uibModal.open({
      animation: true,
      templateUrl: 'searchModal.html',
      controller: 'SearchInstanceCtrl',
      size: size,
      resolve: {
        items: function () {
          return $scope.items;
        }
      }
    });
  };
});

// Please note that $uibModalInstance represents a modal window (instance) dependency.
// It is not the same as the $uibModal service used above.
uiBootstrapModal.controller('SearchInstanceCtrl', function ($scope, $uibModalInstance, items, $http) {
  $scope.showSearchResults = false;
  $scope.searchResults = [{
    'title': 'Google',
    'link': 'http://www.google.com',
    'icon': '  glyphicon glyphicon-globe'
  },
  {
    'title': 'facebook',
    'link': 'http://www.facebook.com',
    'icon': ' glyphicon glyphicon-globe'
  },
  {
    'title': 'Amazon',
    'link': 'http://www.amazon.com',
    'icon': ' glyphicon glyphicon-globe'
  }];

  $scope.SearchSite = function () {
    if ($scope.search === '') {
      showSearchResults = false;
      $scope.searchResults = [{
        'title': 'Google',
        'link': 'http://www.google.com',
        'icon': '  glyphicon glyphicon-globe'
      },
      {
        'title': 'facebook',
        'link': 'http://www.facebook.com',
        'icon': ' glyphicon glyphicon-globe'
      },
      {
        'title': 'Amazon',
        'link': 'http://www.amazon.com',
        'icon': ' glyphicon glyphicon-globe'
      }];
    }
    else {
      showSearchResults = true;
      $http.post('/search/forum').then(function (response) {

        resultArray = response.data.topics;

        $scope.searchResults = [];
        for (i = 0; i < resultArray.length; i++) {
          if (resultArray[i].subject.toLowerCase().indexOf($scope.search.toLowerCase()) > -1) {
            var newItem = {};
            newItem.title = resultArray[i].subject;
            newItem.link = "#/cForum";
            newItem.icon = 'glyphicon glyphicon-comment';
            newItem.color = '#666666';
            $scope.searchResults.push(newItem);
          }
        }
      });
    }
  };
  modalControls($scope, $uibModalInstance);
});





uiBootstrapModal.directive('autoFocus', function ($timeout) {
  return {
    restrict: 'AC',
    link: function (_scope, _element) {
      $timeout(function () {
        _element[0].focus();
      }, 0);
    }
  };
});


uiBootstrapModal.controller('DatepickerPopupCTR', function ($scope) {

  $scope.setModel = function (time) {
    $scope.myDatePicker(time);
  };
  $scope.today = function () {
    $scope.dt = new Date();
  };
  $scope.today();

  $scope.clear = function () {
    $scope.dt = null;
  };

  $scope.inlineOptions = {
    customClass: getDayClass,
    minDate: new Date(),
    showWeeks: false
  };

  $scope.dateOptions = {
    dateDisabled: null, //change to disabled to remove weekends from selectables.
    formatYear: 'yy',
    maxDate: new Date(2020, 5, 22),
    minDate: new Date(),
    startingDay: 1
  };

  // Disable weekend selection
  function disabled(data) {
    var date = data.date,
      mode = data.mode;
    return mode === 'day' && (date.getDay() === 0 || date.getDay() === 6);
  }

  $scope.toggleMin = function () {
    $scope.inlineOptions.minDate = $scope.inlineOptions.minDate ? null : new Date();
    $scope.dateOptions.minDate = $scope.inlineOptions.minDate;
  };

  $scope.toggleMin();

  $scope.open1 = function () {
    $scope.popup1.opened = true;
  };

  $scope.open2 = function () {
    $scope.popup2.opened = true;
  };

  $scope.setDate = function (year, month, day) {
    $scope.dt = new Date(year, month, day);
  };

  $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
  $scope.format = $scope.formats[0];
  $scope.altInputFormats = ['M!/d!/yyyy'];

  $scope.popup1 = {
    opened: false
  };

  $scope.popup2 = {
    opened: false
  };

  var tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  var afterTomorrow = new Date();
  afterTomorrow.setDate(tomorrow.getDate() + 1);
  $scope.events = [
    {
      date: tomorrow,
      status: 'full'
    },
    {
      date: afterTomorrow,
      status: 'partially'
    }
  ];

  function getDayClass(data) {
    var date = data.date,
      mode = data.mode;
    if (mode === 'day') {
      var dayToCheck = new Date(date).setHours(0, 0, 0, 0);

      for (var i = 0; i < $scope.events.length; i++) {
        var currentDay = new Date($scope.events[i].date).setHours(0, 0, 0, 0);

        if (dayToCheck === currentDay) {
          return $scope.events[i].status;
        }
      }
    }

    return '';
  }
});

var MILLIWEEK = 604800000;
var MILLIDAY = 86400000;
var MILLIHOURS = 3600000;
//Number of weeks + - we can book an event with our mentor. Weeks start on Sundays.
var NUMBER_OF_WEEKS_PRIOR_OR_AFTER = 1;

function BuildEvents(mentorInfo, tsl, items) {

  var itemObject = JSON.parse(items);
  var bookByWeek = new Date(itemObject.bookByWeek);

  var earliestBooking = new Date(bookByWeek);
  earliestBooking.setDate(bookByWeek.getDate() - (NUMBER_OF_WEEKS_PRIOR_OR_AFTER * 7));
  var latestBooking = new Date(bookByWeek);
  // +1 because we want all the availability for the weeks starting sunday
  latestBooking.setDate(bookByWeek.getDate() + ((NUMBER_OF_WEEKS_PRIOR_OR_AFTER + 1) * 7));
  console.log(earliestBooking);
  console.log(latestBooking);

  var currentDate = new Date();
  var events = [];
  var startOfTheMonth = new Date();
  startOfTheMonth.setDate(1);
  var day = startOfTheMonth.getDay();
  startOfTheMonth.setTime(startOfTheMonth.getTime() - (day * MILLIDAY));

  for (var i = 0; i < 20; i++)//regular availability
  {
    for (var j = 0; j < 7; j++) {
      for (var k = 0; k < 3; k++) {
        if (mentorInfo.availability[j][k].available) {
          var skip = false;
          var currD = GenDate(startOfTheMonth, i, j, mentorInfo.availability[j][k].start);
          if (currD < earliestBooking || currD > latestBooking) {
            skip = true;
            break;
          }
          else {
            for (var l = 0; l < mentorInfo.blockedDates.length; l++) {
              var blockedD = new Date(mentorInfo.blockedDates[l].start);

              if (Math.abs(blockedD.getTime() - currD.getTime()) < 1000) {
                skip = true;
                break;
              }
            }
          }
          if (skip) { continue; }
          var newEvent = {
            start: GenDate(startOfTheMonth, i, j, mentorInfo.availability[j][k].start),
            end: GenDate(startOfTheMonth, i, j, mentorInfo.availability[j][k].start + tsl),
            className: ["available"],
            title: "Availability"
          };

          events.push(newEvent);

        }
      }
    }
  }
  for (var m = 0; m < mentorInfo.addedDates.length; m++) {
    var endD = new Date(mentorInfo.addedDates[m].start);

    var newEvent = {//We may want to mark theses as extras.
      start: new Date(mentorInfo.addedDates[m].start),
      end: new Date(endD.getTime() + tsl * 3600000),
      className: ["available"],
      title: "Availability"
    };
    events.push(newEvent);
  }
  console.log(events);
  return events;

};

function GenDate(start, weeks, day, time) {
  var genD = new Date(start);
  genD.setHours(time);
  var min = time % 1 === 0 ? 0 : 30
  genD.setMinutes(min);
  genD.setSeconds(0);
  genD.setMilliseconds(0);
  genD.setTime(genD.getTime() + (weeks * MILLIWEEK) + (day * MILLIDAY));
  return genD;
};



/* End of Mentorship Program Modals */
uiBootstrapModal.controller('closeRelationshipModalCTR', function ($scope, $uibModal, $log) {
  $scope.open = function (size) {
    var modalInstance = $uibModal.open({
      animation: true,
      templateUrl: 'closeRelationshipModal.html',
      controller: 'closeRelationshipModalCtrl',
      size: size,
      resolve: {
        items: function () {
          return $scope.items;
        }
      }
    });
    setTimeout(function () {
      $('.modal-body.end-state-modal').parent().parent().css({
        'max-width': '30em',
        'margin-left': 'auto',
        'margin-right': 'auto'  
      });
    });
  };
});
uiBootstrapModal.controller('closeRelationshipModalCtrl', function ($scope, $uibModalInstance, items, $http, $state, $window, $rootScope) {
  $scope.CloseRelationship = function (pass) {
    $http.post('/mentorships/closeRelationship').then(function (response) {
    });
  }
  modalControls($scope, $uibModalInstance);
});

uiBootstrapModal.controller('requestMentorModalCTR', function ($scope, $uibModal, $log) {
  $scope.open = function (size) {
    var modalInstance = $uibModal.open({
      animation: true,
      templateUrl: 'requestMentorModal.html',
      controller: 'requestMentorModalCtrl',
      size: size,
      resolve: {
        items: function () {
          return $scope.items;
        }
      }
    });
    setTimeout(function () {
      $('.modal-body.end-state-modal').parent().parent().css({
        'max-width': '30em',
        'margin-left': 'auto',
        'margin-right': 'auto'  
      });
    });
  };
});
uiBootstrapModal.controller('requestMentorModalCtrl', function ($scope, $uibModalInstance, items, $http, $state, $window, $rootScope) {
  $scope.RequestMentor = function () {
    $http.post('/mentorships/requestMentor').then(function (response) {
    });
  }
  modalControls($scope, $uibModalInstance);
});

uiBootstrapModal.controller('renewMentorshipModalCTR', function ($scope, $uibModal, $log) {
  $scope.open = function (size) {
    var modalInstance = $uibModal.open({
      animation: true,
      templateUrl: 'renewMentorshipModal.html',
      controller: 'renewMentorshipModalCtrl',
      size: size,
      resolve: {
        items: function () {
          return $scope.items;
        }
      }
    });
    setTimeout(function () {
      $('.modal-body.end-state-modal').parent().parent().css({
        'max-width': '30em',
        'margin-left': 'auto',
        'margin-right': 'auto'  
      });
    });
  };
});
uiBootstrapModal.controller('renewMentorshipModalCtrl', function ($scope, $uibModalInstance, items, $http, $state, $window, $rootScope) {
  $scope.RenewMentorship = function (pass) {
    $http.post('/mentorships/renewMentorship').then(function (response) {
    });
  }
  modalControls($scope, $uibModalInstance);
});



