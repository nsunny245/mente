angular.module('psdnetAppControllers').controller('forumSubController', function ($scope, $rootScope, $http, previousLoc, $state, $stateParams, $anchorScroll, $controller, forumPersistenceFactory, subForumPersistenceFactory, initProfileService, paragraph) {

    $scope.badwordList = [];

    $scope.checkGentile = function (sub, msg) {
        
        if (sub && msg) {
            var tempList = paragraph.isGentle(sub);
            tempList = tempList.concat(paragraph.isGentle(msg));
            $scope.badwordList = tempList;
            return $scope.badwordList.length > 0 ? true : false;
        }
    }


    /* FORUM DATA */
    $scope.forums = [];

    $scope.loadedForumParam = $stateParams.forumParent;
    $scope.forumStartParam = $stateParams.forumStart;
    $scope.subPagesMeta;

    console.log("forum start param ", $scope.forumStartParam);
    console.log("loaded forum param ", $scope.loadedForumParam);

    $scope.forumDescriptions = [
        "[CommunAbility.ca forum description]",
        "[Accomodations and Disclosure forum description]",
        "[Career and Working forum description]",
        "[Social media and disability forum description]",
        "[Undergraduate Forums forum description]",
        "[Graduate School Forums forum description]"
    ];
    //so the super categories enclose the subs
    //since there is no proper association on the database, there are reserved values
    //everything on db is an int that is mapped on to its appropriate name here
    //so we have to reserve values that are mapped to the parent
    //every forum id between say, 0 and 10, will be considered "communcability.ca and so forth"
    $scope.forumSubNames = [
        { 'name': 'Forum rules, terms/conditions and support', 'index': 0 },
        { 'name': 'General Discussion', 'index': 1 }, { 'name': 'Accessibility Services', 'index': 2 }, { 'name': 'Disclosing', 'index': 3 }, { 'name': 'Self-advocacy', 'index': 4 }, { 'name': 'Resources and Helpful Information', 'index': 5 },
        { 'name': 'General Discussion', 'index': 6 }, { 'name': 'Career Information', 'index': 7 }, { 'name': 'Experiences and challenges', 'index': 8 },
        { 'name': 'General Discussion', 'index': 9 }, { 'name': 'Accessibility challenges', 'index': 10 }, { 'name': "Assistive innovations, resources and information", 'index': 11 },
        { 'name': "General Discussion", 'index': 12 }, { 'name': "Student Success Supports - College", 'index': 13 }, { 'name': "Student Success Supports - University", 'index': 14 }, { 'name': "Experiences and challenges", 'index': 15 }, { 'name': "Building community", 'index': 16 },
        { 'name': "General Discussion", 'index': 17 }, { 'name': "Issues and Challenges", 'index': 18 }, { 'name': "Student Success Supports", 'index': 19 }, { 'name': "Experiences and challenges", 'index': 20 }, { 'name': "Building community", 'index': 21 }
    ];

    $controller('forumController', { $scope: $scope }); //inherit 

    let forumPersis = forumPersistenceFactory.get();
    console.log($stateParams);


    /* FORUM PERSISTENCE */
    if (forumPersis == undefined || forumPersis.forumParent == undefined) {
        if ($stateParams.forumParent == null || $stateParams.forumParent == undefined) {
            console.log("NO FORUM INFORMATION, STATEPARAMS/PERSIS")
            $state.go('community.forum');
        } else {
            generateForumPersis();
        }
    } else if ($stateParams.forumParent != undefined && $stateParams.forumParent != forumPersis.forumParent) {
        generateForumPersis();
    } else {
        console.log("FORUM PERSISTENCE EXISTS");
        $scope.loadedForumParam = forumPersis.forumParent;
        $scope.forumStartParam = forumPersis.forumStart;

        let subForumPersis = subForumPersistenceFactory.get();
        console.log(subForumPersis);
        if (subForumPersis == undefined) {
            console.log('SUBFORUMPERSIS UNDEFINED');
            generateSubPagesMeta();
        } else {
            console.log('SUBFORUMPERSIS DEFINED');
            $scope.subPagesMeta = subForumPersis;
            setTimeout(function () {
                for (var i = 0; i < $scope.subPagesMeta.length; ++i) {
                    if ($scope.subPagesMeta[i].open) {
                        $('.forum-section-array > li:nth-child(' + parseInt(i + 1) + ') .sub-collapse')
                            .addClass('in');
                    }
                }
            });
        }
    }
    function generateForumPersis() {
        console.log("SETTING FORUM PERSISTENCE");
        $scope.loadedForumParam = $stateParams.forumParent;
        $scope.forumStartParam = $stateParams.forumStartParam;
        forumPersistenceFactory.set($scope.loadedForumParam, $scope.forumStartParam);
        generateSubPagesMeta();
    }
    function generateSubPagesMeta() {
        console.log("SETTING SUBFORUM PERSISTENCE");
        $scope.subPagesMeta = [];
        var len = $scope.forumRanges[$scope.loadedForumParam].end - $scope.forumRanges[$scope.loadedForumParam].start;
        for (var i = 0; i < len; i++) {
            generateSubPagesMetaIndex(i);
        }
        saveSubPagesMeta();
    }
    function generateSubPagesMetaIndex(index) {
        var pageMeta = {
            'currentPage': 0,
            'totalPosts': $scope.subPagesIterator + 1,
            'nextDisabled': true,
            'sortByPopularity': true,
            'open': false
        };
        $scope.subPagesMeta[index] = pageMeta;
    }
    function saveSubPagesMeta() {
        return subForumPersistenceFactory.set($scope.subPagesMeta);
    }

    $scope.subPagesIterator = 10;

    var protoPostsOpenIndex = [];
    for (let i = 0; i < $scope.subPagesIterator; ++i) {
        protoPostsOpenIndex.push(false);
    }
    resetPostsOpen();
    function resetPostsOpen() {
        $scope.postsOpen = [];
        for (let i = 0; i < $scope.subPagesMeta.length; ++i) {
            $scope.postsOpen.push(protoPostsOpenIndex);
        }
    }


    $scope.forumSubNamesFiltered = $scope.forumSubNames.slice($scope.forumRanges[$scope.loadedForumParam].start, $scope.forumRanges[$scope.loadedForumParam].end);


    $scope.$on("$viewContentLoaded", function (e, state) {
        if ($scope.loadedForumParam == null) {
            console.log("loadedForumParam is null");
            $state.go("community.forums");
        }
    });

    // FORUMS LOAD FIRST HERE
    getSuperPosts($scope.loadedForumParam);//load up all related forums
    console.log("the forums are", $scope.forums);


    /* CONTENT LOADING */
    function getSuperPosts(superIndex) {
        var subsetForums = [];////this is a list of multiple types of forums in range

        if (typeof $scope.subPagesMeta == 'undefined') {
            $scope.subPagesMeta = [];
        }
        for (var i = 0; i < $scope.forumRanges[superIndex].end - $scope.forumRanges[superIndex].start; ++i) {

            if (typeof $scope.subPagesMeta[i] == 'undefined') {
                generateSubPagesMetaIndex(i);
            }

            subsetForums.push(getRangeOfPosts(i));
            var subforum = $scope.forumRanges[superIndex].start + i;
            getSubPostCount(subforum);
        }
        $scope.forums = subsetForums;
        //cb();
    }
    function getRangeOfPosts(subforum, callbacks = [], resetPosts = true) {// resetPosts = true, pageMove = false, pageNext = true, openNewPost = false) {
        var forumID = subforum + $scope.forumRanges[$scope.loadedForumParam].start;
        var tempPostRange;
        if ($scope.forums[subforum] != undefined) {
            tempPostRange = $scope.forums[subforum];//this is a list of one type of forum
        } else {
            tempPostRange = [];
        }

        var rangeStart = $scope.subPagesMeta[subforum].currentPage * $scope.subPagesIterator;
        var rangeEnd = rangeStart + $scope.subPagesIterator;
        var sortByPopularity = $scope.subPagesMeta[subforum].sortByPopularity;
        var email;
        !$rootScope.userProfile ? email = null : email = $rootScope.userProfile.email;

        // $scope.callbacks = callbacks;

        $http.post('/forum/getRangeOfPosts', { "userEmail": email, "postIdToLoad": forumID, "rangeStart": rangeStart, "rangeEnd": rangeEnd, "sortByPopularity": sortByPopularity })
            .then(function (response) {
                var responseLen = response.data.length;
                for (var i = 0; i < responseLen; ++i) {
                    if ($rootScope.userProfile) {
                        var voteChecked = CheckVotes(response.data[i]);
                        tempPostRange[i] = voteChecked;
                        markSelf(response.data[i]);
                    } else {
                        tempPostRange[i] = response.data[i];
                    }
                }
                if (responseLen == 0) {
                    moveToLastPage(subforum);
                } else {
                    if (responseLen < tempPostRange.length) {
                        tempPostRange.splice(responseLen, tempPostRange.length - responseLen);
                    }
                    if (resetPosts) {
                        resetPostOpenStates(subforum);
                    }
                    for (let i = 0; i < callbacks.length; ++i) {
                        callbacks[i]();
                    }
                }
                setNextBtnStatus(subforum);
            });
        return tempPostRange;
    }
    // $scope.$on('ngRepeatFinished', function(ngRepeatFinishedEvent) {
    //     for (let i=0; i<$scope.callbacks.length; ++i) {
    //         console.log("POSTREPEATFINISHEDJKFLDSJAKFLDJSAKFL;DJSAKLF;DJSAKL;FJDSAKL;FJDKSAL;FJKDLSA;JFKLDAS;");
    //         $scope.callbacks[i]();
    //     }
    //     $scope.callbacks = [];
    // });
    function getSubPostCount(postID) {
        $http.post('/forum/subPostCount', { "postIdToLoad": postID })
            .then(function (response) {
                //loaded = true;
                var subforum = postID - $scope.forumRanges[$scope.loadedForumParam].start;
                $scope.subPagesMeta[subforum].totalPosts = response.data.val;
                saveSubPagesMeta();

                setNextBtnStatus(subforum);
            });
    }
    function markSelf(post) {
        if ($rootScope.userProfile) {
            let myEmail = $rootScope.userProfile.email;
            //console.log(myEmail);
            //post.forEach((element) => {
            //check if said post is yours, and mark it
            if (post.data.authorEmail == myEmail) {
                console.log(post.data.authorEmail);
                post.data.myPost = true;
            }
            //now check is nested 'replies' object is yours
            if (post.data.replies.length > 0) {
                post.data.replies.forEach((reply) => {
                    console.log("reply", reply);
                    console.log("myem", myEmail);
                    if (reply.userEmail == myEmail) {
                        reply.myReply = true;
                    }
                }, this)
            }
            // }, this);
        }
    }
    //Check if this user has voted on any posts
    //Goes through all the user's votes and checks first if he/she voted for the post then checks the same for all replies.
    //Everytime a vote is found we check if the user has more votes to check, this make sure we dont iterate the entire forum
    //if the user has only 1 vote on his/her account.
    function CheckVotes(post) {
        if (!post) { return; }
        for (var i = 0; i < $rootScope.userProfile.votes.length; ++i) {
            if ($rootScope.userProfile.votes[i].id == post.data._id) {
                post.meta.currentVote = post.meta.lastVote = $rootScope.userProfile.votes[i].value;
            }
            if (post.data.replies.length > 0) {
                for (var k = 0; k < post.data.replies.length; ++k) {
                    if ($rootScope.userProfile.votes[i].id == post.data.replies[k]._id) {
                        post.meta.replies[k].currentVote = post.meta.replies[k].lastVote = $rootScope.userProfile.votes[i].value;
                    }
                }
            }
        }
        return post;
    };
    $rootScope.$on("forumLoginEvent", function(){
       $scope.forumLogin();
    });
    $scope.forumLogin = function() {
        for (let i=0; i<$scope.forums.length; ++i) {
            for (let j=0; j<$scope.forums[i].length; ++j) {
                let postId = $scope.forums[i][j].data._id;
                $http.post('/forum/getPostById', { "postId": postId })
                    .then(function (response) {
                        $scope.forums[i][j] = response.data;
                        let post = $scope.forums[i][j];
                        markSelf(post);
                        CheckVotes(post);
                    });
            }
        }
    }


    /* CONTENT MANIPULATION DATA */
    $scope.userForms = {};
    $scope.submittedPost = false;
    $scope.reportReasons = ['Abusive Language', 'Personal Information', 'Spam', 'Other'];

    $scope.resetNewPostData = function () {
        $('#create-post-form select')
            .prop('selectedIndex', 0);
        $scope.userForms.newPost = {
            postID: '',
            userType: '',
            username: '',
            userEmail: '',
            tags: [],
            forumID: 0,
            date: '',
            subject: '',
            message: '',
            upVotes: 0,
            downVotes: 0,
            replies: []
        };

    }

    $scope.resetNewPostReply = function (subforum, post) {
        if (typeof $scope.userForms.subForms == 'undefined') {
            $scope.userForms.subForms = {};
        }
        if (typeof $scope.userForms.subForms[subforum] == 'undefined') {
            $scope.userForms.subForms[subforum] = {};
        }
        if (typeof $scope.userForms.subForms[subforum][post] == 'undefined') {
            $scope.userForms.subForms[subforum][post] = {};
        }
        $scope.userForms.subForms[subforum][post].newReply = "";
        $scope.userForms.subForms[subforum][post].submittingReply = false;
    }
    $scope.resetNewReport = function (subforum, post, reply = null) {
        $('.forum-section-array > li:nth-child(' + parseInt(subforum + 1) + ') .section-post-array > li:nth-child(' + parseInt(post + 1) + ') .post-main > .post-actions .post-actions-report select')
            .prop('selectedIndex', 0);
        if (typeof $scope.userForms.subForms == 'undefined') {
            $scope.userForms.subForms = {};
        }
        if (typeof $scope.userForms.subForms[subforum] == 'undefined') {
            $scope.userForms.subForms[subforum] = {};
        }
        if (typeof $scope.userForms.subForms[subforum][post] == 'undefined') {
            $scope.userForms.subForms[subforum][post] = {};
        }
        if (reply != null) {
            if (typeof $scope.userForms.subForms[subforum][post][reply] == 'undefined') {
                $scope.userForms.subForms[subforum][post][reply] = {};
            }
            $scope.userForms.subForms[subforum][post][reply].showReport = !$scope.userForms.subForms[subforum][post][reply].showReport;
        } else {
            $scope.userForms.subForms[subforum][post].showReport = !$scope.userForms.subForms[subforum][post].showReport;
        }
        $scope.userForms.subForms[subforum][post].submittingReport = false;
    }
    $scope.resetNewReport = function (subforum, post, reply) {
        $('.forum-section-array > li:nth-child(' + parseInt(subforum + 1) + ') .section-post-array > li:nth-child(' + parseInt(post + 1) + ') .post-replies > li:nth-child(' + parseInt(reply + 1) + ') .post-actions-report select')
            .prop('selectedIndex', 0);
    }

    /* CONTENT MANIPULATION */
    $scope.Post = function (forumID) {
        $scope.posting = true;
        // console.log($scope.forumNames.indexOf(forumName) == -1 ? 0 : $scope.forumNames.indexOf(forumName));
        if (!$rootScope.userProfile) {
            console.log('User not logged in.');
            //todo DIsplay message to user.
            return;
        }
        //Attach profile elements to the post.
        $scope.userForms.newPost.userType = $rootScope.userProfile.status;
        $scope.userForms.newPost.username = $rootScope.userProfile.username;
        $scope.userForms.newPost.userEmail = $rootScope.userProfile.email;
        $scope.userForms.newPost.forumID = forumID;
        var subforum = $scope.userForms.newPost.forumID - $scope.forumRanges[$scope.loadedForumParam].start;
        $scope.userForms.newPost.date = Date.now();

        //Post data taken from the forum's form.
        console.log("WHAT I JUST POSTED", $scope.userForms.newPost);
        $http.post('/forum/newPost', $scope.userForms.newPost)
            .then((response) => {
                initProfileService.loadVars().then(() => {
                    $scope.submittedPost = true;
                    $scope.subPagesMeta[subforum].currentPage = 0;
                    $scope.subPagesMeta[subforum].sortByPopularity = false;
                    $scope.subPagesMeta[subforum].open = true;
                    saveSubPagesMeta();

                    let form = $('#create-post-form');
                    $scope.resetNewPostData();
                    $scope.posting = false;
                    $scope.submittedPost = false;

                    let callbacks = [];
                    let resetPosts;
                    (!$scope.subPagesMeta[subforum].sortByPopularity && $scope.subPagesMeta[subforum].currentPage == 0) ? resetPosts = false : resetPosts = true;
                    let openCallback = function () { openNewPost(subforum) };
                    if (!resetPosts) {
                        let shiftCallback = function () { shiftOpenPosts(null, subforum, 0, true, true) };
                        callbacks.push(shiftCallback);
                    } else {
                        callbacks.push(openCallback);
                    }

                    getRangeOfPosts(subforum, callbacks, resetPosts);

                    form.removeClass('in');
                    $scope.showNewPost = false;
                    setTimeout(function () {
                        scrollToSubforum(subforum);
                    });
                })
            });
    };
    function openNewPost(subforum) {
        let post = $('.forum-section-array > li:nth-child(' + parseInt(subforum + 1) + ') .section-post-array > li:first-child');
        post.find('.post-heading .post-publish')
            .focus();
        post.find('.post-main')
            .addClass('in');
        $scope.postsOpen[subforum][0] = true;
    }
    function scrollToSubforum(index, top = true, oldHeight = 0, deferToSectionTop = false) {
        var subforum = $('.forum-section-array > li[data-sub-index=' + index + ']');
        var yOffset = -$anchorScroll.yOffset();
        var newScroll;
        var offsetTop = subforum.offset().top;
        if (top) {
            newScroll = offsetTop + yOffset;
        } else {
            var noDeferral = true;
            if (deferToSectionTop && $(window).scrollTop() - yOffset <= offsetTop) {
                var noDeferral = false;
            }
            if (noDeferral) {
                var distFromBottom = offsetTop + oldHeight - $(window).scrollTop();
                newScroll = offsetTop + subforum.outerHeight() - distFromBottom;
            }
        }
        if (top || noDeferral) {
            $(window).scrollTop(newScroll);
            subforum.find('.sub-collapse').addClass('in');
        }
    }

    $scope.CastVote = function (selectedPost, meta, up) {

        if (!$rootScope.userProfile) { return; }

        var prevVote = meta.currentVote;
        var isNewVote;
        prevVote != undefined && prevVote != 0 ? isNewVote = false : isNewVote = true;
        var vote;
        if (!isNewVote && (up && prevVote > 0 || !up && prevVote < 0)) {
            vote = 0;
        } else {
            up ? vote = 1 : vote = -1;
        }

        $http.post('/forum/castVote', { "id": selectedPost, "vote": vote, "newVote": isNewVote, "prevVote": prevVote })
            .then(function (response) {
                meta.currentVote = vote;
            });
    };

    $scope.toggleCreatePost = function() {
        let postForm = $('#create-post-form');
        if (! postForm.hasClass('collapsing')) {
            $scope.showNewPost = ! $scope.showNewPost;
        }
    }
    $scope.toggleReply = function (subforum, post) {
        let replyField = $('.forum-section-array > li:nth-child('+ parseInt(subforum + 1) +') .section-post-array > li:nth-child('+ parseInt(post + 1) +') .post-actions-reply');
        if (! replyField.hasClass('collapsing')) {
            if (typeof $scope.userForms.subForms == 'undefined') {
                $scope.userForms.subForms = {};
            }
            if (typeof $scope.userForms.subForms[subforum] == 'undefined') {
                $scope.userForms.subForms[subforum] = {};
            }
            if (typeof $scope.userForms.subForms[subforum][post] == 'undefined') {
                $scope.userForms.subForms[subforum][post] = {};
            }
            $scope.userForms.subForms[subforum][post].showReport = false;
            $scope.userForms.subForms[subforum][post].showReply = !$scope.userForms.subForms[subforum][post].showReply;
        }
    };
    $scope.toggleReport = function (subforum, post, reply = null) {
        let reportField = $('.forum-section-array > li:nth-child('+ parseInt(subforum + 1) +') .section-post-array > li:nth-child('+ parseInt(post + 1) +') .post-actions-report');
        if (! reportField.hasClass('collapsing')) {
            if (typeof $scope.userForms.subForms == 'undefined') {
                $scope.userForms.subForms = {};
            }
            if (typeof $scope.userForms.subForms[subforum] == 'undefined') {
                $scope.userForms.subForms[subforum] = {};
            }
            if (typeof $scope.userForms.subForms[subforum][post] == 'undefined') {
                $scope.userForms.subForms[subforum][post] = {};
            }
            if (reply != null) {
                if (typeof $scope.userForms.subForms[subforum][post][reply] == 'undefined') {
                    $scope.userForms.subForms[subforum][post][reply] = {};
                }
                $scope.userForms.subForms[subforum][post][reply].showReply = false;
                $scope.userForms.subForms[subforum][post][reply].showReport = !$scope.userForms.subForms[subforum][post][reply].showReport;
            } else {
                $scope.userForms.subForms[subforum][post].showReply = false;
                $scope.userForms.subForms[subforum][post].showReport = !$scope.userForms.subForms[subforum][post].showReport;
            }
        }
    };
    $scope.replyToPost = function (topicID, reply, subforum, postIndex) {
        console.log("Replying to post" + topicID + " " + reply);
        if (!$rootScope.userProfile) { return; }
        $scope.userForms.subForms[subforum][postIndex].submittingReply = true;
        $http.post('/forum/reply', { "id": topicID, "message": reply, "date": Date.now() })
            .then(function (response) {
                initProfileService.loadVars().then(() => {
                    let post = $('.forum-section-array > li:nth-child(' + parseInt(subforum + 1) + ') .section-post-array > li:nth-child(' + parseInt(postIndex + 1) + ')');
                    post.find('.post-main > .post-actions .post-actions-reply')
                        .removeClass('in');
                    $scope.userForms.subForms[subforum][postIndex].showReply = false;
                    $scope.forums[subforum][postIndex].meta.isReported = true;
                    if (! $scope.forums[subforum][postIndex].meta.shouldNotify) {
                        $scope.forums[subforum][postIndex].meta.shouldNotify = true;
                        $scope.forums[subforum][postIndex].meta.subbed = true;
                    }
                    let replyIndex = $scope.forums[subforum][postIndex].data.replies.length;
                    let cb = function () { setTimeout(function () { scrollToReply(subforum, postIndex, replyIndex); }); };
                    callbacks = [cb];
                    getRangeOfPosts(subforum, callbacks, false);//load up all related forums
                });
            });
    };
    function scrollToReply(subforum, post, replyIndex) {
        let reply = $('.forum-section-array > li:nth-child(' + parseInt(subforum + 1) + ') .section-post-array > li:nth-child(' + parseInt(post + 1) + ') .post-replies > li:nth-child(' + parseInt(replyIndex + 1) + ')');

        let replyPos = reply.offset().top;
        let replyHeight = reply.outerHeight();
        let windowPos = $(window).scrollTop();
        let windowHeight = $(window).height();

        if (replyPos < windowPos) {
            $(window).scrollTop(replyPos);
        } else if (replyPos + replyHeight > windowPos + windowHeight) {
            $(window).scrollTop(replyPos + replyHeight - windowHeight);
        }
    };

    $scope.ReportPost = function (postId, reason, subforum, postIndex, reply = null) {
        if (!$rootScope.userProfile) { return; }
        if (reply == null) {
            $scope.userForms.subForms[subforum][postIndex].submittingReport = true;
        } else {
            $scope.userForms.subForms[subforum][postIndex][reply].submittingReport = true;
        }
        $http.post('/forum/reportPost', { "id": postId, "reason": reason })
            .then(function (response) {
                console.log(response);
                let post = $('.forum-section-array > li:nth-child(' + parseInt(subforum + 1) + ') .section-post-array > li:nth-child(' + parseInt(postIndex + 1) + ')');
                if (reply == null) {
                    post.find('.post-main > .post-actions .post-actions-report')
                        .removeClass('in');
                    $scope.userForms.subForms[subforum][postIndex].showReport = false;
                    $scope.forums[subforum][postIndex].meta.isReported = true;
                } else {
                    post.find('.post-replies > li:nth-child(' + parseInt(reply + 1) + ') .post-actions-report')
                        .removeClass('in');
                    $scope.userForms.subForms[subforum][postIndex][reply].showReport = false;
                    $scope.forums[subforum][postIndex].meta.replies[reply].isReported = true;
                }
            });
    };

    $scope.deletePostConfirm = true;//TODO, make modal take in params
    //wait for user input, and then trigger subsequent functions

    $scope.deleteForumPost = function (subforum, index, postId, replyId = null) {
        if ($scope.deleteForumPost) {
            $http.post('/forum/delete', { "postId": postId, "replyId": replyId })
                .then(function (response) {
                    console.log("DELETION RESPONSE", response);
                    initProfileService.loadVars().then(function () {
                        let cb = function () { shiftOpenPosts(replyId, subforum, index) };
                        let callbacks = [cb];
                        getRangeOfPosts(subforum, callbacks, false);//load up all related forums
                        $scope.deletePostConfirm = false;
                    });
                },
                function () {
                    console.log("ERROR DELETING");
                });
        }
    }

    $scope.toggleNotifications = function(post) {
        if (!$rootScope.userProfile) {return;}
        var postId = post.data._id;
        $http.post('/forum/toggleNotifications', { "postId": postId })
            .then(function (response) {
                post.meta.subbed = ! post.meta.subbed;
            });
    }


    $scope.AddTag = function (tag) {
        if ($scope.userForms.newPost.tags.indexOf(tag) <= 0 && tag != undefined) {
            $scope.userForms.newPost.tags.push(tag);
        }
        console.log($scope.userForms.newPost.tags);
    };
    $scope.RemoveTag = function (tag) {
        if ($scope.userForms.newPost.tags.indexOf(tag) === -1) {
            //do nothing.
        }
        else {
            $scope.userForms.newPost.tags.splice($scope.userForms.newPost.tags.indexOf(tag), 1);
        }
        console.log($scope.userForms.newPost.tags);
    };


    /* SUBFORUM MANIPULATION */
    $scope.toggleSubForum = function (subforum) {
        //not sure how to maintain synchrony, so simply inverts value independent of actual DOM state
        $scope.subPagesMeta[subforum].open = !$scope.subPagesMeta[subforum].open;
        saveSubPagesMeta();
    }
    $scope.togglePopularitySort = function (subforum, val) {
        $scope.subPagesMeta[subforum].sortByPopularity = val;
        $scope.subPagesMeta[subforum].currentPage = 0;
        saveSubPagesMeta();
        $scope.forums[subforum] = getRangeOfPosts(subforum);
    }
    $scope.togglePost = function (subforum, postIndex) {
        $scope.postsOpen[subforum][postIndex] = !$scope.postsOpen[subforum][postIndex];
    }
    $scope.switchActionOrder = function (subforum, postIndex, openingReply) {
        let post = $('.forum-section-array > li:nth-child(' + parseInt(subforum + 1) + ') .section-post-array > li:nth-child(' + parseInt(postIndex + 1) + ')');
        let idMarker = '#s' + subforum + '-p' + postIndex;
        let reply = post.find(idMarker + '-reply');
        let report = post.find(idMarker + '-report');

        if (openingReply) {
            reply.insertBefore(report);
        } else {
            report.insertBefore(reply);
        }
    }
    function shiftOpenPosts(replyId, subforum, index, insertIndex = false, indexInitVal = false) {
        console.log(replyId, subforum, index);
        if (replyId == null) {
            if (insertIndex) {
                $scope.postsOpen[subforum].splice(index, 0, indexInitVal);
                $scope.postsOpen[subforum].splice($scope.subPagesIterator - 1, 1);
            } else {
                $scope.postsOpen[subforum].splice(index, 1);
                $scope.postsOpen[subforum].push(false);
            }
            setTimeout(function () { //TODO will this work on server's time?
                setPostOpenStates(subforum, index);
            });
        }
    };
    function resetPostOpenStates(subforum) {
        let post = $('.forum-section-array > li:nth-child(' + parseInt(subforum + 1) + ') .section-post-array > li:first-child');
        for (let i = 0; i < $scope.forums[subforum].length; ++i) {
            $scope.postsOpen[subforum][i] = false;
            post.find('.post-main').removeClass('in');
            post = post.next();
        }
    }
    function setPostOpenStates(subforum, index = 0) {
        let post = $('.forum-section-array > li:nth-child(' + parseInt(subforum + 1) + ') .section-post-array > li:nth-child(' + parseInt(index + 1) + ')');
        for (let i = index; i < $scope.forums[subforum].length; ++i) {
            if ($scope.postsOpen[subforum][i]) {
                post.find('.post-main').addClass('in');
            } else {
                post.find('.post-main').removeClass('in');
            }
            post = post.next();
        }
    }

    function setNextBtnStatus(subforum) {
        $scope.subPagesMeta[subforum].nextDisabled = ((($scope.subPagesMeta[subforum].currentPage + 1) * $scope.subPagesIterator) >= $scope.subPagesMeta[subforum].totalPosts);
    }
    $scope.gotoPrevSubPage = function (subforum) {
        if ($scope.subPagesMeta[subforum].currentPage > 0) {
            $scope.subPagesMeta[subforum].currentPage--;
            saveSubPagesMeta();

            resetPostOpenStates(subforum);
            let oldHeight = getSubforumHeight(subforum);
            let cb = function () { pageTurnAutoScroll(subforum, false, oldHeight) };
            let callbacks = [cb];
            $scope.forums[subforum] = getRangeOfPosts(subforum, callbacks, false);
        }
    };
    $scope.gotoNextSubPage = function (subforum) {
        var maxPages = Math.ceil($scope.subPagesMeta[subforum].totalPosts / $scope.subPagesIterator) - 1;
        if ($scope.subPagesMeta[subforum].currentPage < maxPages) {
            $scope.subPagesMeta[subforum].currentPage++;
            saveSubPagesMeta();

            resetPostOpenStates(subforum);
            let oldHeight = getSubforumHeight(subforum);
            let cb = function () { pageTurnAutoScroll(subforum, true, oldHeight) };
            let callbacks = [cb];
            $scope.forums[subforum] = getRangeOfPosts(subforum, callbacks, false);
        }
    };
    function getSubforumHeight(subforum) {
        let height = $('.forum-section-array > li[data-sub-index=' + subforum + ']').outerHeight();
        return height;
    }
    function pageTurnAutoScroll(subforum, forwards, oldHeight) {
        var maxPages = Math.ceil($scope.subPagesMeta[subforum].totalPosts / $scope.subPagesIterator) - 1;
        if (forwards && $scope.subPagesMeta[subforum].currentPage == maxPages || !forwards && $scope.subPagesMeta[subforum].currentPage + 1 == maxPages) {
            setTimeout(function () {
                scrollToSubforum(subforum, false, oldHeight, true);
            });
        }
    }
    function moveToLastPage(subforum) {
        $http.post('/forum/subPostCount', { "postIdToLoad": subforum })
            .then(function (response) {
                $scope.subPagesMeta[subforum].totalPosts = response.data.val;
                setNextBtnStatus(subforum);
                var newLastPage = Math.ceil($scope.subPagesMeta[subforum].totalPosts / $scope.subPagesIterator) - 1;
                if ($scope.subPagesMeta[subforum].currentPage > 0) {
                    $scope.subPagesMeta[subforum].currentPage = newLastPage
                    $scope.forums[subforum] = getRangeOfPosts(subforum);
                    saveSubPagesMeta();
                }
            });
    }
});
