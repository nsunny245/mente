angular.module('psdnetAppControllers').controller('homeController', function ($scope, $http, $rootScope) {
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
    group_pink.yExt = "bex-50";
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
    meeting.yExt = "bex-50";
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
    three_girls.yExt = "bex-50";
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
    computer_bench.yExt = "bex-50";
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
    book_stack.yExt = "bex-50";
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
    two_library.yExt = "bex-50";
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
    computer_tablet.yExt = "bex-50";
    carouselImgPool.computer_tablet = computer_tablet;

    console.log($scope.carouselImgPool);


    var carouselImages = [];
    //carouselImages[0] = null;
    // carouselImages[1] = img1;
    // carouselImages[2] = img2;
    // carouselImages[3] = img3;
    // carouselImages[4] = img4;
    carouselImages[0] = carouselImgPool.computer_tablet;
    carouselImages[1] = carouselImgPool.three_girls;
    carouselImages[2] = carouselImgPool.men_park;
    carouselImages[3] = carouselImgPool.meeting;

    console.log(carouselImages);

    for (let i = 0; i < carouselImages.length; i++) {
        if (carouselImages[i] !== null) {
            carouselImages[i].id = i;
            carouselImages[i].src = carouselImages[i].img;
        }
    }
    console.log(carouselImages);


    var carouselContent = [];
    carouselContent[0] = {
        'title': "Join and empower yourself!",
        'content': "Get the information you need to empower yourself. CommunAbility offers education materials and a library of resources that is growing!",
        'action': {
            'text': "Find out more",
            'anchor': true,
            'reference': "#/mentorship",
        },

        'vertPos': "top",
        'horiPos': "left",
        'titletextcolor': "white",
        'backgroundcolor': "blueBg",
        'textcolor': "white",
    };
    carouselContent[1] = {
        'title': "Get the mentorship you need",
        'content': "Join the Communability mentorship program and get the support you need to reach your goals! It’s FREE so sign-up.",
        'action': {
            'text': "Find out more",
            'anchor': true,
            'reference': "#/mentorship",
        },
        'vertPos': "bottom",
        'horiPos': "right",
        'titletextcolor': "white",
        'backgroundcolor': "darkblueBg",
        'textcolor': "white"
    };
    carouselContent[2] = {
        'title': "Start a conversation - Grow your network",
        'content': "Join our FREE CommunAbility community and get access to forums where you can connect with other college and university students with disabilities.",
        'action': {
            'text': "Find out more",
            'anchor': true,
            'reference': "#/mentorship",
        },
        'vertPos': "bottom",
        'horiPos': "left",
        'titletextcolor': "white",
        'backgroundcolor': "blueBg",
        'textcolor': "white"
    };
    carouselContent[3] = {
        'title': "Give back - Become a mentor",
        'content': "Become a mentor and give back your accumulated knowledge and life experience to a college or university student with a disability.",
        'action': {
            'text': "Find out more",
            'anchor': true,
            'reference': "#/mentorship",
        },
        'vertPos': "bottom",
        'horiPos': "left",
        'titletextcolor': "darkBlue",
        'backgroundcolor': "yellowBg",
        'textcolor': "darkBlue"
    };
    //COMMENTED OUT BECAUSE THE VIDEO IS NOW GONE
    // $scope.$watch('carouselIndex2', function (newIndex, oldIndex) {
    //     if (oldIndex === 0 && newIndex === 1) {
    //         $('#mainvid')[0].pause();
    //     }
    //     if (oldIndex === 1 && newIndex === 0) {
    //         $('#mainvid')[0].play();
    //     }

    // });
    $scope.Images = carouselImages;
    $scope.Content = carouselContent;
    $scope.active = $('.caro-head .active').index();
});