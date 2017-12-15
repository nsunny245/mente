//testing directive
//used to segment that single page app in more details. Can also add
//events and listeners.


//checklist validator

angular.module('psdnetApp').directive('checkRequired', function(){
  return {
    require: 'ngModel',
    restrict: 'A',
    link: function (scope, element, attrs, ngModel) {
      ngModel.$validators.checkRequired = function (modelValue, viewValue) {
        var value = modelValue || viewValue;
        var match = scope.$eval(attrs.ngTrueValue) || true;
        return value && match === value;
      };
    }
  }; 
});


// angular.module('psdnetApp').directive('fieldInputText', function(){
//   return {
//     template: '/views/FormComponents/fieldInputText.html',
//     scope: {
//       inputMeta: '=',
//       label: '=',
//       subLabel: '=',
//       placeholder: '=',
//       model: '=',
//       id: '=',

//       validate: '=',
//       parentForm: '=',
//       defaultMsg: '',
//       min: '=',
//       minMsg: '=',
//       max: '=',
//       maxMsg: '='
//     },
//     replace: true,
//     link: function (scope) {

//     }
//   }
// });


/*global angular */

angular.module('psdnetApp').filter('inArray', function ($filter) {
  return function (list, arrayFilter, element) {
    if (arrayFilter) {
      return $filter("filter")(list, function (listItem) {
        return arrayFilter.indexOf(listItem[element]) != -1;
      });
    }
  };
});

angular.module('psdnetApp').directive('toggleClass', function () {
  return {
    restrict: 'A',
    link: function (scope, element, attrs) {
      element.bind('click', function () {
        element.toggleClass(attrs.toggleClass);
      });
    }
  };
});

angular.module('psdnetApp').directive('youtube', function ($sce) {
  return {
    restrict: 'EA',
    scope: { code: '=' },
    replace: true,
    template: '<div class="auto-resize-iframe"><div><iframe src="{{url}}" frameborder="0" allowfullscreen></iframe></div></div>',
    link: function (scope) {
      scope.$watch('code', function (newVal) {
        if (newVal) {
          scope.url = $sce.trustAsResourceUrl("http://www.youtube.com/embed/" + newVal);
        }
      });
    }
  };
});

// angular.module('psdnetApp')
//   .filter('ngRepeatFinish', function($timeout){
//     return function(data){
//       var me = this;
//       var flagProperty = '__finishedRendering__';
//       if(!data[flagProperty]){
//         Object.defineProperty(
//           data, 
//           flagProperty, 
//           {enumerable:false, configurable:true, writable: false, value:{}});
//         $timeout(function(){
//             delete data[flagProperty];                    
//             me.$emit('ngRepeatFinished');
//           },0,false);                
//       }
//       return data;
//   };
// });



(function (ng) {
  'use strict';

  var app = ng.module('ngLoadScript', []);

  app.directive('script', function () {
    return {
      restrict: 'E',
      // replace: true,
      scope: { value: '=', onEdit: '&' },
      link: function (scope, elem, attr) {
        if (attr.type === 'text/javascript-lazy') {
          var s = document.createElement("script");
          s.type = "text/javascript";
          var src = elem.attr('src');
          if (src !== undefined) {
            s.src = src;
          }
          else {
            var code = elem.text();
            s.text = code;
          }
          document.head.appendChild(s);
          elem.remove();
          /*var f = new Function(code);
          f();*/
        }
      }
    };
  });

}(angular));

angular.module('psdnetApp.directives.home', [])
  .directive('maincaro', function () {
    return {
      restrict: 'E',
      templateUrl: 'views/Mentorship/carousel.html'
    }
  })


angular.module('psdnetApp.directives.userForms', [])
  .directive('formHeader', function () {
    return {
      restrict: 'E',
      scope: false,
      templateUrl: 'views/Mentorship/userForms/formHeader.html'
    }
  }).directive('genderIdentity', function () {
    return {
      restrict: 'E',
      templateUrl: 'views/Mentorship/userForms/formGender.html'
    }
  }).directive('terms', function () {
    return {
      restrict: 'E',
      templateUrl: 'views/Mentorship/Forms/terms.html'
    }
  }).directive('underconstruction', function () {
    return {
      restrict: 'E',
      templateUrl: 'views/underconstruction.html'
    }
  }).directive('lower', function () {
    return {
      require: 'ngModel',
      link: function (scope, element, attrs, modelCtrl) {
        var lower = function (inputValue) {
          if (inputValue == undefined) inputValue = '';
          var lowered = inputValue.toLowerCase();
          if (lowered !== inputValue) {
            modelCtrl.$setViewValue(lowered);
            modelCtrl.$render();
          }
          return lowered;
        }
        modelCtrl.$parsers.push(lower);
        lower(scope[attrs.ngModel]);
      }
    };
  });
//modal template 
angular.module('psdnetApp.directives.Modals', [])
  .directive('loginModal', function () {
    return {
      restrict: 'E',
      replace: true,
      transclude: true,
      templateUrl: 'views/Modals/loginModal.html'
    }
  }).directive('searchModal', function () {
    return {
      restrict: 'E',
      replace: true,
      transclude: true,
      templateUrl: 'views/Modals/searchModal.html'
    }
  }).directive('menteeMentorModal', function () {
    return {
      restrict: 'E',
      replace: true,
      transclude: true,
      templateUrl: 'views/Modals/menteeMentorModal.html'
    }
  }).directive('bookingModal', function () {
    return {
      restrict: 'E',
      replace: true,
      transclude: true,
      templateUrl: 'views/Modals/bookingModal.html',
      link: function (scope, element, attrs) {
        scope.selectedEvent = attrs.event;
      }
    }
  }).directive('profileDeleteModal', function () {
    return {
      restrict: 'E',
      replace: true,
      transclude: true,
      templateUrl: 'views/Modals/profileDeleteModal.html'
    }
  }).directive('closeRelationshipModal', function () {
    return {
      restrict: 'E',
      replace: true,
      transclude: true,
      templateUrl: 'views/Modals/closeRelationshipModal.html'
    }
  }).directive('renewMentorshipModal', function () {
    return {
      restrict: 'E',
      replace: true,
      transclude: true,
      templateUrl: 'views/Modals/renewMentorshipModal.html'
    }
  }).directive('requestMentorModal', function () {
    return {
      restrict: 'E',
      replace: true,
      transclude: true,
      templateUrl: 'views/Modals/requestMentorModal.html'
    }
  });


