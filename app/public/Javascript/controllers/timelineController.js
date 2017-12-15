angular.module('psdnetAppControllers').controller('timelineController', function ($scope, $rootScope, $location, $anchorScroll, $http, $state) {

  //go thru all the modules to see if you completed them
  if ($rootScope.userProfile && ($rootScope.userProfile.status === 'menteeInTraining' && ! $rootScope.userProfile.mentee[0].trainingCompleted || $rootScope.userProfile.status === 'mentorInTraining' && ! $rootScope.userProfile.mentor[0].trainingCompleted)) {

    $scope.modulesAllComplete = false;
    readModules();

    function readModules() {
      if ($rootScope.userProfile.modules.length == 0) {
        return;
      }
      for (let i=0; i<$rootScope.userProfile.modules.length; ++i) {
        console.log("element", $rootScope.userProfile.modules[i]);
        if (! $rootScope.userProfile.modules[i].completed) {
          return;
        }
      }

      $scope.modulesAllComplete = true;

      $http.post('mentorship/completeTraining').then(function(res){
        if (res.status) {
          console.log('training marked as completed');
          $state.reload();
        } else {
          console.log('training failed to mark as completed');
        }
      });
    }

  }

  $scope.verificationEmailSent = false;
  $scope.sendSchoolConfEmail = function() {
    $http.post('/mail/sendSchoolVerification').then(function (res) {
      $scope.verificationEmailSent = true;
    });
  }

  $scope.panelClasses = {
    'completed': 'glyphicon glyphicon-ok',
    'inprogress': 'glyphicon glyphicon-wrench',
    'upcoming': 'glyphicon glyphicon-flash',
    'error': 'glyphicon glyphicon-alert'
  };
  $scope.iconClasses = {
    'completed': 'glyphicon glyphicon-ok',
    'inprogress': 'glyphicon glyphicon-wrench',
    'upcoming': 'glyphicon glyphicon-flash',
    'error': 'glyphicon glyphicon-alert'
  };


  $scope.cancelBooking = function(eventObj) {
    eventObj.eventStatus = "initial";
    eventObj.menteeNotes = "";


    var index = eventObj.activity.map(function(e){return e.type;}).indexOf("chat");
    if(index != -1)
    {
       eventObj.activity.splice(index, 1);
    }
    console.log(eventObj);
    $http.post('/mentorships/cancelAppointment', {event : eventObj}).then(function(res){
      console.log("cancelled appointment");
      console.log(eventObj);//TODO parse to ical
      console.log(res);
      if (res) {
        $rootScope.timelineEvents[eventObj.id].eventStatus = eventObj.eventStatus;
        $rootScope.timelineEvents[eventObj.id].activity = eventObj.activity;
      } else {
        //error message?
      }
    });
    $http.post('/calendar/SendIcalCancel', {event : eventObj}).then(function(res){
    if (res){
      $rootScope.timelineEvents[eventObj.id].ical = res.data;
      console.log($rootScope.timelineEvents[eventObj.id].settings);
    };
    });
  };


  $scope.reqMentor = function () {
    console.debug("modules complete", $scope.modulesAllComplete);
    console.debug("status", $rootScope.userProfile.status);
    if ($scope.modulesAllComplete && $rootScope.userProfile.status == "menteeInTraining") {
    console.log("request mentor, passed in profile", $scope.profile);
    $http.post('/mentorships/requestMentor', $scope.userProfile.mentee[0]).then(function (secondres) {
      console.log("mentor has been requested");
      location.reload();
    })
    }
  }
  //awesome
  jQuery.fn.reverse = [].reverse;

  function setMarkings() {
    var markers = $('timeline timeline-badge:not(.standard)').parent().parent();
    markers.addClass('marker');
    markers.reverse().each(function (i, marker) {
      marker = $(marker);
      console.log(marker.children('li'));
      // marker.clone()
      //   .insertBefore(marker)
      //   .css({'opacity':'0','position':'absolute'})
      //   .attr('aria-hidden','true');
      var badge = marker.find('timeline-badge');
      var path = "/Assets/Images/Profile/timeline/markers/";
      if (badge.hasClass('primary')) {
        var limit = 3; //num of alt imgs
        path += "primary";
      } else {
        limit = 5;
        path += "secondary";
      }
      var markerImg = marker.find('img.board');
      if (badge.hasClass('upcoming')) {
        markerImg.attr('src', path + ".svg");
      } else {
        markerImg.attr('src', path + "-" + parseInt(i % limit) + ".svg");
      }

      var markerLi = marker.children('li')
        .prepend('<div>').prepend('<div>');
      // .attr('ng-class-odd',"")
      // .attr('ng-class-even',"");

      var onColor, offColor;
      if (i % 2 == 0) {
        onColor = "#f2f2f2";
        offColor = "#fff";
      } else {
        onColor = "#fff";
        offColor = "#f2f2f2";
      }
      markerLi
        .children('div:first-of-type').css('background-color', onColor)
        .siblings('div').css('background-color', offColor);
      // markerLi.find('.board')
      //   .css({'border-top-color':onColor,'border-bottom-color':offColor})
      var next = $(markers[i]);
      var flip = (i + 1) % 2 == 1;
      while ((next = next.prev()).hasClass('marker') == false && next.length > 0) {

        next
          .children('li').css('background-color', onColor)
          .children('timeline-badge').css('border-color', onColor)
          .find('.check:not(.completed):not(.inprogress)').css('background-color', onColor);
        if (flip) {
          next.children('li').toggleClass('timeline-inverted').addClass('opposed');
        }
        next.find('timeline-panel').css('background-color', offColor);
      }
    });
  }
  function setCurrent() {
    var current = $('.current-activity').parent();
    console.log(current);
    var path = "/Assets/Images/Profile/timeline/";
    current.each(function(){
      var eventContainer = $(this);
      if (eventContainer.hasClass('timeline-inverted')) {
        console.log("left");
        eventContainer.find('.current')
          .addClass('left')
          .children('img').attr('src', path + "current_event-left.svg");
      } else {
        console.log("right");
        eventContainer.find('.current')
          .addClass('right')
          .children('img').attr('src', path + "current_event-right.svg");
      }
    });
  }

  $scope.mobile;
  $scope.lastScroll = 0;

  function establishBreak() {
    if (window.matchMedia("(min-width:45em)").matches) {
      closeDetails();
      $scope.mobile = false;
    } else {
      $scope.mobile = true;
      var openBody = $('.event-body:visible');
      if (openBody.length)
        logDetails(openBody);
    }
  }
  var mobileBreak = window.matchMedia("(min-width:45em)");
  mobileBreak.onchange = function (e) { establishBreak(); };
  // $http.post('/contentManager/loadCalendarEvents', { year: 2016 }).then(function (response) {

  $scope.OnPageLoad = function () { setTimeout(loadStyles, 0); };
  // $scope.$on('viewContentLoaded', function() {
  //   //this fixes timeline style breaking somehow (has something to do with styles loading simultaneously, and this just kicks some sense into the page)
  //   setTimeout(function(){
  //     $('marker').css('border-style', 'none');
  //     setTimeout(function(){
  //       $('marker').css('border-style', 'solid');
  //     });
  //   });
  // })

  //console.log($scope.timelineEvents);
  function loadStyles() {
    setMarkings();
    setCurrent();
    $('.mentor').find('h1>span').html('Find<br>A Mentor');
    $('.event-body, .event-details').hide();

    //scrolling to next activity
    var events = $('timeline-event');
    for (var i = events.length - 1; i >= 0; i--) {
      var curEvent = $(events[i]);
      var test = curEvent.find('timeline-badge');
      if (test.hasClass('upcoming') && test.hasClass('standard')) {
        var id = "current-event"
        curEvent.attr('id', id);
        $state.go('profile.timeline', {'#': id}, {location: 'replace'});

        //trying to display also just above element
        /*if (i > 0) {
          var prev = $(events[i - 1]);
          var dif = curEvent.offset().top - (prev.offset().top + prev.outerHeight());
          $(window).scrollTop($(window).scrollTop() - dif);
        }*/
        break;
      }
    }

    //removing duplicate activity icons
    for (var i = 0; i < events.length - 1; i++) {
      var curEvt = $(events[i]);
      var actTypes = {};
      var actIcons = curEvt.find('.activity');
      for (var j = 0; j < actIcons.length; j++) {
        var actIconsOne = $(actIcons[j]);
        var type = actIconsOne.attr('data-type')
        if (true == actTypes[type]) {
          actIconsOne.remove();
        } else {
          actTypes[type] = true;
        }
      }
    }

    $('.event-details button.expand').on('click', function (e) {
      closeDetails();
      closeContent();
    });

    $('.expand').on('click', function (e) {
      var body = $(this).parent().parent().next();
      var img = $(this).children('img');
      var path = "/Assets/Images/Profile/timeline/";
      if (body.is(':visible')) {
        body.hide();
        img.attr('src', path + "plus.svg");
      } else {
        var openBody = $('.event-body:visible');
        if (openBody.length) {
          var openIndex = openBody.parent().parent().parent().parent().index();
          var newIndex = body.parent().parent().parent().parent().index();
          if (openIndex < newIndex)
            $(window).scrollTop($(window).scrollTop() - openBody.outerHeight());
        }
        closeContent();
        body.show();
        img.attr('src', path + "minus.svg");
      }
      if ($scope.mobile)
        logDetails(body);
    });
    establishBreak();
    ///*********CLOSING PAGE-BUFFER****************//
    setTimeout($scope.PageLoaded , 300);
    ///*********CLOSING PAGE-BUFFER****************//
  }
  function logDetails(body) {
    var details = $('.event-details');
    details
      .find('h1:first-of-type > span').text(body.prev().find('h4:first-of-type').text()).parent()
      .next().find('span').text(body.prev().find('h4:last-of-type').text()).parent()
      .next().text(body.children('p:first-of-type').text())
      .next().remove();
    body.find('.icons').insertAfter(details.find('p'));
    if (body.is(':visible')) {
      $scope.lastScroll = $(window).scrollTop();
      details.show();
      $('timeline').hide();
      $(window).scrollTop(0);
      $('body').css('overflow', 'hidden');
      $('body > div > footer').css('display', 'none');
    } else {
      closeDetails();
      $(window).scrollTop($scope.lastScroll);
    }
  }
  function closeDetails() {
    var details = $('.event-details:visible');
    $('timeline').show();
    if (details.length) {
      details.hide();
      $('.event-body:visible').append(details.find('div.icons'));
    }
  }
  function closeContent() {
    $('.event-body:visible')
      .hide()
      .prev().find('img').attr('src', "/Assets/Images/Profile/timeline/plus.svg")
    $('body').css('overflow', '');
    $('body > div > footer').css('display', 'block');
  }
});
