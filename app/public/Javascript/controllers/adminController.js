angular.module('psdnetAppControllers').controller('adminController', function ($scope, $http) {

  ///Local variables
  //ACOUNT MANAGEMENT:
  //CALENDAR:
  var calendarStyles = {
    'default': {
      'backgroundColor': 'blue',
      'borderColor': 'red',
      'textColor': 'yellow'
    },
    'default1': { 'color': 'yellow' },
    'default2': { 'color': 'green' },
    'default3': { 'color': 'blue' },
    'default4': { 'color': 'purple' }
  }
  var calDataEvent = [];
  //PAGE CONTENT:
  //TIMELINE:
  ///Scope variables
  //ACCOUNT MANAGEMENT:
  $scope.featuredMentors = [];
  $scope.AvailableMentors = [];
  $scope.pendingMentors = [];
  //CALENDAR:
  $scope.tempCalEvent = {
    title: '',
    start: '2016-08-02',
  };
  //PAGE CONTENT:  
  $scope.updateMessageResult = '';
  $scope.updateTimelineMessage = '';
  $scope.hasSelectedAPage = false;
  $scope.CurrentlyEditing = null;
  $scope.resetVerify = false;
  $scope.messagePile = { messages: {} };
  $scope.pages = [{ "name": 'about' }, { "name": 'chat' }, { "name": 'community' }, { "name": 'contact' },
  { "name": 'education' }, { "name": 'evaluation' }, { "name": 'featured' }, { "name": 'home' },
  { "name": 'mentorships' }, { "name": 'news' }, { "name": 'pillars' }, { "name": 'podcasts' },
  { "name": 'profile' }, { "name": 'signup' }, { "name": 'timeline' }, { "name": 'training' },
  { "name": 'webinars' }];
  //TIMELINE:
  $scope.loadedTimeline;
  $scope.newEvent = {
    _id: 0,
    bookByWeek: 1,
    phase: 'application',
    title: [''],
    content: [''],
    duration: 30,
    activity: [],
    calendarEnabled: false,
    end: null,
    start: null,
    allDay: false,

    marker: 'standard',
    markerText: null,
    markerType: null,
    className: ['meeting'],

    chronology: 'upcoming',//current Chronology of the event: upcoming, inprogress, pastDue, completed.
    status: 0,//event status or array position for content/title.   

    iCal: null// Ical linked to this event if applicable.
  };
  $scope.timelineChanged;
  //FORUM:
  //Reports:
  $scope.mainReport = {};
  $scope.flaggedPosts = [];
  ///Local functions
  //ACCOUNT MANAGEMENT:
  function LoadMentorPendingApproval() {
    $http.post('/contentManager/accounts/pendingMentors', {}).then(function (res) {
      for (var i = 0; i < res.data.length; i++) {
        $scope.pendingMentors.push(res.data[i]);
      }
    });
  };
  LoadMentorPendingApproval();
  //CALENDAR:
  $(document).ready(function () {
    LoadCalendar();
  });
  function LoadCalendar() {//load the calendar...
    $http.post('/contentManager/loadCalendarEvents', { year: 2016 }).then(function (response) {
      calDataEvent = response.data.events;
      var calendar = $('#calendar').fullCalendar({
        //header display options.
        header: {
          left: 'prev,next today',
          center: 'title',
          right: 'month,agendaWeek,agendaDay'
        },
        //The default view. could be set to basicWeek, basicDay, agendaWeek, month, etc...
        defaultView: 'month',
        events: calDataEvent
      });
    });
  };
  //PAGE CONTENT:  
  //function defined in controllers.js
  GetMessages('/contentManager/retrieveMessages', "", $http, $scope);
  //TIMELINE:
  //Utility
  function RemoveFromArray(arr, index) {//removes the element at index and reposition all other elements.
    for (var i = arr.length - 1; i > index; i--) {
      arr[i]._id = arr[i - 1]._id;
    }
    arr.splice(index, 1);
  };
  //Move an array element to a new position and shifts all other backward or forward. Also reassign the _id if applicable.
  function MoveInArray(arr, newPos, oldPos, hasId) {
    var savedOld = arr[oldPos];
    if (newPos > oldPos) {
      for (var i = oldPos; i < newPos; i++) {
        arr[i] = arr[i + 1];
        if (hasId) {
          arr[i]._id = i;
        }
      }
    }
    else {
      for (var i = oldPos; i > newPos; i--) {
        arr[i] = arr[i - 1];
        if (hasId) {
          arr[i]._id = i;
        }
      }
    }
    arr[newPos] = savedOld;
    if (hasId) {
      arr[newPos]._id = newPos;
    }
  };
  ///Scope Functions
  //ACCOUNT MANAGEMENT:
  $scope.AddFeaturedMentor = function (mentor, otherInfo) {
    var newFeatured = {
      picture: mentor.picture,//Profile picture taken at the time
      share: mentor.mentor[0].share,
      highestEducation: mentor.mentor[0].highestEducation,
      currentField: mentor.mentor[0].currentField,
      numberOfYearsInField: mentor.mentor[0].numberOfYearsInField,
      why: mentor.mentor[0].why, //Why is this mentor interested in mentoring.
      fullName: mentor.mentor[0].firstName + " " + mentor.mentor[0].lastName,
      other: otherInfo,
      email: mentor.email
    };
    console.log(newFeatured);
    $http.post('/contentManager/addCurrated', newFeatured).then(function (res) {
      if (res) {
        console.log(res.data);
      }
    });
  };

  $scope.LoadOptInMentors = function () {
    $http.get('/contentManger/optInMentorProfiles').then(function (res) {
      $scope.AvailableMentors = res.data;
    });
  };

  $scope.LoadFeaturedMentors = function () {
    $http.get('/contentManager/featuredMentors').then(function (res) {
      console.log(res.data);
      $scope.featuredMentors = res.data;
    });
  };
  $scope.RemoveFeaturedMentor = function (mentorEmail) {
    console.log(mentorEmail);
    $http.post('/contentManager/removeCurrated', { 'email': mentorEmail }).then(function (res) {
      console.log(res.data);
      $scope.LoadFeaturedMentors();
    });
  };
  //Approve a new mentor for full mentor.
  $scope.ApproveMentor = function (mentorEmail) {
    console.log(mentorEmail);
    $http.post('/contentManager/accounts/approveMentor', { 'approvedMentor': mentorEmail }).then(function (res) {
      console.log(res);
      $scope.approvalSuccess = res.data;
    });
  };
  //CALENDAR:
  $scope.saveCalChanges = function (data) {
    $.extend(data, calendarStyles["default"]);
    calDataEvent.push(data);
    $http.post('/contentManager/updateCalendar', calDataEvent).then(function successCallback(response) {
      $(".fc-today-button").trigger('click');//change this later
    }, function errorCallback(response) {
      console.log(response.data);
    });
  };
  //PAGE CONTENT:
  $scope.UpdateMessages = function () {
    $http.post('/contentManager/loadMessagesFromJSON').then(function successCallback(response) {
      $scope.updateMessageResult = response.data;
    }, function errorCallback(response) {
      $scope.updateMessageResult = response.data;
    });
  };
  $scope.SelectPage = function (selected) {
    $scope.CurrentlyEditing = selected;
    if (selected != '') {
      $scope.hasSelectedAPage = true;
    }
  };
  $scope.SaveChanges = function () {
    $http.post('/contentManager/UpdateMessages', $scope.messagePile).then(function successCallback(response) {
      $scope.updateMessageResult = response.data;
    }, function errorCallback(response) {
      $scope.updateMessageResult = response.data;
    });

  };
  $scope.LoadModulesFromJSONFolder = function () {
    $http.get('/contentManager/loadModulesFromJSON');
  };
  //TIMELINE:     
  $scope.AddNewEvent = function (event) {
    console.log("event id's no longer directly correspond to indices. please rewrite function");
    // console.log(event);
    // event.marker = 'standard';
    // $scope.loadedTimeline.events.splice(event._id, 0, event);
    // console.log($scope.loadedTimeline);
  };

  $scope.AddNewActivityToEvent = function (isFromNewEvent, eventIndex) {
    activity = {
      enabled: true,
      type: 'chat',
      text: 'example text',
      altText: 'example text',
      link: 'example link'
    };
    if (isFromNewEvent) {//if adding the event to the newEvent(not yet inside timeline)
      console.log($scope.newEvent);
      if ($scope.newEvent.activity.length == null) {
        $scope.newEvent.activity = [];
      }
      $scope.newEvent.activity.push(activity);
      return;
    }
    if ($scope.loadedTimeline.events[eventIndex].activity.length == null) {
      console.log("no array");
      $scope.loadedTimeline.events[eventIndex].activity = [];
    }
    console.log(eventIndex);
    console.log($scope.loadedTimeline.events[eventIndex].activity);
    $scope.loadedTimeline.events[eventIndex].activity.push(activity);
  };
  //removes the selected activity from the selected event. If eventIndex = -1
  //the newEvent is the selected event.
  $scope.RemoveActivityFromEvent = function (eventIndex, activityIndex) {
    if (eventIndex === -1) {
      $scope.newEvent.activity.splice(activityIndex, 1);
      return;
    }
    RemoveFromArray($scope.loadedTimeline.events[eventIndex].activity, activityIndex);
  };
  //For hard reset of timeline.
  $scope.ResetTimeline = function (type) {
    $http.post('/contentManager/timeline/loadFromJSON', { timelineType: type }).then(function (res) {
      console.log(res);

    });
  };
  //move the oldV element to the newV element's position and shifts everything back or forwards.
  $scope.ChangeEventOrder = function (newV, oldV) {
    $scope.timelineChanged = true;
    MoveInArray($scope.loadedTimeline.events, newV, oldV, true);
  };
  $scope.SaveTimeline = function () {
    console.log($scope.loadedTimeline);
    $http.post('/contentManager/timeline/saveDefault', { "timeline": $scope.loadedTimeline }).then(function (res) {
      console.log(res);
    });
  };
  $scope.LoadDefaultTimeline = function (type) {
    $http.post('/contentManager/timeline/loadDefault', { "type": type }).then(function (res) {
      if (res.data.error != null) {
        console.log(res.data.error);
        $scope.loadedTimeline = {};
      }
      else {
        $scope.loadedTimeline = res.data.document;
      }
    });
  };
  //removes the selected timeline event and shifts all array elements back.
  $scope.RemoveEventFromTimeline = function (index) {
    RemoveFromArray($scope.loadedTimeline.events, index);
  };
  //FORUMS:
  $scope.InitForums = function () {
    $http.post('/forum/initialize', { "numberToInit": 3/*How many forums to initialize*/ }).then(function (res) {
      console.log(res);
    });
  };
  $scope.GetFlagged = function () {
    $http.post('/contentManager/forum/getFlagged').then(function (res) {
      $scope.flaggedPosts = res.data;
      console.log(res.data);
    });
  };
  $scope.DeletePost = function (id) {
    $http.post('/contentManager/forum/deletePost', { '_id': id }).then(function (res) {
      console.log(res);
    });
  };
  //Analytics
  $scope.GetMainReport = function () {
    $http.post('analytics/getReport').then(function (res) {
      console.log(res);
      $scope.mainReport = res.data;
      console.log($scope.mainReport);
    });
  }



  ///TEst
  $scope.AutoComplete = function () {
    console.log("testing complete");
    $http.post('test/autocomplete').then(function (res) {
      console.log(res);
    });
  };

  ///

  $scope.listOfAllUsers = [];
  $scope.listOfAllMenteesToApprove = [];
  $scope.listOfAllMentorsToApprove = [];

  //this is called on initial load of the users tab, and then it adds the users to their sub category 
  $scope.getAllUsers = function () {
    $http.post('/admin/accounts/getAllUsers', {}).then(function (res) {
      let users = res.data;
      $scope.listOfAllUsers = users.filter(function (usr) {
        if (usr.status !== 'admin') {
          return usr;
        }
      });
      $scope.listOfAllMenteesToApprove = users.filter(function (usr) {
        console.log("USR", usr);
        //get the users if they do not equal admin and are mentees
        if (usr.mentee[0]) {
          if (!usr.mentee[0].approvedByAdmin) {
            return usr;
          }
        }
      });

      $scope.listOfAllMentorsToApprove = users.filter(function (usr) {
        if (usr.mentor[0]) {
          if (!usr.mentor[0].approvedByAdmin) {
            return usr;
          }
        }
      });

      //$scope.listOfAllMenteesToApprove
      console.log("users are", users);
      console.log("mentee to approve users are", $scope.listOfAllMenteesToApprove);
      console.log("mentor to approve users are", $scope.listOfAllMentorsToApprove);
    })
  }


  //remove user and splice from the local list and reload the data
  $scope.deleteUser = function (usr) {
    $http.post('/admin/accounts/deleteUser', { "username": usr.username, "email": usr.email }).then(function (res) {
      console.log(res.data);
      $scope.getAllUsers();
    })
  }

  //approve a user and reload the data 
  $scope.approveUsername = function (usr) {
    $http.post('/admin/accounts/approveUsername', { "username": usr.username, "email": usr.email }).then(function (res) {
      $scope.getAllUsers();
    })
  }

  //approve a mentee/mentor 
  $scope.approveMentee = function (usr) {
    $http.post('/admin/accounts/approveMentee', { "email": usr.email }).then(function (res) {
      $scope.getAllUsers();
      console.log(res);
    })
  }
});