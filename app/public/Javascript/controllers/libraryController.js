angular.module('psdnetAppControllers').controller('libraryController', function ($rootScope, $scope, $http, previousLoc, $location, $state, checkBoxes, $window) {
    var catSort = "";
    $scope.selectedCat = {};
    $scope.filters = [];

    let content = new Map(
        [
            //normal
            [
                {
                    title: "Social Media Resources for Persons with Disabilities Media Access Australia",
                    description: "",
                    content: "This website offers a comprehensive overview of the latest assistive and mainstream technologies available for persons with disabilities.  The Media Access site contains resource guides and courses on accessibility and digital information, such as the professional certificate in web accessibility.  In addition, there is a podcast section outlining podcasts in current access trends.",
                    weblinks: [
                        {
                            "title": "Media Access",
                            "description": "For more information, visit the above link.",
                            "address": "mediaaccess.org.au/"
                        }
                    ],
                    pdfs: [],
                    images: [],
                    video: []
                }, "Accessibility of social media",
            ],
            [
                {
                    title: "Social Media Accessibility",
                    description: "",
                    content: "This Queens University website provides tips and methods that improve the accessibility for users of social media websites. A helpful resource for students with disabilities as well as faculty who would like to incorporate social media tools such as Facebook and Twitter into the classroom, coursework and evaluations.",
                    weblinks: [
                        {
                            "title": "Queens University, Web Accessibility",
                            "description": "For more information, visit the above link.",
                            "address": "queensu.ca/accessibility/how-info/social-media-accessibility"
                        }
                    ],
                    pdfs: [],
                    images: [],
                    video: []
                }, "Accessibility of social media",
            ],
            [
                {
                    title: "UX of People with Disabilities: Advancing Accessibility in Social Media",
                    description: "",
                    content: "This resource presents creative solutions to making social media platforms more accessible.",
                    weblinks: [
                        {
                            "title": "UX of People with Disabilities",
                            "description": "For more information, visit the above link.",
                            "address": "modelviewculture.com/pieces/ux-of-people-with-disabilities-advancing-accessibility-in-social-media"
                        }
                    ],
                    pdfs: [],
                    images: [],
                    video: []
                }, "Accessibility of social media",
            ],
            [
                {
                    title: "Sociability: social media for people with a disability",
                    description: "",
                    content: "Funded by the Australian Communications Consumer Action Network (ACCAN), the Sociability: social media for people with a disability review aims to enable all users to have equal access to the inclusion which social media allows. In the review, social media users with disabilities contributed their tips and tricks on how to overcome these barriers.",
                    weblinks: [
                        {
                            "title": "The Sociability: social media for people with a disability review",
                            "description": "For more information, visit the above link.",
                            "address": "accessiq.org/news/.../07/social-media-for-people-with-a-disability"
                        }
                    ],
                    pdfs: [],
                    images: [],
                    video: []
                }, "Accessibility of social media",
            ],
            [
                {
                    title: "Ellis, K., Goggin, G., Huntsinger, J., & Senft, T. (2014). Disability and social media. The Social Media Handbook, 126-143.",
                    description: "",
                    content: "This book offers concise introductory discussion about the complete relationship between disability and the media. It covers topics related to disabled peoples participation, representation and access.",
                    weblinks: [],
                    pdfs: [],
                    images: [],
                    video: []
                }, "Accessibility of social media",
            ],
            [
                {
                    title: "Shpigelman, C. N., & Gill, C. J. (2014). Facebook use by persons with disabilities. Journal of Computer-Mediated Communication, 19, 610–624. doi: 10.1111/jcc4.12059",
                    description: "",
                    content: "Paper discusses a study about how persons with disabilities use of Facebook. The authors use primarily descriptive statistics and also compared activities relating to nondisabled and disabled friends and groups.",
                    weblinks: [],
                    pdfs: [],
                    images: [],
                    video: []
                }, "Accessibility of social media",
            ],

            /*[
                {
                    title: "Library Item 1",
                    description: "Short Description for Library Item 1 (Weblinks)",
                    content: "Long description text for item 1",
                    weblinks: [
                        {
                            "title": "Google",
                            "description": "Follow this link to google stuff, etc.",
                            "address": "google.com"
                        },
                        {
                            "title": "Yahoo",
                            "description": "Follow this link to... yahoo stuff, etc.",
                            "address": "yahoo.com"
                        }
                    ],
                    pdfs: [],
                    images: [],
                    video: []
                }, "Disability identity and representation",
            ],

            //sublinks
            [
                {
                    subname: "Resources for students",

                    title: "Library Item 2",
                    description: "Short Description for Library Item 2 (PDF)",
                    content: "Long description text for item 2",
                    weblinks: [],
                    pdfs: [],
                    images: [],
                    video: [
                        {
                            "title": "",
                            "description": "",
                            "source": ""
                        }
                    ]
                }, "Disability accommodations in post-secondary education",
            ],

            [
                {
                    subname: "Resources for faculty and staff",

                    title: "Library Item 3",
                    description: "Short Description for Library Item 3 (Video)",
                    content: "Long description text for item 1",
                    weblinks: [],
                    pdfs: [
                        {
                            "title": "",
                            "description": "",
                            "source": "/documents/pdf/keystosuccess.pdf"
                        }
                    ],
                    images: [],
                    video: []
                }, "Disability accommodations in post-secondary education",
            ]*/


        ]
    );

    $scope.tags = [
        {
            title: "Disclosure and communication",
            heading: "The resources in this section focus on communicating about and disclosing disability. The topics addressed include talking about disability and student’s rights related to disclosing a disability.",

            term: 'Disability identity and representation',
            category: 'disclosure'
        }, {
            term: 'Talking about disability',
            category: 'disclosure'
        }, {
            term: 'Disclosing in the learning environment',
            category: 'disclosure'
        }, {
            term: 'Disclosing in the workplace',
            category: 'disclosure'
        },
        //accom
        {
            title: "Accommodations",
            heading: "This section provides helpful resources about accommodations in general and in the post-secondary environment. While most of the resources are directed at students, we also offer resources for faculty and staff.",
            term: 'Disability accommodations in post-secondary education',
            category: 'accom',

            subcat: true
        }, {
            term: 'Disability accommodations in the workplace',
            category: 'accom'
        },
        //social
        {
            title: "Social media and disability",
            heading: "This section provides tips no how to navigate some of the more common social media platforms and describes how to access the accessible platforms of Facebook and Twitter. These resources also address the common uses of social media and explore how students with disabilities may use it to network with others while attending college or university.",

            term: 'Accessibility of social media',
            category: 'social'
        }, {
            term: 'Social media and disability',
            category: 'social'
        }, {
            term: 'Cyber disclosure and social media',
            category: 'social'
        }, {
            term: 'Online presence and personal branding',
            category: 'social'
        }, {
            term: 'Web content accessibility',
            category: 'social'
        },
        //trans
        {
            title: "Navigating Experiences of PSE",
            heading: "The resources in this section are about other aspects of student experience not addressed in the other areas of our library such as student life, socializing, and transition planning.",

            term: 'Transitioning to post-secondary education',
            category: 'naving'
        }, {
            term: 'Student success',
            category: 'naving'
        }, {
            term: 'Lifestyle and relationships',
            category: 'naving'
        }, {
            term: 'Transitioning to working',
            category: 'naving'
        }];

    let getContentMap = function (term) {
        console.log(term);
        var contentPackage = [];
        content.forEach(function (value, key) {
            if (value === term) {
                contentPackage.push(key);
            }
        });
        return contentPackage;
    }

    function populateContent() {
        $scope.tags.forEach(function (arrayItem) {
            if (arrayItem.subcat) {
                arrayItem.subcat = getContentMap(arrayItem.term);
                console.log(arrayItem.subcat);
            } else {
                arrayItem.content = getContentMap(arrayItem.term);
                console.log(arrayItem.content);
            }

        });
    };

    populateContent();

    $scope.allFilters = [];

    $scope.getSubItems = function (el) {
        var renArr = []
        Object.keys(el).forEach(function (prop) {
            renArr.push(prop)
        });
        return renArr[0].toString();
    }

    $scope.toggleItems = function (item) {
        item.toggle = !item.toggle;
    };

    $scope.toggleSubButton = {item: null};

    $scope.selectItem = function (el) {
        console.log($scope.toggleSubButton);
        $scope.selectedCat = angular.copy(el);
        console.log($scope.selectedCat);
    }
    

    //TODO
    // $scope.tags.forEach(function (item) {
    //     $scope.allFilters.push(item.category);
    //     $scope.allFilters = $scope.allFilters.filter(function (elem, index, self) {
    //         return index == self.indexOf(elem);
    //     })
    //     $scope.filters = $scope.allFilters.slice();
    // }, this);

    $scope.filterTags = function (tag) {
        return !catSort ?
            tag : (tag.category == catSort);
    };

    $scope.openTabs = [{
        tab: false,
        class: ""
    }, {
        tab: false,
        class: ""
    }, {
        tab: false,
        class: ""
    }, {
        tab: false,
        class: ""
    }];
    $scope.origOpenTabs;
    $scope.firstClick = true;
    var lastClicked = null;

    $scope.addFilter = function (el, num) {
        $scope.toggleSubButton = {item: null};
        if (lastClicked != null) {
            lastClicked.class = "";
            //lastClicked.tab = false;
        }
        $scope.filters = el;
        lastClicked = $scope.openTabs[num];
        lastClicked.class = "menu-on";
        //lastClicked.tab = true;

        $scope.selectedCat = {};
    };

    // $scope.addFilter = function (el, num) {
    //     if (!$scope.openTabs[num].tab) {
    //         if (lastClicked != null) {
    //             lastClicked.tab = false;
    //         }

    //         // if ($scope.firstClick) {
    //         //     $scope.origOpenTabs = angular.copy($scope.openTabs);
    //         //     $scope.filters = [];
    //         //     $scope.firstClick = false;
    //         // }
    //         lastClicked = $scope.openTabs[num];
    //         $scope.firstClick = false;
    //         $scope.filters = [el];
    //         $scope.openTabs[num].tab = true;
    //         $scope.openTabs[num].class = "menu-on";
    //         //lastClicked = $scope.openTabs[num];
    //         //force disabling multiselect
    //         // for (let i = 0; i < $scope.openTabs.length; i++) {
    //         //     $scope.openTabs[i].tab = false;
    //         // }
    //         //
    //     } else {
    //         lastClicked.tab = false;
    //         $scope.openTabs[num].tab = false;
    //         $scope.openTabs[num].class = "";
    //         var index = $scope.filters.indexOf(el);
    //         if (index > -1)
    //             $scope.filters.splice(index, 1);
    //     }
    // };

    $scope.resetFilter = function () {
        lastClicked.tab = false;
        $scope.filters = $scope.allFilters.slice();
        $scope.openTabs = $scope.origOpenTabs;
        $scope.firstClick = true;
    }
})
