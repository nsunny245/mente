angular.module('psdnetAppControllers').controller('signupController', function ($scope, $rootScope, $http, $state, checkBoxes) {


  $scope.unverifiedMessage = '';
  $scope.firstClick = true;


  $scope.userCharLim = {
    "min": 6,
    "max": 24
  };
  $scope.passCharLim = {
    "min": 8,
    "max": 32
  };


  $scope.consoleOutInputMeta = function (inputMeta) {
    console.log(inputMeta);
  }
  $scope.resetAllInteractedStates = function (inputMeta) {
    $scope.signupError = '';
    if (typeof inputMeta !== 'undefined') {
      for (let i in inputMeta) {
        (typeof inputMeta[i].beenBlurred !== 'undefined') ? inputMeta[i].beenBlurred = false : '';
        (typeof inputMeta[i].beenChanged !== 'undefined') ? inputMeta[i].beenChanged = false : '';
      }
    }
  };


  $scope.signupError = '';
  console.log($scope.signupError);
  console.log($scope.signupError.length);

  $scope.SignUpUser = function () {
    var sentData = {
      email: $scope.profile.email,
      password: $scope.profile.password,
      displayName: $scope.profile.username,
    }
    $http.post('/signup', sentData).then(function (res) {
      console.log(res.data);
      if (res.data.status === false) {
        console.log($scope.signupError, $scope.signupError !== '');
        $scope.signupError = res.data.error;
        console.log($scope.signupError, $scope.signupError !== '');
        return true;
      }
      else {
        $state.go("signup.mentorship");
        return false;
      }
    });
  }
  $scope.profile = {};

  $scope.toLowerEmail = function (val) {
    console.log($scope.profile);
    console.log(val);
    if (val) {
      $scope.profile.email = val.toLowerCase();
    }
  }

  $scope.sendConfEmail = function () {
    if (!$scope.firstClick) {
      return;
    }
    $http.post('/signup/SendConfEmail').then(function (res) {
      $scope.firstClick = false;
      $scope.unverifiedMessage = res.data.message;
    });
  }
  $scope.AppendUserData = function (type) {
    $http.post('/signup/checkVerified', { 'type': type }).then(function (res) {
      console.log(res.data.status + " " + type);
      if (type === 'mentee') {
        $state.go("signup.mentee-form");
      }
      else if (type === 'mentor') {
        $state.go("signup.mentor-form");
      }
      else if (res.data.status === 'verified') {
        if (type === 'mentee') { $state.go("signup.mentee"); }
        if (type === 'mentor') { $state.go("signup.mentor"); }
      }
      else if (res.data.status) {
        console.log(res.data.status);//trying to become either a mentor but has started a mentee application.
        //maybe ask for confirmation to delete the mentee or mentor object.
        $scope.unverifiedMessage = "Your status is :" + res.data.status;
      }
      else if (res.data.time) {
        console.log(res.data.message + (res.data.time / 3600000) + "hours.");
        $scope.unverifiedMessage = res.data.message + (res.data.time / 3600000) + "hours.";
      }
      else {
        console.log(res.data.message);
        $scope.unverifiedMessage = res.data.message;
      }
    });
  }

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
  $scope.field = checkBoxes.field;
  $scope.schoolType = checkBoxes.schoolType;
});


