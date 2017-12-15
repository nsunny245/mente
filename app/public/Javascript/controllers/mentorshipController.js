angular.module('psdnetAppControllers').controller('mentorshipController', function ($scope, $rootScope, $http, $state) {

  //
  // GetMessages('/contentManager/retrieveMessages/home', "home", $http, $scope);
  //for testing. Images should come from the DB.

/* CAROUSEL IMAGE POOL */
var carouselImgPool = {};
var men_park = new Image();
men_park.src = "";
men_park.img = "/Assets/Images/carousel_imgs/men_park.jpg";
men_park.xPos = [ //these correspond to classes dealing percentages for background x-position at breakpoints 320,480,720,960
    "b320-50",
    "b480-50",
    "b720-50",
    "b960-50",
];
men_park.yExt = "bex-50";
carouselImgPool.men_park = men_park;

var group_pink = new Image();
group_pink.src = "";
group_pink.img = "/Assets/Images/carousel_imgs/group_pink.jpg";
group_pink.xPos = [ //these correspond to classes dealing percentages for background x-position at breakpoints 320,480,720,960
    "b320-50",
    "b480-50",
    "b720-50",
    "b960-50",
];
carouselImgPool.group_pink = group_pink;

var meeting = new Image();
meeting.src = "";
meeting.img = "/Assets/Images/carousel_imgs/meeting.jpg";
meeting.xPos = [
    "b320-50",
    "b480-50",
    "b720-50",
    "b960-50",
];
carouselImgPool.meeting = meeting;

var three_girls = new Image();
three_girls.src = "";
three_girls.img = "/Assets/Images/carousel_imgs/three_girls.jpg";
three_girls.xPos = [
    "b320-50",
    "b480-50",
    "b720-50",
    "b960-50",
];
carouselImgPool.three_girls = three_girls;

var computer_bench = new Image();
computer_bench.src = "";
computer_bench.img = "/Assets/Images/carousel_imgs/computer_bench.jpg";
computer_bench.xPos = [
    "b320-50",
    "b480-50",
    "b720-50",
    "b960-50",
];
carouselImgPool.computer_bench = computer_bench;

var book_stack = new Image();
book_stack.src = "";
book_stack.img = "/Assets/Images/carousel_imgs/book_stack.jpg";
book_stack.xPos = [
    "b320-50",
    "b480-50",
    "b720-50",
    "b960-50",
];
carouselImgPool.book_stack = book_stack;

var two_library = new Image();
two_library.src = "";
two_library.img = "/Assets/Images/carousel_imgs/two_library.jpg";
two_library.xPos = [
    "b320-50",
    "b480-50",
    "b720-50",
    "b960-50",
];
carouselImgPool.two_library = two_library;

var computer_tablet = new Image();
computer_tablet.src = "";
computer_tablet.img = "/Assets/Images/carousel_imgs/computer_tablet.jpeg";
computer_tablet.xPos = [
    "b320-50",
    "b480-50",
    "b720-50",
    "b960-50",
];
carouselImgPool.computer_tablet = computer_tablet;

  var carouselImages = [];
  carouselImages[0] = carouselImgPool.two_library;
  carouselImages[1] = carouselImgPool.book_stack;

  for (let i=0; i<carouselImages.length; i++) {
      if (carouselImages[i] !== null) {
          carouselImages[i].id = toString(i);
          carouselImages[i].src = carouselImages[i].img;
      }
  }



  var carouselContent = [];

  $scope.applyForward = function() {
    if ($scope.loggedIn()) {
      $state.go('signup.mentorship');
    }
  }

  carouselContent[0] = {
    'title': "Apply today!",
    'content': "A mentor is just a few clicks away! Apply, complete the online training, and start chatting with a mentor.",
    'action': {
        'text': "Apply Now",
        'anchor': false,
        'reference': $scope.applyForward,
    },
    'vertPos': "bottom",
    'horiPos': "left",
    'backgroundcolor': "blueBg",
    'titletextcolor': "white",
    'textcolor': "white"
  };
  carouselContent[1] = {
    'title': "Get the mentorship you need",
    'content': "Our mentors know what it’s like to be a college or university student with a disability and can support you in your journey.",
    'action': {
        'text': "Apply Now",
        'anchor': false,
        'reference': $scope.applyForward,
    },
    'vertPos': "bottom",
    'horiPos': "right",
    'backgroundcolor': "darkblueBg",
    'titletextcolor': "white",
    'textcolor': "white"
  };

  $scope.Images = carouselImages;
  $scope.Content = carouselContent;

  // GetMessages('/contentManager/retrieveMessages/mentorship', "mentorship", $http, $scope);

  $scope.mentorSample = [];
  $http.get('/mentor/randomSample').then(function (res) {
    $scope.mentorSample = res.data;
    ///*********CLOSING PAGE-BUFFER****************//
    setTimeout($scope.PageLoaded, 0, true);
    ///*********CLOSING PAGE-BUFFER****************//
  });

  $('.art-content button').on('click', function (e) {
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
});