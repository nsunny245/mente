angular.module('psdnetAppControllers').controller('faqsController', function ($scope, $http) {
    $scope.faqOpenSrc = "/Assets/Images/chevron-down-gray.svg";
    $scope.faqClosedSrc = "/Assets/Images/chevron-forward-gray.svg";

    $scope.toggleFaq = function(evt) {
        var btn = $(evt.currentTarget);
        if (!btn.siblings('.faq-content').hasClass('collapsing')) {
            if ("true" == btn.attr('data-faq-open')) {
                btn
                    .attr('data-faq-open', 'false')
                    .find('img').attr('src', $scope.faqClosedSrc);
            } else {
                $('.faq-body button[data-faq-open="true"]')
                    .attr('data-faq-open', 'false')
                    .find('img').attr('src', $scope.faqClosedSrc);
                btn
                    .attr('data-faq-open', 'true')
                    .find('img').attr('src', $scope.faqOpenSrc);
            }
        }
    };

    $(document).on('shown.bs.collapse', '.faq-content', function (e) {
        var btn = $(e.currentTarget).siblings('.faq-trigger');
        var scroll = $(window).scrollTop();
        var offset = btn.offset().top - $('navbar-custom').outerHeight();;
        if (scroll > offset) {
            $scope.gotoAnchor(btn.attr('id'));
        }
    });

});