angular.module('psdnetAppControllers').controller('signupController.mentee', function ($scope, $rootScope, $http, $state) {

  $scope.firstCharLim = {
    "max": 24
  };
  $scope.lastCharLim = {
    "max": 24
  };
  $scope.schoolCharLim = {
    "max": 60
  };
  $scope.ageLim = {
    "min": 18
  };

  $scope.consoleOutInputMeta = function (inputMeta) {
    console.log(inputMeta);
  }
  $scope.resetAllInteractedStates = function (inputMeta) {
    if (typeof inputMeta !== 'undefined') {
      for (let i in inputMeta) {
        (typeof inputMeta[i].beenBlurred !== 'undefined') ? inputMeta[i].beenBlurred = false : '';
        (typeof inputMeta[i].beenChanged !== 'undefined') ? inputMeta[i].beenChanged = false : '';
      }
    }
  };


  $scope.profile.preferences = [];
  $scope.noPref = false;



  //checkboxes for mentor 

  $scope.declarationChoices = [
    { "id": 1, "value": "1", "label": "I acknowledge that I have reviewed and agree to the Terms of Use of communability.ca, its Privacy Policy and the Mentorship Program User Agreement" },
    { "id": 2, "value": "2", "label": "I acknowledge that a CommunAbility.ca team member may contact me to verify or discuss any of the information provided in this application form." },
    { "id": 3, "value": "3", "label": "If approved as a mentee and matched with a mentor, I commit to following the timeline of the mentoring program and communicating through online chat with my mentor on a biweekly basis for a 16-week period." },
    { "id": 4, "value": "5", "label": "I understand that pairing me with a mentor will depend on the availability of suitable candidates." },
    { "id": 5, "value": "6", "label": "I acknowledge that if approved as a mentee, I may be approached to participate in research; however, participation is voluntary and I can choose not to participate and remain in the program." },
  ];

  $scope.declarationValues = [];

  $scope.updateDeclarationValue = function (choice) {
    $scope.declarationValues = $scope.declarationValues || [];
    if (choice.checked) {
      $scope.declarationValues.push(choice.value);
      //$scope.declarationValues = [...new Set($scope.value)];
    } else {
      $scope.declarationValues.splice(0, 1);
      //$scope.declarationValues = _.without($scope.declarationValues, choice.value);
    }
  };



  $scope.SubmitMenteeApp = function (completed) {
    if ($scope.profile.highestEducation === 'Other Education') {
      $scope.profile.highestEducation = $scope.profile.otherEducation;
    }
    if ($scope.profile.study === 'Other Area of Study') {
      $scope.profile.study = $scope.profile.otherStudy;
    }
    if ($scope.profile.schoolType === 'Other Institution Type') {
      $scope.profile.schoolType = $scope.profile.otherSchool;
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

    if ($scope.profile.currentField == "OtherField") {
      $scope.profile.currentField = $scope.profile.otherFieldSelect;
    }
    //this should be false when you submit from form, and then true on subsequent calls
    $scope.profile.completed = completed;

    $http.post('/signup/menteeForm', $scope.profile).then(function (res) {
      console.log("mentee form signup response: ", res);
      //at this point you are verified, but with a populated timeline, info, etc. 
      $state.go("profile.timeline");
      //TODO REMOVE THIS CALL move state.go out.
      //  $http.post('/mentorships/requestMentor', $scope.profile).then(function(secondres){
      //     if(secondres){

      //     }
      //});

    });
  };
});

angular.module('psdnetAppControllers').controller('signupController.mentor', function ($scope, $rootScope, $http, $state, checkBoxes) {

  $scope.firstCharLim = {
    "max": 24
  };
  $scope.lastCharLim = {
    "max": 24
  };
  $scope.ageLim = {
    "min": 21
  };
  $scope.refNameCharLim = {
    "max": $scope.firstCharLim.max + 1 + $scope.lastCharLim.max
  };
  $scope.refRelCharLim = {
    "max": 24
  };

  $scope.consoleOutInputMeta = function (inputMeta) {
    console.log(inputMeta);
  }
  $scope.resetAllInteractedStates = function (inputMeta) {
    if (typeof inputMeta !== 'undefined') {
      for (let i in inputMeta) {
        (typeof inputMeta[i].beenBlurred !== 'undefined') ? inputMeta[i].beenBlurred = false : '';
        (typeof inputMeta[i].beenChanged !== 'undefined') ? inputMeta[i].beenChanged = false : '';
      }
    }
  };


  $scope.highestEducation = checkBoxes.highestEducation

  $scope.profile = {};
  $scope.profile.shareProfileOptIn = false;
  $scope.profile.gender = [];
  $scope.profile.disabilities = [];
  $scope.profile.bestSuited = [];
  $scope.profile.references = [{}, {}];
  $scope.preferenceChecked = [];
  $scope.genderChecked = [];



  //checkboxes for mentor 

  $scope.declarationChoices = [
    { "id": 1, "value": "1", "label": "I acknowledge that I have reviewed and agree to the Terms of Use of communability.ca, its Privacy Policy and the Mentorship Program User Agreement" },
    { "id": 2, "value": "2", "label": "I acknowledge that a CommunAbility.ca team member may contact me to verify or discuss any of the information provided in this application form." },
    { "id": 3, "value": "3", "label": "I consent to a CommunAbility.ca team member contacting the references I have provided to verify information and assess my suitability to be a mentor." },
    { "id": 4, "value": "4", "label": "If approved as a mentor and matched with a mentee, I commit to following the timeline of the mentoring program and communicating through online chat with my mentee on a biweekly basis for a 16-week period." },
    { "id": 5, "value": "5", "label": "I understand that pairing me with a mentee will depend on the availability of suitable candidates." },
    { "id": 6, "value": "6", "label": "I acknowledge that if approved as a mentor, I may be approached to participate in research; however, participation is voluntary and I can choose not to participation and remain in the program." },
  ];

  $scope.declarationValues = [];

  $scope.updateDeclarationValue = function (choice) {
    $scope.declarationValues = $scope.declarationValues || [];
    if (choice.checked) {
      $scope.declarationValues.push(choice.value);
      //$scope.declarationValues = [...new Set($scope.value)];
    } else {
      $scope.declarationValues.splice(0, 1);
      //$scope.declarationValues = _.without($scope.declarationValues, choice.value);
    }
  };




  var previousPrefs = [];
  $scope.noPreferences = function (val) {
    if (val) {
      previousPrefs[0] = $scope.profile.bestSuited[0];
      previousPrefs[1] = $scope.profile.bestSuited[1];
      previousPrefs[2] = $scope.profile.bestSuited[2];
      $scope.profile.bestSuited = ['none', 'none', 'none'];
    }
    else {
      $scope.profile.bestSuited = previousPrefs;
    }

  };
  $scope.SubmitMentorApp = function (completed) {

    if ($scope.profile.highestEducation === 'Other Education') {
      $scope.profile.highestEducation = $scope.profile.otherEducation;
    }
    if ($scope.profile.schoolType === 'Other School') {
      $scope.profile.schoolType = $scope.profile.otherSchool;
    }
    if ($scope.profile.study === 'Other Area of Study') {
      $scope.profile.study = $scope.profile.otherStudy;
    }
    if ($scope.profile.currentField === 'OtherField') {
      $scope.profile.currentField = $scope.profile.otherField;
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

    //TODO

    // $scope.allSelected = false;
    // for (var i = 0; i < $scope.deliveryMethods.length; i++) {
    //   if ($scope.deliveryMethods[i].selected == true) {
    //     $scope.someSelected = true;
    //     // show custom message here
    //     return false;
    //   }
    // }

    //set them
    $scope.profile.gender = genderFilter;
    $scope.profile.disabilities = disabilityFilter;

    $scope.profile.completed = completed;
    //after sending the info, we want to redirect the user to the module page most likely.
    $http.post('/signup/mentorForm', $scope.profile).then(function (res) {
      if (res) {
        $state.go("profile.timeline");
      }
    });
  };
});

//functions
var collapseRoot = $('');

function readyCollapsibleContent() {
  $('.art-content button').on('click', function (e) {
    //only applicable to desktop view; prevents simultaneous open/close
    if (window.matchMedia("(min-width: 45em)").matches) {
      var otherContent = $(this).parent().parent().parent().siblings('article').children('.ex-content.in, .ex-content.collapsing');
      if (otherContent.length) {
        otherContent.collapse('hide');
        e.stopPropagation();

        $(document).off('hidden.bs.collapse', '.ex-content');
        bindEvent($(this).parent().parent().siblings('.ex-content'));
        function bindEvent(obj) {
          $(document).on('hidden.bs.collapse', '.ex-content', function (e) {
            $(document).off('hidden.bs.collapse', '.ex-content');
            $(this).siblings('.down-arrow-ind').css('top', '-2em');
            obj.collapse('show');
          });
        }
      }
    } else {
      $(document).off('hidden.bs.collapse', '.ex-content');
    }
  });

  $(document).on('show.bs.collapse', '.ex-content', function (e) {
    if (!window.matchMedia("(min-width: 45em)").matches)
      $(this).parent().siblings('article').children('.ex-content').collapse('hide');
    $(this).siblings('.down-arrow-ind').css('top', '0');
    var content = $(this).children('.ex-content-content');
    $(this).addClass('in');
    var offset = content.outerHeight();
    $(this).removeClass('in');

    content.css({
      transition: '0s',
      bottom: offset
    });
    setTimeout(function () {
      if (window.matchMedia("(min-width: 45em)").matches) {
        content.css({
          transition: '0.3s',
          bottom: 0
        });
      } else {
        console.log('shorter duration');
        content.css({
          transition: '0.35s',
          bottom: 0
        });
      }
    });
  });
  // function() {}
  $(document).on('hide.bs.collapse', '.ex-content', function (e) {
    //with updated html, this works fine >>
    //   var content = $(this).children('.ex-content-content');
    //   var offset = content.outerHeight();
    //   content.css({
    //     transition: '0s',
    //     bottom: 0
    //   });
    //   setTimeout(function() {
    //     content.css({
    //       transition: '0.3s',
    //       bottom: offset
    //     });
    //   });
  });


  $('.ex-content').bind('cssClassChanged', function (evt) {
    var element = $(this);
    var total = element.outerHeight();
    if (element.height() > 0 && element.hasClass('in') && element.hasClass('collapsing')) {
      var scrollTop = $(document).scrollTop();
      var dif = ($.documentHeight() - scrollTop);
      var section = element.parent();
      var subOffset = section.offset().top - $('.navbar-header').outerHeight();
      var otherEx = element.parent().siblings('article').children('.ex-content');

      var content = element.children('.ex-content-content');
      content.css({
        transition: '0s',
      });
      setTimeout(function () {
        content.css({
          bottom: total * 0.5
        });
      });

      var delay = 10;

      var scrolling = !window.matchMedia("(min-width: 45em)").matches && scrollTop > subOffset + section.outerHeight() - element.outerHeight();
      var collapseInto = true;//! window.matchMedia("(min-width: 45em)").matches;

      $(this).siblings('.down-arrow-ind').css('top', '-2em');
      if (scrolling)
        slideCollapse(collapseInto, true, $.documentHeight() - dif);
      else if (collapseInto)
        slideCollapse(true);

      //simply animating might now work better than this with the updated html
      function slideCollapse(colInto, isScrolling, last) {
        last = setValues(colInto, isScrolling, last);
        if (element.hasClass('collapsing')) {
          if (isScrolling) {
            if ($(document).scrollTop() > subOffset) {
              newTimeout(colInto, isScrolling, last);
            } else {
              $(window).scrollTop(subOffset);
              newTimeout(colInto, false);
            }
          } else if (colInto) {
            newTimeout(true, false);
          }
        } else {
          setTimeout(function () {
            setValues(colInto, isScrolling, last);
          }, 10);
        }
      }
      function newTimeout(colInto, isScrolling, last) {
        setTimeout(function () {
          slideCollapse(colInto, isScrolling, last);
        }, delay);
      }
      function setValues(colInto, isScrolling, last) {
        if (isScrolling) {
          var ignoreHeight = 0;
          for (var i = 0; i < otherEx.length; i++)
            if ($(otherEx[i]).is(':visible'))
              ignoreHeight += $(otherEx[i]).outerHeight();
          var docHeight = $.documentHeight();
          var elmHeight = element.outerHeight();
          var scrollTop = $(window).scrollTop();

          var scroll = $.documentHeight() - ignoreHeight - dif;
          $(window).scrollTop(scrollTop - (last - scroll));
          last = scroll;
        } else {
          elmHeight = element.outerHeight();
        }
        if (colInto)
          content.css('bottom', total * (1 - element.outerHeight() / total) + "px");

        if (isScrolling)
          return last;
      }
    }
  });
}
