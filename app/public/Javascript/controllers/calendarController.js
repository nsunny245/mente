angular.module('psdnetAppControllers').controller('calendarController', function ($scope, $http, $cookies, CONSTS, $rootScope) {

  $scope.timeSlotLength = CONSTS.TIMESLOTLENGTH;
  $scope.dtFrom = null;
  $scope.dayNamesShort = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fri', 'Sa'];
  $scope.dayFullName = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  $scope.changed;

  $http.post('/matched/getinfo')
    .then(function(res){
      $scope.matched = res.data;
    });

  $scope.myAvailability = [];
  $scope.availSettings = [];
  $scope.myBlockedDates = [];
  $scope.myAddedDates = [];
  $scope.availabilityReminder = 'weekly';
  function LoadDates() {
    if ($scope.userProfile.status === 'mentor') {
      $scope.myAvailability = $scope.userProfile.mentor[0].availability;
      for (var i = 0; i < 7; i++) {
        $scope.availSettings.push([]);
        for (var j = 0; j < 3; j++) {
          $scope.availSettings[i].push($scope.myAvailability[i][j]);
        }
      }
      $scope.myBlockedDates = $scope.userProfile.mentor[0].blockedDates;
      $scope.myAddedDates = $scope.userProfile.mentor[0].addedDates;
      $scope.availabilityReminder = $scope.userProfile.mentor[0].availabilityReminder;
    }
  };
  LoadDates();

  $scope.cancelAppointment = function(id) {
    var eventToBeCancelled = calendar.fullCalendar('clientEvents', function (event) {
      if (event.id === id) {
        $http.post('/mentorships/cancelAppointment', {'event': event})
          .then(function(res){
            $state.reload(); //TODO should be more precise than this...
          });
      }
    });
  }


  $scope.AddTimeH = function (date, hours) {
    var d = new Date(date);
    return new Date(d.getTime() + (hours * 3600000));
  };
  $scope.GetTimeBFrom = function (valueFromDirective) {
    $scope.newbFrom = valueFromDirective;
    $scope.overlappingB = [];
    for (var i = 0; i < 3; i++) {
      if ($scope.myAvailability[valueFromDirective.getDay()][i].available) {
        var isBlocked = false;
        var valDir = new Date(valueFromDirective);
        valDir.setHours($scope.myAvailability[valueFromDirective.getDay()][i].start);
        var valMin = $scope.myAvailability[valueFromDirective.getDay()][i].start % 1 === 0 ? 0 : 30;
        valDir.setMinutes(valMin);
        for (var j = 0; j < $scope.myBlockedDates.length; j++) {
          var myBlocked = new Date($scope.myBlockedDates[j].start);
          isBlocked = Math.abs(myBlocked.getTime() - valDir.getTime()) < 1000 ? true : false;
          if (isBlocked) { break; }
        }


        $scope.overlappingB.push({
          start: $scope.myAvailability[valueFromDirective.getDay()][i].start,
          blocked: isBlocked
        });
      }
    }
  };
  /*$scope.GetTimeBTo = function(valueFromDirective){
    $scope.newbTo = valueFromDirective;
  };*/
  $scope.GetTimeAFrom = function (valueFromDirective) {
    $scope.newaFrom = valueFromDirective;
  };

  $scope.NewBlocked = function (from, index) {
    $scope.overlappingB[index].blocked = true;
    var fromD = $scope.newbFrom;
    console.log($scope.newbFrom.getTime());
    fromD.setHours(Math.floor(from));
    var minF = from % 1 === 0 ? 0 : 30;
    fromD.setMinutes(minF);
    fromD.setSeconds(0);
    fromD.setMilliseconds(0);
    var newB = { start: fromD };

    $scope.myBlockedDates.push(newB);
    console.log(newB);
    $http.post('/mentor/editBlockedAdded', { blockedDates: $scope.myBlockedDates }).then(function (res) {
      $scope.myBlockedDates = res.data.blocked;
      $scope.myAddedDates = res.data.added;
    });
  };
  $scope.RemoveBlocked = function (index) {
    $scope.myBlockedDates.splice(index, 1);
    $http.post('/mentor/editBlockedAdded', { blockedDates: $scope.myBlockedDates }).then(function (res) {
      $scope.myBlockedDates = res.data.blocked;
      $scope.myAddedDates = res.data.added;
    });
  };
  $scope.NewAdded = function (from) {
    var fromD = $scope.newaFrom;
    fromD.setHours(Math.floor(from));
    var minF = from % 1 === 0 ? 0 : 30;
    fromD.setMinutes(minF);
    var newA = { start: fromD };
    $scope.myAddedDates.push(newA);
    $http.post('/mentor/editBlockedAdded', { addedDates: $scope.myAddedDates }).then(function (res) {
      $scope.myBlockedDates = res.data.blocked;
      $scope.myAddedDates = res.data.added;
    });
  };
  $scope.RemoveAdded = function (index) {
    $scope.myAddedDates.splice(index, 1);
    $http.post('/mentor/editBlockedAdded', { addedDates: $scope.myAddedDates }).then(function (res) {
      $scope.myBlockedDates = res.data.blocked;
      $scope.myAddedDates = res.data.added;
    });
  };
  $scope.UpdateReminder = function () {
    $http.post('/mentor/updateReminder', { 'frequence': $scope.availabilityReminder }).then(function (res) {
      console.log(res);
    });
  };
  $scope.debug = function (parent, child) {
    console.log(parent + ' ' + child);
  };
  $scope.SaveAvailability = function (day) {
    for (var i = 0; i < 3; i++) {
      if ($scope.myAvailability[day][i].start === null) {
        $scope.myAvailability[day][i].available = false;
      } else {
        $scope.myAvailability[day][i].available = true;
      }
    }
    sortAvail(day);
    console.log(day);
    $http.post('/mentor/saveAvailability', $scope.myAvailability).then(function (res) {
      if (res) {
        console.log($scope.myAvailability);
        var elemSave = document.getElementById("saveDisplay" + day);
        console.log(elemSave);
        elemSave.classList.toggle('show');
        setTimeout(function () {
          elemSave.classList.toggle('show');
        }, 3000);
        console.log('success');
        //put stuff here about indicator
      }
      else {
        console.log('failed');
      }
    });
  };
  $scope.AvailChanged = function (day) {
    $scope.SaveAvailability(day);
    $scope.UpdateTimesAvailable(day);
    manageBars(day + 1);
  };
  $scope.RemoveAvailability = function (day, slot) {
    $scope.availSettings[day][slot].available = false;
    $scope.availSettings[day][slot].start = null;
    floatPotential(true, day);
    $scope.AvailChanged(day);
  };
  $scope.UpdateTimesAvailable = function (day, block) {
    var domDay = day + 1;
    var genUpdate = typeof (block) == 'undefined';
    if (genUpdate) {
      $('main section:nth-of-type(' + domDay + ') option').attr('disabled', false);
    } else {
      var domBlock = block + 1;
      $('main section:nth-of-type(' + domDay + ') .setters > div:nth-of-type(' + block + ') option').attr('disabled', false);
    }
    for (var i = 0; i < 3; i++) {
      if ($scope.availSettings[day][i].start != null && (genUpdate || i != block)) {
        var blockLen = 0;
        var pre = 0;
        //added this loop because availabilities aren't organized until reload
        for (var j = 0; j < 3; j++) {
          if ($scope.availSettings[day][j].start > pre && $scope.availSettings[day][i].start > $scope.availSettings[day][j].start) {
            pre = $scope.availSettings[day][j].start;
          }
        }
        //this conditional logic checks viability of time between appointments
        if (i > 0 && $scope.timeSlotLength > $scope.availSettings[day][i].start - pre) {
          var index = (pre - $scope.timeOfDay[0].value + $scope.timeSlotLength) * 2 - 1;
          blockLen += ($scope.availSettings[day][i].start - pre) * 2 - 1;
        } else {
          index = ($scope.availSettings[day][i].start - $scope.timeOfDay[0].value) * 2 - ($scope.timeSlotLength * 2 - 1);
        }
        blockLen += $scope.timeSlotLength * 4 - 1;
        //contains runoff into unlisted hours at beginning
        if (index < 0) {
          blockLen += index;
          index = 0;
        }
        var opt = index + 1;
        var stop = index + blockLen;
        var last = $scope.timeOfDay.length - ($scope.timeSlotLength * 2 - 1);
        //disabling
        if (genUpdate) {
          for (var j = 0; j < 3; j++) {
            //null are always floated to end, so no more non-null if true;
            //and null are dealt with independently, with a specified 'block'
            if ($scope.availSettings[day][j].start != null) {
              //excluding its own blocking
              if (j !== i) {
                setDisabled(domDay, j + 1, opt, stop, last);
              }
            } else {
              break;
            }
          }
        } else {
          //when adding a new availability, null extra option at beginning must be offset
          if ($scope.availSettings[day][block].start == null) {
            opt++ , stop++ , last++;
          }
          setDisabled(domDay, domBlock, opt, stop, last);
        }
        function setDisabled(domDay, domBlock, opt, stop, last) {
          $('main section:nth-of-type(' + domDay + ') .setters>div:nth-of-type(' + domBlock + ') option:nth-child(n+' + opt + '):nth-child(-n+' + stop + ')')
            .attr('disabled', true);
          //end of day
          $('main section:nth-of-type(' + domDay + ') .setters>div:nth-of-type(' + domBlock + ') option:nth-child(n+' + last + ')')
            .attr('disabled', true);
        }
      }
    }
  };
  function floatPotential(standin, day) {
    //can quit this early knowing length - total gaps cut
    if (standin) {
      for (var i = 0; i < 3; i++) {
        var j;
        if ($scope.availSettings[day][i].available === false) {
          for (j = i + 1; j < 3; j++) {
            if ($scope.availSettings[day][j].available === true) {
              break;
            }
          }
          if (j >= 3) {
            break;
          }
          var gap = $scope.availSettings[day].splice(i, j - i);
          if (gap.length > 1) {
            $scope.availSettings[day].concat(gap);
          } else {
            $scope.availSettings[day].push(gap[0]);
          }
          i = j;
        }
      }
    } else {
      for (var i = 0; i < 3; i++) {
        var j;
        if ($scope.myAvailability[day][i].available === false) {
          for (j = i + 1; j < 3; j++) {
            if ($scope.myAvailability[day][j].available === true) {
              break;
            }
          }
          if (j >= 3) {
            break;
          }
          var gap = $scope.myAvailability[day].splice(i, j - i);
          if (gap.length > 1) {
            $scope.myAvailability[day].concat(gap);
          } else {
            $scope.myAvailability[day].push(gap[0]);
          }
          i = j;
        }
      }
    }
  };
  function sortAvail(day) {
    floatPotential(false, day);
    for (var i = 0; i < 3; i++) {
      if ($scope.myAvailability[day][i].available === false) {
        break;
      } else {
        var erl = i;
        for (var j = i + 1; j < 3; j++) {
          if ($scope.myAvailability[day][j].available === false) {
            break;
          } else if ($scope.myAvailability[day][erl].start > $scope.myAvailability[day][j].start) {
            erl = j;
          }
        }
        if (erl !== i) {
          var inr = $scope.myAvailability[day][i];
          $scope.myAvailability[day][i] = $scope.myAvailability[day][erl];
          $scope.myAvailability[day][erl] = inr;
        }
      }
    }
  };

  function manageBars(domDay) {
    if (typeof (domDay) === 'undefined') {
      domDay = 'n';
    }
    if (window.matchMedia('(min-width: 45em)').matches) {
      $('main section:nth-of-type(' + domDay + ') .setters hr').hide();
    } else if (window.matchMedia('(min-width: 30em)').matches) {
      if (domDay == "n") {
        for (var i = 1; i <= 7; i++) {
          hideShowBars(i);
        }
      } else {
        hideShowBars(domDay);
      }
    } else {
      $('main section:nth-of-type(' + domDay + ') .setters hr').show();
    }
  };
  function hideShowBars(domDay) {
    $('main section:nth-of-type(' + domDay + ') .setters hr').hide();
    if ($scope.myAvailability[domDay - 1][1].start != null) {
      $('main section:nth-of-type(' + domDay + ') .setters > div:nth-of-type(-n+2)')
        .find('hr').show();
    }
  }
  var mq30 = window.matchMedia('(min-width: 30em)');
  mq30.onchange = function () {
    manageBars();
  };
  var mq45 = window.matchMedia('(min-width: 45em)');
  mq45.onchange = function () {
    manageBars();
  };


  $scope.timeOfDay = [];
  for (var i = 0; i < 33; i++) {
    var half = '';
    if (i % 2 != 0) {
      half = ':30';
    }
    var amPm = i >= 12 ? " pm" : " am";
    var amPmNum = i >= 14 ? 12 : 0;
    var t = Math.floor(6 + (i * 0.5) - amPmNum) + half;
    var tO = { "time": t + amPm, "value": (i * 0.5) + 6 };
    $scope.timeOfDay.push(tO);
  }
  setTimeout(function () {
    for (var i = 0; i < 7; i++) {
      $scope.UpdateTimesAvailable(i);
      sortAvail(i);
    }
    manageBars();
  }, 0);

  $scope.TimeConverter = function (val) {
    //impossible to get without null start
    if (2 == val) {
      return "";
    }
    var amPmMarker = val >= 12 ? "pm" : "am";
    var halfMaker = val % 1 === 0 ? ':00' : ":30";
    if (val > 12.5) {
      val -= 12;
    }
    return Math.floor(val) + halfMaker + amPmMarker;
  };


  $(document).ready(function () {
    var date = new Date();
    var d = date.getDate();
    var m = date.getMonth();
    var y = date.getFullYear();
    var calDataEvent;

    var listStatus = new Array();
    listStatus['all'] = "All Upcoming Events:";
    listStatus['none'] = "No Events Scheduled";
    listStatus['null'] = "No Events Found on:";
    listStatus['past'] = "Previous Events on:";
    listStatus['futr'] = "Upcoming Events for:";
    listStatus['bttn'] = "Back to my Events";

    var supplement = $('.supplement');
    var active = false;
    var heldEvent;

    //Need: Call http.get(events from db calendar)
    //then.(load and display the calendar.)

    $http.post('/calendar/load').then(function (response) {

      calDataEvent = response.data.events;//Response.data contains the edited personnal calendar and the main calendar in 1 array.
      if ($rootScope.userProfile.status === "mentee" || $rootScope.userProfile.status === "menteeInTraining") {
        var e = $rootScope.userProfile.mentee[0].timeline;
        for (var i = 0; i < e.length; i++) {
          if (e[i].calendarEnabled) {
            calDataEvent.push(e[i]);
          }
        }
      }
      else if ($rootScope.userProfile.status === "mentor" || $rootScope.userProfile === "mentorInTraining") {
        var e = $rootScope.userProfile.mentor[0].timeline;
        for (var i = 0; i < e.length; i++) {
          if (e[i].calendarEnabled) {
            calDataEvent.push(e[i]);
          }
        }
      }
      var calendar = $('#calendar').fullCalendar({
        events: calDataEvent,
        defaultView: 'month',
        weekMode: 'liquid',
        height: 'auto',
        header: {
          left: '',
          center: 'prev title next',
          right: ''
        },
        dayNamesShort: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fri', 'Sa'],

        viewRender: function (view, element) {
          $('.fc-day-grid').addClass('cal-content');
          var cell = $('#calendar .fc-bg .fc-today');
          var row = cell.parent().parent().parent().parent().parent();
          setOverlays(true, 'over-today', row.index() + 1, cell.index() + 1);

          $('.appointments section.default').hide()
            .children('button').on('click', function (e) {
              resetList();
            });

          $('.appointments .details button:first-of-type')
            .text(listStatus['bttn'])
            .on('click', function (e) {
              var listing = $('section[data-date="' + $(this).parent().attr('data-date') + '"] article');
              setOverlays(false, 'over-active')
              resetList();
              $('.appointments .list').show()
                .next().hide();
            });
          resetList();
        },
        eventRender: function (event, element, view) {
          //preventing other month's events from rendering
          if (event.start._i.split("-")[1] != getMonthFromString(view.title.split(" ")[0])) {
            return false;
          } else {
            if (compareDates(event.start._d, new Date())) {
              var listing = $('.list section[data-date="' + moment(event.start).format('YYYY-MM-DD') + '"] article[data-event="' + event.id + '"]');
              if (!listing.length)
                createListing(event);
            } else {
              $(element).addClass('fc-past');
            }
            for (evt in calDataEvent) {
              if (calDataEvent[evt].id == event.id) //this assumes events are always looped through in same order
                break;//breaking if unique or (consequently ^) first instance
              else if (calDataEvent[evt].start == event.start._i)
                return false;//preventing render if duplicate
            }
            $(element)
              .attr('disabled', 'true')
              .attr('data-date', moment(event.start).format('YYYY-MM-DD'))
              .on('click', function (e) {
                setTimeout(function () {
                  if (false == active) {
                    gotoDate(moment($(e.currentTarget).attr('data-date')), $(e.currentTarget).parent());
                  }
                }, 0);
              });
          }
        },
        dayRender: function (date, cell) { },
        dayClick: function (date, jsEvent) {
          active = true;
          gotoDate(date, $(this));
          setTimeout(function () {
            active = false;
          }, 20);
        },
      });
      function gotoDate(date, evtObj) {
        var calDate = $('#calendar').fullCalendar('getDate');
        var calMonth = calDate.get('month');
        var newMonth = date.month();
        var newDate = date.date();

        var pastActive = removeActive();

        if (newMonth == calMonth && pastActive != newDate) {
          setActive(evtObj);

          //list sanitized
          supplement.find('section.default').hide();
          supplement.find('section.past').remove();
          supplement.children('.list').show()
            .next().removeClass('past').hide();

          var daysEvents = calendar.fullCalendar('clientEvents', function (event) {
            if (moment(event.start).format('M') == calMonth + 1 && moment(event.start).format('D') == newDate) {
              return event;
            }
          });
          if (daysEvents.length) {
            if (compareDates(new Date(), daysEvents[0].start._d)) {
              //list, past
              supplement.find('section').hide();
              supplement.find('.list>h1').text(listStatus['past']);
              supplement.find('.details').addClass('past');
              for (evt in daysEvents) {
                createListing(daysEvents[evt]);
                supplement.find('section[data-date="' + moment(daysEvents[evt].start).format('YYYY-MM-DD') + '"]')
                  .addClass('past');
              }
              var section = supplement.find('section[data-date="' + moment(daysEvents[0].start).format('YYYY-MM-DD') + '"]');
              var listing = section.find('article');
              if (1 == listing.length)
                viewDetails(listing);
            } else {
              var section = supplement.find('section[data-date="' + moment(daysEvents[0].start).format('YYYY-MM-DD') + '"]');
              //list, date
              supplement.find('.list>h1').text(listStatus['futr']);
              supplement.find('section').hide();
              section.show();
              var listing = section.find('article');
              if (1 == listing.length)
                viewDetails(listing);
            }
          } else {
            //list, null
            supplement.find('.list>h1').text(listStatus['null']);
            supplement.find('section.default').show();
            supplement.find('section.default h2').text(moment(date).format('dddd, MMMM D'));
            supplement.find('section + section').hide();
          }
        } else {
          resetList();
        }
      }
      function createListing(event) {
        var article = '<article data-event="' + event.id + '">'
          + '<div class="hr-bound" aria-hidden="true"><div><hr></div></div>'
          + '<div class="col">'
          + '<p>' + moment(event.start).format('h:mma') + '</p>'
          + '<p>' + moment(event.start).add(event.duration, 'minutes').format('h:mma') + '</p>'
          + '<div class="v-bar" aria-hidden="true"></div>'
          + '</div>'
          + '<div class="col">'
          + '<p>' + event.phase + '</p>'
          + '<p>' + event.title + '</p>'
          + '</div>'
          + '<div class="hr-bound" aria-hidden="true"><div><hr></div></div>'
          + '<button class="page-nav"><span>View Details</span></button>'
          + '</article>';

        var date = moment(event.start).format('YYYY-MM-DD');

        var section = $('.appointments section[data-date="' + date + '"]');
        if (section.length) {
          $(article).appendTo(section);
        } else {
          var section = '<section data-date="' + date + '">'
            + '<button><h2>' + moment(event.start).format('dddd, MMMM D') + '</h2></button>'
            + article
            + '</section>';
          $(section).appendTo('.appointments>.list');
          var section = $('.list section:last-of-type');
          section.children('article:last-of-type div.hr-bound:first-child').hide();
          section.children('button').on('click', function (e) {
            var date = $(this).parent().attr('data-date');
            var cell = $('#calendar .cal-content .fc-day[data-date="' + date + '"]');
            $('#calendar').fullCalendar('gotoDate', date);
            gotoDate(moment(date, "YYYY-MM-DD"), cell);
          });

        }
        $('.appointments section[data-date="' + date + '"] article:last-child button').on('click', function (e) {
          viewDetails($(this).parent());
        });
      }
      function viewDetails(listing) {
        var eventIndex = listing.attr('data-event');
        var details = $('.appointments .list').hide()
          .next().show()
          .attr('data-date', listing.parent().attr('data-date'))
          .find('.cancel-button')
            .attr('ng-click','cancelAppointment('+ eventIndex +')'); //TODO will this work?

        for (evt in calDataEvent) {
          if (calDataEvent[evt].id == eventIndex) {
            heldEvent = calDataEvent[evt];
            break;
          }
        }
        console.log(calDataEvent);
        console.log(heldEvent);
        if (0 == $('#calendar .active').length)
          setActive($('#calendar .fc-day[data-date="' + details.attr('data-date') + '"]'));

        details.find('h2').text(moment(heldEvent.start).format('dddd, MMMM D'))
          .parent().on('click', function (e) {
            if ($('.appointments .details').hasClass('past')) {
              supplement.find('.list>h1').text(listStatus['past']);
            } else {
              supplement.find('.list>h1').text(listStatus['futr']);
            }
            var details = $('.appointments .list').show()
              .next().hide();
            supplement.find('section').hide();

            var section = supplement.find('section[data-date="' + details.attr('data-date') + '"]');
            if (section.length) {
              section.show();
            } else {
              resetList();
            }
          });
        details.find('h1>span').html(heldEvent.phase + "<br>" + heldEvent.title);
        details.find('h3:first-of-type').text(moment(heldEvent.start).format('ddd MMM D, YYYY'));
        details.find('p:nth-of-type(2)').text(moment(heldEvent.start).format('h:mma') + " - " + moment(heldEvent.start).add(heldEvent.duration, 'minutes').format('h:mma'));
        details.find('p:nth-of-type(3)').text(heldEvent.description);
        if ($scope.userType == "mentee") {
          details.find('h3:last-of-type').text("Mentor:");
          details.find('p:last-of-type').text($scope.matched.firstName +" "+ $scope.matched.lastName);
        } else {
          details.find('h3:last-of-type').text("Mentee:");
          var name;
          if (heldEvent.menteeEmail === $scope.matched[0].email) {
            name = $scope.matched[0].firstName +" "+ $scope.matched[0].lastName;
          } else {
            name = $scope.matched[1].firstName +" "+ $scope.matched[1].lastName;
          }
          details.find('p:last-of-type').text(name);
        }
        details.find('textarea').text(heldEvent.menteeNotes);
        //notes aren't added?
      }
      function resetList() {
        //list reset
        var events = $('#calendar').fullCalendar('clientEvents', function (event) {
          if (compareDates(event.start._d, new Date())) {
            return event; //just get one?
          }
        });
        if (events.length > 0) {
          supplement.find('.list>h1').text(listStatus['all']);
        } else {
          supplement.find('.list>h1').text(listStatus['none']);
        }
        supplement.children('.list').show().next().removeClass('past').hide();
        supplement.find('section.default').hide();
        supplement.find('section.past').remove();
        supplement.find('section + section').show();
        removeActive();
      }
      function setActive(cell) {
        var index = cell.index() + 1;
        var row = cell.parent().parent().parent().parent().parent()
          .index() + 1;
        setOverlays(true, 'over-active', row, index);
        $('#calendar .cal-content .fc-row:nth-child(' + row + ')')
          .find('.fc-day:nth-child(' + index + '), .fc-day-number:nth-child(' + index + '), .fc-event-container:nth-child(' + index + ')>a')
          .each(function () { $(this).addClass('active'); });
      }
      function removeActive() {
        var dateSet;
        $('#calendar .active').each(function () {
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
            .attr('aria-hidden', true)
            .insertBefore('#calendar .cal-content');
          overlay.find('.fc-content-skeleton').remove();

          var rowObj = overlay.find('.fc-row:nth-child(' + row + ')');
          rowObj.nextAll().remove();
          cell = rowObj.find('.fc-day:nth-child(' + col + ')');
          cell.addClass('over-cell');
          if (col > 1) cell.prev().addClass('beside-over');
        } else {
          $('.overlay.' + className).remove();
        }
      }
      function compareDates(dateFuture, datePast) {
        if (Date.parse(dateFuture) > Date.parse(datePast))
          return true;
        return false;
      }
      function getMonthFromString(mon) {
        var d = Date.parse(mon + "1, 2012");//2012?
        if (!isNaN(d))
          return new Date(d).getMonth() + 1;
        return -1;
      }
      ///*********CLOSING PAGE-BUFFER****************//
      setTimeout($scope.PageLoaded, 0);
      ///*********CLOSING PAGE-BUFFER****************//
    });

    $scope.UpdateMenteeNotes = function () {
      heldEvent.menteeNotes = $('.details textarea');
    };

    var mq45 = window.matchMedia("(min-width: 45em)");
    mq45.onchange = function () { breakTriggered(); }
    var mq60 = window.matchMedia("(min-width: 60em)");
    mq60.onchange = function () { breakTriggered(); }

    $scope.$on('$viewContentLoaded', function (e) {
      setTimeout(function () {
        breakTriggered();
      }, 0);
    });
    function breakTriggered() {
      if (window.matchMedia("(min-width: 45em)").matches) {
        offsetCalCont();
      }
    }
    function offsetCalCont() { // not sure what exists to avoid this
      setTimeout(function () {
        var margin = $('.supplement .page:visible h1').outerHeight() + "px";
        $('.cal-container').css('margin-top', margin);
      }, 0);
    }
  });
});