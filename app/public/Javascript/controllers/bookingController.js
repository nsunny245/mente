
angular.module('bootstrapControllers').controller('bookingModalCTR', function ($scope, $uibModal, $log) {
  $scope.open = function (selectedEvent) {
    var modal;
    var bookingMQ = window.matchMedia("(min-width: 48em)");
    var changeMaxWidth = function() {
      if (bookingMQ.matches) {
        modal.css('max-width', '24.5em');
      } else {
        modal.css('max-width', '32.5em');
      }
    };
    setTimeout(function(){
      modal = $('.modal-cal').parent().parent();
      modal.css({
        'margin-left':'auto',
        'margin-right':'auto'
      });;
      changeMaxWidth();
    });
    bookingMQ.onchange = function() {
      changeMaxWidth();
    };

    var modalInstance = $uibModal.open({
      animation: true,
      templateUrl: 'bookingModal.html',
      controller: 'bookingModalInstanceCTR',
      scope: $scope,
      resolve: {
        items: function () {
          return $scope.selectedEvent = selectedEvent;
        }
      }
    });
  };
});

angular.module('bootstrapControllers').controller('bookingModalInstanceCTR', function ($scope, $rootScope, $uibModalInstance, $http, $state, CONSTS, items) {
  $scope.mentorInfo = {};

  //items contains the event selected
  console.log(items);
  var eventObj = JSON.parse(items);
  eventObj["className"] = ["meeting"];
  eventObj["allDay"] = false;
  eventObj["overlap"] = true;
  eventObj["editable"] = false;
  eventObj["menteeNotes"] = String;



  $scope.submitBooking = function() {
    eventObj.eventStatus = "following";
    var timeDate = new Date(eventObj.start).getTime();
    console.log(timeDate);
    eventObj.menteeEmail = $rootScope.userProfile.email;
    eventObj.start = timeDate;
    eventObj.menteeNotes = $('.modal-cal .details textarea').text();
    console.log(eventObj);

    var index = eventObj.activity.map(function(e){return e.type;}).indexOf("chat");
    console.log(index);
    if(index === -1)
    {
       eventObj.activity.push({
                "enabled" : true,
                "type" : "chat"
            });
    }

    $http.post('/mentorships/bookAppointment', {event : eventObj}).then(function(res){
      console.log("submit appt");
      console.log(eventObj);//TODO parse to ical
      console.log(res);
      if (res) {
        $rootScope.timelineEvents[eventObj.id].eventStatus = eventObj.eventStatus;
        $rootScope.timelineEvents[eventObj.id].activity = eventObj.activity;

        $uibModalInstance.close();
      } else {
        //error message?
      }
    });
    $http.post('/calendar/SendIcalLink', {event : eventObj}).then(function(res){
      if (res){
        $rootScope.timelineEvents[eventObj.id].ical = res.data;
        console.log($rootScope.timelineEvents[eventObj.id].settings);
      };
      });
  };


  modalControls($scope,$uibModalInstance);

  var loadCalendar = function () {//load the calendar...
    $http.get('/mentor/getAvailability').then(function successCallback(res){
      console.log(res.data);
      $scope.mentorInfo = res.data;
      console.log(CONSTS.TIMESLOTLENGTH);
      var calAvail = BuildEvents(res.data, CONSTS.TIMESLOTLENGTH, items);
      for (var i=0; i<calAvail.length; i++)
        calAvail[i]._id = "_fc"+ parseInt(i + 1);
      console.log(calAvail);

      var calendar, dayCal;
      var active = false;
      var timeSlotLength = CONSTS.TIMESLOTLENGTH;

      //preparing detailed event info
      var details = $('.details');
      console.log(details);
      details.find('h1 span').html(eventObj.phase +"<br>"+ eventObj.title);

      console.log(eventObj.activity);
      var actText = details.find('h3:nth-of-type(2) + p');

      var activities = {};
      for (var i=0; i<eventObj.activity.length; i++) {
        actType = eventObj.activity[i].type;
        if (activities[actType] === undefined) {
          activities[actType] = 1;
        } else {
          activities[actType]++;
        }
      }

      actText.text('');
      var pastFirst = false;
      for (var key in activities) {
        if (activities.hasOwnProperty(key) && "book" !== key) {
          //listing
          if (pastFirst) {
            actText.text(actText.text() + ", ")
          } else {
            //regex could suffice instead of this system, to remove the ", " placed ahead
            pastFirst = true;
          }
          //printing
          actText.text(actText.text() + key.charAt(0).toUpperCase() + key.slice(1));
          //enumerating type
          if (1 < activities[key]) {
            actText.text(actText.text() +"s ("+ activities[key].toString() +")");
            //actText.text(actText.text() +" x"+ activities[key].toString());
          }
        }
      }

      console.log(eventObj);
      details.find('h3:last-of-type').text('Mentor:');
      details.find('h3:last-of-type + p').text($rootScope.userProfile.mentee[0].mentor);
      details.find('textarea').text(eventObj.menteeNotes);


      calendar = $('#calendar').fullCalendar({
        events: calAvail,
        defaultView: 'month',
        weekMode: 'liquid',
        height: 'auto',
        header: {
          left: '',
          center: 'prev title next',
          right: ''
        },
        dayNamesShort: ['Su','Mo','Tu','We','Th','Fri','Sa'],

        viewRender: function(view, element) {
          $('.fc-day-grid').addClass('cal-content');
          var cell = $('#calendar .fc-bg .fc-today');
          var row = cell.parent().parent().parent().parent().parent();
          setOverlays(true, 'over-today', row.index()+1, cell.index()+1);
          closeDay();
        },
        eventRender: function(event, element, view) {
          // this will only be triggered in initialization or when view is changed to month view to hide events from other months
          if(compareDates(new Date(), event.start._d) || event.start._i.getMonth() + 1 != getMonthFromString(view.title.split(" ")[0])) {
            return false;
          } else {
            // this is useful for things that aren't availabilities
            // if (compareDates(event.start._d, new Date())) {
            //   var listing = $('.list section[data-date="'+moment(event.start).format('YYYY-MM-DD')+'"] article[data-event="'+Date.parse(event.start)+'"]');
            //   if (!listing.length)
            //     createListing(event);
            // } else {
            //   $(element).addClass('fc-past');
            // }
            for (evt in calAvail) {
              if (calAvail[evt]._id==event._id)//this assumes events are always looped through in same order
                break;//breaking if unique or (consequently ^) first instance
              else if (calAvail[evt].start === event.start._i)
                return false;//preventing render if duplicate
            }
            $(element)
              .attr('disabled','true')
              .attr('data-date',moment(event.start).format('YYYY-MM-DD'))
              .on('click', function(e){
                setTimeout(function(){
                  if (false == active)
                    gotoDate(moment($(e.currentTarget).attr('data-date')), $(e.currentTarget).parent());
                });
              });
          }
        },
        dayRender: function(date, cell) {},
        dayClick: function(date, jsEvent) {
          active = true;
          gotoDate(date, $(this));
          setTimeout(function(){
            active = false;
          }, 20);
        }
      });

      dayCal = $('#day-cal').fullCalendar({
        // events: calAvail,
        defaultView: 'agendaDay',
        height: 'auto',
        header: {
          left: '',
          center: '',
          right: ''
        },
        allDaySlot: false,
        slotLabelFormat: 'h:mma',
        slotDuration: '01:00:00',
        // dayNamesShort: ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'],

        viewRender: function(view, element) {
          console.log("TIME:" + eventObj.start);
          eventObj.start = moment($('#calendar .fc-day.active').attr('data-date'));
          console.log(eventObj.start);

          $('#day-cal .fc-toolbar, #day-cal .fc-head').remove();

          $('#day-cal .active').removeClass('active');
          // var slats = $('#day-cal .fc-slats');
          // slats.detach().appendTo($('#day-cal .fc-time-grid'));
          //hiding unavailable times
          var allTimes = new Array();
          var calDate = moment(view.start).format('YYYY-MM-DD');
          for (var i=0;i<calAvail.length;i++) {
            var evtDate = moment(calAvail[i].start).format('YYYY-MM-DD');
            if (evtDate == calDate) {
              console.log(calAvail[i]);
              var start = calAvail[i].start.getHours();
              var end = calAvail[i].end.getHours();
              allTimes.push([start+1,end+1]);
            }
          }
          allTimes.reverse();
          console.log(allTimes);
          var slats = $('#day-cal .fc-slats');
          console.log(slats);
          if (allTimes.length) {
            slats.find('tr:nth-child(n+'+ allTimes[0][0] +')').css('border-bottom-color','transparent');
            //hiding cells
            slats.find('tr:nth-child(n+'+parseInt(allTimes[0][0] + 1)+')').hide();
            for (var i=1;i<allTimes.length;i++)
              slats.find('tr:nth-child(n+'+parseInt(allTimes[i][0] + 1)+'):nth-child(-n+'+parseInt(allTimes[i - 1][0] - 1)+')').hide();
            slats.find('tr:nth-child(-n+'+parseInt(allTimes[allTimes.length - 1][0] - 1)+')').hide();
            //[can merge these two loops ^ ]
            slats.find('tr:nth-child('+ allTimes[allTimes.length - 1][0] +')').css('border-top-color','transparent');
          }
          slats.find('tr:visible').each(function(i,elem){
            elem = $(elem);
            //how do I get event duration?
            var time = elem.find('td > span');
            time.html(time.text() +"<br>"+ moment(time.text(),'hh').add(eventObj.duration,'minutes').format('h:mma'));
          });
          $('#day-cal .fc-slats tr:visible td').on('click',function(e){
            var cell = $(this).parent();
            console.log(cell);
            setTimeActive(cell);
          });

        },
        eventRender: function(event, element, view) {
          return false;
          // this will only be triggered in initialization or when view is changed to month view to hide events from other months
          console.log(event.start._i.month())
          if(compareDates(new Date(), event.start._d) || event.start._i.month() != getMonthFromString(view.title.split(" ")[0])) {
            return false;
          } else {
            // this is useful for things that aren't availabilities
            // if (compareDates(event.start._d, new Date())) {
            //   var listing = $('.list section[data-date="'+moment(event.start).format('YYYY-MM-DD')+'"] article[data-event="'+Date.parse(event.start)+'"]');
            //   if (!listing.length)
            //     createListing(event);
            // } else {
            //   $(element).addClass('fc-past');
            // }
            for (evt in calAvail) {
              if (calAvail[evt]._id==event._id) //this assumes events are always looped through in same order
                break;//breaking if unique or (consequently ^) first instance
              else if (calAvail[evt].start === event.start._i)
                return false;//preventing render if duplicate
            }
            $(element)
              .attr('disabled','true')
              .attr('data-date',moment(event.start).format('YYYY-MM-DD'))
              .on('click', function(e){
                e.stopPropagation();
                gotoDate(moment($(this).attr('data-date')), $(this).parent());
              });
          }
        },
        dayRender: function(date, cell) {},
        dayClick: function(date, jsEvent) {
          // var time = $(this).parent().index();
          // var avail = $('#day-cal .fc-slats tr:visible');
          // time = $(avail[time]);
          // console.log(time);
          // openTime(time);
        }
      });
      $('.modal-cal > h1 > button:first-child').on('click', function(e){
        $('.modal-cal .page.details').hide().siblings().show();
        $('.modal-cal > h1 > span')
          .text("Book Appointment")
          .siblings('.back-button').hide();
      });

      dayCal.parent().hide();
      //instead of dayClick, which somehow complicates 'book it' button function
      function setTimeActive(cell) {
        // if (cell.children(':last-child').children().length) {
        if (cell.hasClass('active')) {
          removeDayActive();
        } else {
          removeDayActive();
          cell.addClass('active');

          var action = cell.children(':last-child');
          action.children().remove();
          action.append('<div><div></div><h2></h2><h2></h2></div>')
            .append('<button class="standard-button hollow">Book it!</button>');
          var info = $('.event-body:visible');

          //breaking text into two lines for display
          if (window.matchMedia('(min-width: 45em)').matches) {
            var heading = 'h4';
            var info = $('.event-body:visible').parent();
          } else {
            heading = 'h1';
            info = $('.event-details');
          }
          var line = info.find(heading +':last-of-type span').text().split(" ");
          var mid = Math.floor(line.length/2);
          var lineOne = line.splice(0, mid).join(' '),
              lineTwo = line.splice(mid - 1, line.length).join(' ');

          action
            .find('h2:first-of-type').html(info.find(heading +':first-of-type span').html())
            .next().html(lineOne +"<br>"+ lineTwo);

          var button = action.find('button');
          button.on('click',function(e){
            e.stopPropagation();

            var details = $('.details');
            details.find('h3:first-of-type').text(eventObj.start.format('ddd MMM D, YYYY'));
            eventObj.start = moment(eventObj.start).hour($('#day-cal .active').attr('data-time').split(":")[0])
            eventObj.start = moment(eventObj.start).minute($('#day-cal .active').attr('data-time').split(":")[1]);
            details.find('h3:first-of-type + p').text(eventObj.start.format('h:mma') +" - "+ eventObj.start.add(eventObj.duration,'minutes').format('h:mma'));

            details.show().siblings(':not(h1)').hide();
            $('.modal-cal > h1 > span')
              .text("Confirm Appointment")
              .siblings('.back-button').show();
          });
        }
      }
      function removeDayActive() {
        $('#day-cal .active')
          .removeClass('active')
          .children(':last-child').children().remove();
      }
      function openDay(date) {
        if ('undefined'!==typeof(dayCal)) {
          dayCal.parent().show();
          if ($('#calendar .fc-event[data-date="'+ moment(date).format("YYYY-MM-DD") +'"]').length) {
            dayCal.show();
            // dayCal.next().hide()
            dayCal.fullCalendar('gotoDate', date);
            $('.modal-cal > h2').text("book a time slot below!");
          } else {
            dayCal.hide();
            $('.modal-cal > h2').text("no availabilities on "+ moment(date).format("ddd MMM D"));
          }
        }
      }
      function closeDay() {
        if ('undefined'!==typeof(dayCal)) {
          dayCal.parent().hide();
          $('.modal-cal > h2').text("select a date");
        }
      }
      function closeDetails() {
        $('.details').hide();
        $('.book, .instruction, .times').show();
      }
      function viewDetails() {
        $('.details').show();
        $('.book, .instruction, .times').hide()

        details.find('h2').text(moment(event.start).format('dddd, MMMM D'))
          .parent().on('click',function(e){
            if ($('.appointments .details').hasClass('past')) {
              supplement.find('.list>h1').text(listStatus['past']);
            } else {
              supplement.find('.list>h1').text(listStatus['futr']);
            }
            var details = $('.appointments .list').show()
              .next().hide();
            supplement.find('section').hide();

            var section = supplement.find('section[data-date="'+details.attr('data-date')+'"]');
            if (section.length) {
              section.show();
            } else {
              resetList();
            }
          });
        details.find('h1>span').html(event.phase+"<br>"+event.title);
        details.find('h3:first-of-type').text(moment(event.start).format('ddd MMM D, YYYY'));
        details.find('p:nth-of-type(2)').text(moment(event.start).format('h:mma')+" - "+moment(event.start).add(event.duration,'minutes').format('h:mma'));
        details.find('p:nth-of-type(3)').text(event.description);
        if ($scope.userType == "mentee") {
          details.find('h3:last-of-type').text("Mentor:");
          // details.find('p:last-of-type').text($scope.userProfile.mentor); //this can't be right
        } else {
          details.find('h3:last-of-type').text("Mentee:");
          // details.find('p:last-of-type').text($scope.userProfile.mentee[0]); //this can't be right
        }
        details.find('textarea').text(event.menteeNotes);
      }
      function gotoDate(date, evtObj) {
        var calDate = $('#calendar').fullCalendar('getDate');
        var calMonth = calDate.get('month');
        var newMonth = date.month();
        var newDate = date.date();

        var pastActive = removeActive();
        removeDayActive();
        if (newMonth == calMonth && pastActive != newDate) {
          setActive(evtObj);
          openDay(date);
        } else {
          closeDay();
        }
      }
      function setActive(cell) {
        var index = cell.index() + 1;
        var row = cell.parent().parent().parent().parent().parent()
          .index() + 1;
        setOverlays(true, 'over-active', row, index);
        $('#calendar .cal-content .fc-row:nth-child('+row+')')
          .find('.fc-day:nth-child('+index+'), .fc-day-number:nth-child('+index+'), .fc-event-container:nth-child('+index+')>a')
          .each(function(){$(this).addClass('active');});
      }
      function removeActive() {
        var dateSet;
        $('#calendar .active').each(function(){
          $(this).removeClass('active');
          dateSet = $(this).attr('data-date').split("-")[2];
        });
        setOverlays(false, 'over-active');
        return dateSet;
      }
      function setOverlays(set, className, row, col) {
        if (set) {
          var overlay = $('#calendar .cal-content').clone()
            .removeClass('cal-content').addClass('overlay')
            .addClass(className)
            .attr('aria-hidden',true)
            .insertBefore('#calendar .cal-content');
          overlay.find('.fc-content-skeleton').remove();

          var rowObj = overlay.find('.fc-row:nth-child('+row+')');
          rowObj.nextAll().remove();
          cell = rowObj.find('.fc-day:nth-child('+col+')');
          cell.addClass('over-cell');
          if (col>1) cell.prev().addClass('beside-over');
        } else {
          $('.overlay.'+className).remove();
        }
      }
      function compareDates(dateFuture, datePast){
        if ( Date.parse( dateFuture ) > Date.parse( datePast ) )
          return true;
        return false;
      }
      function getMonthFromString(mon){
        var d = Date.parse(mon + "1, 2012");//2012?
        if(!isNaN(d))
          return new Date(d).getMonth() + 1;
        return -1;
      }
    }), function errorCallback(res){
      console.log(res);
    }
  }

  $(document).ready(function () {
    loadCalendar();
  });




});