//a directive for comparing passwords
angular.module('psdnetApp.directives.pwCheck', [])
  .directive('pwCheck', function () {
    return {
      require: 'ngModel',
      link: function (scope, elem, attrs, ctrl) {
        var firstPassword = '#' + attrs.pwCheck;
        $(elem).add(firstPassword).on('keyup', function () {
          scope.$apply(function () {
            console.info(elem.val() === $(firstPassword).val());
            ctrl.$setValidity('pwmatch', elem.val() === $(firstPassword).val());
          });
        });
      }
    }
  });

//scroll directive
angular.module('psdnetApp.directives.scrollDown', [])
  .directive('scrollDown', function () {
    return {
      scope: {
        scrollDown: "="
      },
      link: function (scope, element) {
        scope.$watchCollection('scrollDown', function (newValue) {
          if (newValue) {
            $(element).scrollTop($(element)[0].scrollHeight);
          }
        });
      }
    }
  }).directive('ngEnter', function () {
    return function (scope, element, attrs) {
      element.bind("keydown", function (e) {
        if (e.which === 13) {
          scope.$apply(function () {
            scope.$eval(attrs.ngEnter, { 'e': e });
          });
          e.preventDefault();
        }
      });
    };
  });

//TODO remove
//Directive used to post to the database.
angular.module('psdnetApp.directives.forum', [])
  .directive('forumPost', function () {
    return {
      restrict: 'E',
      link: function (scope, element, attrs) {
        //console.log(arguments);
        element.on("click", function () {
          //Calls the post function on the forum controller.
          //May consider moving the function here.
          scope.Post();

        });
      },
      controller: function ($scope) {

      }
    };
  })
  .directive('forumRules', function () {
    return {
      restrict: 'E',
      templateUrl: 'views/Community/forum-rules.html',
      scope: false
    }
  });
//Custom element that diplays a single post.
angular.module('psdnetApp.directives.post', [])
  .directive('post', function () {
    return {
      restrict: 'E',
      templateUrl: "views/Community/aPost.html",
      scope: false
    };
  });
//Custom element
angular.module('psdnetApp.directives.psdnetMail', [])
  .directive('psdnetMail', function () {
    return {
      restrict: 'E',
      templateUrl: "views/Dashboard/mail.html",
      link: function (scope, element, attrs) {

      },
      controller: function ($scope) {

      }
    };
  });
//Custom element that displays the chat window.
angular.module('psdnetApp.directives.psdnetChat', [])
  .directive('psdnetChat', function () {
    return {
      restrict: 'E',
      controller: "chatController",
      templateUrl: "views/Mentorship/chat.html",
      link: function (scope, element, attrs) {

      }
    };
  });
angular.module('psdnetApp.directives.psdnetDatePickerPopUp', [])
  .directive('datepickerPopup', function () {
    return {
      controller: 'DatepickerPopupCTR',
      templateUrl: 'views/Custom/datePopup.html',
      scope: {
        "myDatePicker": "="
      }
    };
  });

/* Replaces native anchor functionality blocked by angular */
angular.module('ngScrollTo', []);

angular.module('ngScrollTo')
  .directive('scrollTo', ['ScrollTo', function (ScrollTo) {
    return {
      restrict: "AC",
      compile: function () {

        return function (scope, element, attr) {

          var handler = function (event) {
            event.preventDefault();
            ScrollTo.idOrName(attr.scrollTo, attr.offset);
          };

          element.bind("click", handler);

          scope.$on('$destroy', function () {
            element.unbind("click", handler);
          });

        };
      }
    };
  }])
  .service('ScrollTo', ['$window', 'ngScrollToOptions', function ($window, ngScrollToOptions) {

    this.idOrName = function (idOrName, offset, focus) {//find element with the given id or name and scroll to the first element it finds
      var document = $window.document;

      if (!idOrName) {//move to top if idOrName is not provided
        $window.scrollTo(0, 0);
      }

      if (focus === undefined) { //set default action to focus element
        focus = true;
      }

      //check if an element can be found with id attribute
      var el = document.getElementById(idOrName);
      if (!el) {//check if an element can be found with name attribute if there is no such id
        el = document.getElementsByName(idOrName);

        if (el && el.length)
          el = el[0];
        else
          el = null;
      }

      if (el) { //if an element is found, scroll to the element
        if (focus) {
          el.focus();
        }

        ngScrollToOptions.handler(el, offset);
      }

      //otherwise, ignore
    }

  }])
  .provider("ngScrollToOptions", function () {
    this.options = {
      handler: function (el, offset) {
        if (offset) {
          var top = el.getBoundingClientRect().top + el.ownerDocument.body.scrollTop - offset;
          window.scrollTo(0, top);
        }
        else {
          el.scrollIntoView();
        }
      }
    };
    this.$get = function () {
      return this.options;
    };
    this.extend = function (options) {
      this.options = angular.extend(this.options, options);
    };
  });
