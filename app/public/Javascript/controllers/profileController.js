angular.module('psdnetAppControllers').controller('profileController', function ($rootScope, $scope, $http, previousLoc, $location, $state, checkBoxes) {
  var isLogged = false;
  $scope.showInfo = isLogged;

  $scope.mentor = {};
  $scope.previewPDF = '';
  $scope.profile = {};

  try {
    if ($rootScope.userProfile.status === 'mentee' || $rootScope.userProfile.status === 'menteeSeeking') {
      $scope.profile = angular.copy($rootScope.userProfile.mentee[0]);
      console.log("mentees profile: ", $scope.profile);
      //$scope.profile.password = $rootScope.user
    } else if ($rootScope.userProfile.status === 'mentor' || $rootScope.userProfile.status === 'mentorSeeking') {
      $scope.profile = angular.copy($rootScope.userProfile.mentor[0]);
      console.log("mentors profile: ", $scope.profile);
    }
  } catch (ex) {
    $state.go("home");
  }

  var pdfResults = null;

  ///Activity Section
  $scope.ArchiveActivity = function (activity) {
    console.log(activity);
    $http.post('/activity/mark', { id: activity._id, viewed: true, archived: true });
  };

  ///
  $scope.UploadPDF = function (file, errFiles) {

    $scope.pdf = file;
    console.log(file);
    $scope.errFile = errFiles && errFiles[0];


    if (file) {
      var reader = new FileReader();
      reader.onload = function (readerEvt) {
        var binaryString = readerEvt.target.result;
        pdfResults = btoa(binaryString);
        $scope.previewPDF = pdfResults;
      }
    }
    reader.readAsBinaryString(file);
  };

  $scope.ConfirmImage = function () {
    var imageElem = document.getElementById("uploadedImage");
    var encodedImage = imageElem.src;
    $http.post('upload/picture', { encodedImage });
    location.reload();
  };


  $scope.ConfirmPDF = function () {
    if (pdfResults != null)
      $http.post('upload/pdf', { pdfResults }).then(
        function (res) {
          $scope.previewPDF = res.data;
        });
  };


  $scope.UploadImage = function (file, errFiles) {
    $scope.f = file;
    $scope.errFile = errFiles && errFiles[0];
    $scope.imgURL;
  };
  $scope.ConfirmImage = function () {
    var imageElem = document.getElementById("uploadedImage");
    var encodedImage = imageElem.src;
    $http.post('upload/picture', { encodedImage });
    location.reload();
  };


  $scope.TestCalEvent = function () {
    $http.post('/contentManager/loadCalendarEventsFromJSON').then(function (res) {
      console.log(res);
    });
  };


  $scope.RetrieveAssigneeInfo = function () {

    $http.get('/retrieveProfileInfo').then(function (res) {
      console.log("profile",res);
      if (res.status !== 401) {
        $scope.myAssignee = res.data;
      }
    });
  };

  $scope.LoadSettings = function () {
    ///*********CLOSING PAGE-BUFFER****************//
    setTimeout($scope.PageLoaded, 0);
    ///*********CLOSING PAGE-BUFFER****************//
    if ($rootScope.userProfile.status === 'mentee' || $rootScope.userProfile.status === 'menteeInTraining') {
      $scope.profile = {
        schoolEmail: $rootScope.userProfile.mentee[0].schoolEmail,
        preferredEmail: $rootScope.userProfile.mentee[0].preferredEmail,
        firstName: $rootScope.userProfile.mentee[0].firstName,
        middleName: $rootScope.userProfile.mentee[0].middleName,
        lastName: $rootScope.userProfile.mentee[0].lastName,
        age: $rootScope.userProfile.mentee[0].age,
        gender: $rootScope.userProfile.mentee[0].gender,
        disabilities: $rootScope.userProfile.mentee[0].disabilities,
        study: $rootScope.userProfile.mentee[0].study,
        currentField: $rootScope.userProfile.mentee[0].currentField,
        why: $rootScope.userProfile.mentee[0].why,
        biggestChallenge: $rootScope.userProfile.mentee[0].biggestChallenge,
        share: $rootScope.userProfile.mentee[0].share
      };
    }
    else if ($rootScope.userProfile.status === 'mentor' || $rootScope.userProfile.status === 'mentorFull' || $rootScope.userProfile.status === 'mentorInTraining') {
      $scope.profile = {
        shareProfileOptIn: $rootScope.userProfile.mentor[0].shareProfileOptIn,
        acceptingMentee: ! $rootScope.userProfile.mentor[0].removeFromPool,
        workEmail: $rootScope.userProfile.mentor[0].workEmail,
        preferredEmail: $rootScope.userProfile.mentor[0].preferredEmail,
        firstName: $rootScope.userProfile.mentor[0].firstName,
        middleName: $rootScope.userProfile.mentor[0].middleName,
        lastName: $rootScope.userProfile.mentor[0].lastName,
        age: $rootScope.userProfile.mentor[0].age,
        phone: $rootScope.userProfile.mentor[0].phone,
        gender: $rootScope.userProfile.mentor[0].gender,
        disabilities: $rootScope.userProfile.mentor[0].disabilities,
        highestEducation: $rootScope.userProfile.mentor[0].highestEducation,
        study: $rootScope.userProfile.mentor[0].study,
        currentField: $rootScope.userProfile.mentor[0].currentField,
        numberOfYearsInField: $rootScope.userProfile.mentor[0].numberOfYearsInField,
        why: $rootScope.userProfile.mentor[0].why,
        gainMentee: $rootScope.userProfile.mentor[0].gainMentee,
        gain: $rootScope.userProfile.mentor[0].gain,
        share: $rootScope.userProfile.mentor[0].share
      };
    }
  };


  // CHECKBOX STUFF

  var calculateGenderSelected = function () {
    $scope.someGendersSelected = checkBoxes.calculateGenderSelected($scope.someGendersSelected);
  };

  var calculateDisabilitySelected = function () {
    $scope.someDisabilitiesSelected = checkBoxes.calculateDisabilitySelected($scope.someDisabilitiesSelected);
  };

  $scope.formData = checkBoxes.formData;//crucial for all dynamic forms, hold all

  $scope.otherGenderString = checkBoxes.otherGenderString;
  $scope.otherDisabilityString = checkBoxes.otherDisabilityString;

  $scope.genders = checkBoxes.genders;
  $scope.disabilities = checkBoxes.disabilities;

  $scope.checkboxChangedGender = calculateGenderSelected;
  $scope.checkboxChangedDis = calculateDisabilitySelected;

  $scope.spaceBeforeCapital = checkBoxes.spaceBeforeCapital;

  calculateGenderSelected($scope.someGendersSelected);
  calculateDisabilitySelected($scope.someDisabilitiesSelected);

  $scope.study = checkBoxes.study;
  //load the variables for the selects here 
  // $scope.selectedOption = $scope.study[1];

  $scope.field = checkBoxes.field;
  $scope.highestEducation = checkBoxes.highestEducation;


  //deletes the profile, sends you back to main 
  // $scope.deleteProfile = function () {
  //   $http.post('/set/removeProfile').then(function (res) {
  //     if (res) {
  //       console.log(res.data);
  //       $state.go("home");
  //     }
  //   });
  // };

  $scope.SaveProfileChanges = function (pass) {
    if ($scope.profile.highestEducation === 'Other Education') {
      $scope.profile.highestEducation = $scope.profile.otherEducation;
    }
    if ($scope.profile.study === 'OtherStudy') {
      $scope.profile.study = $scope.profile.otherStudy;
    }
    var genderKeys = Object.keys($scope.formData.genderSelected);
    var disabilityKeys = Object.keys($scope.formData.disabilitySelected);

    var genderFilter = genderKeys.filter(function (key) {
      return $scope.formData.genderSelected[key];
    });
    var disabilityFilter = disabilityKeys.filter(function (key) {
      return $scope.formData.disabilitySelected[key];
    });

    var otherGenderIndex = genderFilter.indexOf("OtherGender");
    var otherDisabilityIndex = disabilityFilter.indexOf("OtherDisability");
    if (otherGenderIndex !== -1) {
      genderFilter[otherGenderIndex] = $scope.otherGenderString;
    }
    if (otherDisabilityIndex !== -1) {
      disabilityFilter[otherDisabilityIndex] = $scope.otherDisabilityString;
    }

    //set them
    $scope.profile.gender = genderFilter;
    $scope.profile.disabilities = disabilityFilter;

    if ($scope.profile.currentField === 'other') {
      $scope.profile.currentField = $scope.profile.otherField;
    }

    console.log("old profile: ", $rootScope.userProfile.mentee[0]);
    console.log("updated profile", $scope.profile);
    $http.post('/update/profile', { email: $rootScope.userProfile.email, password: pass, updatedProfile: $scope.profile }).then(function (res) {
      if (res) {
        $scope.pswError = true;
        console.log("password error: ", res.data);
      } else {
        $scope.pswError = false;
        console.log("password error: ", res.data);
      }
    });
  };
  /* Dashboard */
  var desktop = window.matchMedia('(min-width:45em)');
  desktop.onchange = function () {
    hideDashNav();
  }

  $scope.$on('$viewContentLoaded', function (e) {
    setTimeout(function () {
      var location = $location.$$path.split("/")[2];//TODO: typo?
      var dashnav = $('.dashnav ul')
      dashnav.find('.active').removeClass('active');
      dashnav.find('li.nav-' + location).addClass('active');
      hideDashNav();
      // $('.noclick').remove();
      // $('body').css('overflow','');
      // closeDashNav();
    });
  });

  $('.dashnav li button').on('click', function (e) {
    // e.stopPropagation();
    if ($(this).hasClass('active')) {
      closeDashNav();
    } else {
      hideDashNav();
      $('.dashnav .active').removeClass('active');
      $(this).parent().addClass('active');
      // $('.noclick').remove();
      // $('body').css('overflow','');
      // closeDashNav();
    }
  });
  $('.dash .tognav').on('click', function (e) {
    var dashnav = $('.dashnav ul');
    if (dashnav.hasClass('open')) {
      closeDashnav();
    } else {
      dashnav
        .removeClass('closed')
        .addClass('open')
        // .attr('aria')
        .css('right', dashnav.outerWidth());

      $('<div class="noclick"></div>')
        .prependTo('body')
        .on('click', function (e) { closeDashnav(); })
        .css({ 'background-color': '#fff', 'opacity': 0 })
        .fadeTo(100, 0.5);
      // $('<div class="specnoclick"></div>')
      //   .appendTo('header.dash')
      //   .on('click',function(e){closeDashnav();})
      //   .css({'background-color':'#fff','opacity':0})
      //   .fadeTo(100,0.5);
      $('body').css('overflow', 'hidden');
    }
  });
  function closeDashnav() {
    $('.dashnav ul')
      .removeClass('open')
      .addClass('closed')
      // .attr('aria')
      .css('right', 0);
    $('.noclick, .specnoclick')
      .fadeTo(100, 0, function (e) {
        $(this).remove();
        $('body').css('overflow', '');
      });
  }
  function hideDashNav() {
    var dashnav = $('.dashnav ul').hide().removeClass('transition');
    if (desktop.matches)
      setTimeout(function () { dashnav.css('right', '') });
    else
      setTimeout(function () { dashnav.css('right', 0) });
    setTimeout(function () { dashnav.show().addClass('transition') });

    $('.noclick, .specnoclick').remove();
    $('body').css('overflow', '');
    closeDashnav();
  }

  function offsetModule() {
    setTimeout(function () {
      var height = $('header.dash').outerHeight();
      // height += $('nav.navbar .navbar-header .navbar-brand').outerHeight();
      $('.module').parent().css('margin-top', height) + "px";
    }, 0);
  }
  function offsetChat() {
    var location = $location.$$path.split("/")[2];
    if (location == "chat") {
      applyOffsetChat();
    }
  }
  function applyOffsetChat() {
    var details = $('#details');
    if (details.hasClass('in') && !details.hasClass('collapsing')) {
      $('#details-disp').css('height', details.outerHeight());

      var height = $('.details-button:first-of-type').outerHeight();
      $('#static-disp').css('height', height);
    } else {
      setTimeout(function () {
        applyOffsetChat();
      }, 100);
    }
  }

  /* Media Queries */
  var mq30 = window.matchMedia("(min-width: 30em)");
  mq30.onchange = function () { offsetModule(); };
  var mq45 = window.matchMedia("(min-width: 45em)");
  mq45.onchange = function () { offsetModule(); };
  var mqDesk = window.matchMedia("(min-width: 48em)");
  mqDesk.onchange = function () {
    offsetModule();
  };
  var mq60 = window.matchMedia("(min-width: 60em)");
  mq60.onchange = function () {
    offsetModule();
  };
  var mq75 = window.matchMedia("(min-width: 75em)");
  mq75.onchange = function () { offsetModule(); };

  /* init */
  // $(window).bind("load", function(e){
  $scope.$on('$viewContentLoaded', function (e) {
    setTimeout(function () {
      offsetModule();
    }, 100);
    // });
  });



});