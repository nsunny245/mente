angular.module('psdnetAppControllers').controller('forumPermalinkController', function ($scope, $rootScope, $http, previousLoc, $state, $stateParams, $anchorScroll, $controller, forumPersistenceFactory, subForumPersistenceFactory, initProfileService, paragraph) {

    $scope.badwordList = [];
    $scope.checkGentile = function (sub, msg) {
        
        if (sub && msg) {
            var tempList = paragraph.isGentle(sub);
            tempList = tempList.concat(paragraph.isGentle(msg));
            $scope.badwordList = tempList;
            return $scope.badwordList.length > 0 ? true : false;
        }
    }


    /* POST DATA */
    $scope.parentForum;
    if ($stateParams.postId == null) {
        console.log("postId is null");
        $state.go("community.forums");
    } else {
        console.log("postId",$stateParams.postId);
        $scope.postId = $stateParams.postId;
        getPost();
    }

    function getPost(callbacks = []) {
        $http.post('/forum/getPostById', { "postId": $scope.postId })
            .then(function (response) {
                $scope.post = response.data;
                console.log($scope.post);
                if ($scope.post == undefined) {
                    console.log("post at id is undefined: ",$scope.postId);
                    $state.go("community.forums");
                }
                if ($rootScope.userProfile) {
                    CheckVotes();
                    markSelf();
                }
                for (let i = 0; i < callbacks.length; ++i) {
                    callbacks[i]();
                }

                $scope.parentForum = getForumRangeIndex($scope.post.data.forumID);

                let post = $('.section-post-array > li:first-child');
                setTimeout(function(){//this doesn't quite work
                    post.find('.post-main').addClass('in');
                    post.find('.post-actions a').remove();
                });
            });
    }

    //not sure how forum > sub parentage is defined... so borrowing these things here from forum controller in lieu of forum > permalink
    $scope.forumRanges = [
        { 'start': 0, 'end': 1 },
        { 'start': 1, 'end': 6 },
        { 'start': 6, 'end': 9 },
        { 'start': 9, 'end': 12 },
        { 'start': 12, 'end': 17 },
        { 'start': 17, 'end': 22 }
    ];
    var getForumRangeIndex = function(forumId) {
        for (let i=0; i<$scope.forumRanges.length; ++i) {
            if (forumId < $scope.forumRanges[i].end) {
                console.log(i);
                return i;
            }
        }
    };


    function markSelf() {
        if ($rootScope.userProfile) {
            let myEmail = $rootScope.userProfile.email;
            //console.log(myEmail);
            //post.forEach((element) => {
            //check if said post is yours, and mark it
            if ($scope.post.data.authorEmail == myEmail) {
                console.log($scope.post.data.authorEmail);
                $scope.post.data.myPost = true;
            }
            //now check is nested 'replies' object is yours
            if ($scope.post.data.replies.length > 0) {
                $scope.post.data.replies.forEach((reply) => {
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
    function CheckVotes() {
        if (!$scope.post) { return; }
        for (var i = 0; i < $rootScope.userProfile.votes.length; ++i) {
            if ($rootScope.userProfile.votes[i].id == $scope.post.data._id) {
                $scope.post.meta.currentVote = $scope.post.meta.lastVote = $rootScope.userProfile.votes[i].value;
            }
            if ($scope.post.data.replies.length > 0) {
                for (var k = 0; k < $scope.post.data.replies.length; ++k) {
                    if ($rootScope.userProfile.votes[i].id == $scope.post.data.replies[k]._id) {
                        $scope.post.meta.replies[k].currentVote = $scope.post.meta.replies[k].lastVote = $rootScope.userProfile.votes[i].value;
                    }
                }
            }
        }
    };
    $rootScope.$on("forumLoginEvent", function(){
       $scope.forumLogin();
    });
    $scope.forumLogin = function() {
        $http.post('/forum/getPostById', { "postId": $scope.postId })
            .then(function (response) {
                $scope.post = response.data;
                markSelf();
                CheckVotes();
            });
    }


    /* CONTENT MANIPULATION DATA */
    $scope.userForms = {};
    $scope.submittedPost = false;
    $scope.reportReasons = ['Abusive Language', 'Personal Information', 'Spam', 'Other'];


    $scope.resetNewPostReply = function () {
        if (typeof $scope.userForms.subForms == 'undefined') {
            $scope.userForms.subForms = {};
        }
        if (typeof $scope.userForms.subForms[undefined] == 'undefined') {
            $scope.userForms.subForms[undefined] = {};
        }
        if (typeof $scope.userForms.subForms[undefined][undefined] == 'undefined') {
            $scope.userForms.subForms[undefined][undefined] = {};
        }
        $scope.userForms.subForms[undefined][undefined].newReply = "";
        $scope.userForms.subForms[undefined][undefined].submittingReply = false;
    }
    $scope.resetNewPostReport = function () {
        $('.section-post-array > li:nth-child(1) .post-main > .post-actions .post-actions-report select')
            .prop('selectedIndex', 0);
    }
    $scope.resetNewReplyReport = function (subforum, post, reply) {
        $('.post-replies > li:nth-child(' + parseInt(reply + 1) + ') .post-actions-report select')
            .prop('selectedIndex', 0);
    }


    $scope.CastVote = function (selectedPost, meta, up) {

        if (!$rootScope.userProfile) { return; }

        var prevVote = $scope.post.meta.currentVote;
        var isNewVote;
        prevVote != undefined && prevVote != 0 ? isNewVote = false : isNewVote = true;
        var vote;
        if (!isNewVote && (up && prevVote > 0 || !up && prevVote < 0)) {
            vote = 0;
        } else {
            up ? vote = 1 : vote = -1;
        }

        $http.post('/forum/castVote', { "id": $scope.postId, "vote": vote, "newVote": isNewVote, "prevVote": prevVote })
            .then(function (response) {
                $scope.post.meta.currentVote = vote;
            });
    };

    $scope.toggleReply = function () {
        let replyField = $('.section-post-array > li:first-child .post-actions-reply');
        if (! replyField.hasClass('collapsing')) {
            if (typeof $scope.userForms.subForms == 'undefined') {
                $scope.userForms.subForms = {};
            }
            if (typeof $scope.userForms.subForms[undefined] == 'undefined') {
                $scope.userForms.subForms[undefined] = {};
            }
            if (typeof $scope.userForms.subForms[undefined][undefined] == 'undefined') {
                $scope.userForms.subForms[undefined][undefined] = {};
            }
            $scope.userForms.subForms[undefined][undefined].showReport = false;
            $scope.userForms.subForms[undefined][undefined].showReply = !$scope.userForms.subForms[undefined][undefined].showReply;
        }
    };
    $scope.toggleReport = function (subforum, post, reply = null) {
        let reportField = $('.section-post-array > li:first-child .post-actions-report');
        if (! reportField.hasClass('collapsing')) {
            if (typeof $scope.userForms.subForms == 'undefined') {
                $scope.userForms.subForms = {};
            }
            if (typeof $scope.userForms.subForms[undefined] == 'undefined') {
                $scope.userForms.subForms[undefined] = {};
            }
            if (typeof $scope.userForms.subForms[undefined][undefined] == 'undefined') {
                $scope.userForms.subForms[undefined][undefined] = {};
            }
            if (reply != null) {
                if (typeof $scope.userForms.subForms[undefined][undefined][reply] == 'undefined') {
                    $scope.userForms.subForms[undefined][undefined][reply] = {};
                }
                $scope.userForms.subForms[undefined][undefined][reply].showReply = false;
                $scope.userForms.subForms[undefined][undefined][reply].showReport = !$scope.userForms.subForms[undefined][undefined][reply].showReport;
            } else {
                $scope.userForms.subForms[undefined][undefined].showReply = false;
                $scope.userForms.subForms[undefined][undefined].showReport = !$scope.userForms.subForms[undefined][undefined].showReport;
            }
        }
    };
    $scope.replyToPost = function (topicID, reply, subforum, postIndex) {
        console.log("Replying to post " + reply);
        if (!$rootScope.userProfile) { return; }
        $scope.userForms.subForms[undefined][undefined].submittingReply = true;
        $http.post('/forum/reply', { "id": $scope.postId, "message": reply, "date": Date.now() })
            .then(function (response) {
                initProfileService.loadVars().then(() => {
                    let post = $('.section-post-array > li:first-child');
                    post.find('.post-main > .post-actions .post-actions-reply')
                        .removeClass('in');
                    $scope.userForms.subForms[undefined][undefined].showReply = false;
                    $scope.post.meta.isReported = true;
                    if (! $scope.post.meta.shouldNotify) {
                        $scope.post.meta.shouldNotify = true;
                        $scope.post.meta.subbed = true;
                    }
                    let replyIndex = $scope.post.data.replies.length;
                    let cb = function () { setTimeout(function () { scrollToReply(replyIndex); }); };
                    callbacks = [cb];
                    getPost(callbacks);//load up all related forums
                });
            });
    };
    function scrollToReply(replyIndex) {
        let reply = $('.section-post-array > li:first-child .post-replies > li:nth-child(' + parseInt(replyIndex + 1) + ')');

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
            $scope.userForms.subForms[undefined][undefined].submittingReport = true;
        } else {
            $scope.userForms.subForms[undefined][undefined][reply].submittingReport = true;
        }
        $http.post('/forum/reportPost', { "id": postId, "reason": reason })
            .then(function (response) {
                console.log(response);
                let post = $('.forum-section-array > li:nth-child(' + parseInt(subforum + 1) + ') .section-post-array > li:nth-child(' + parseInt(postIndex + 1) + ')');
                if (reply == null) {
                    post.find('.post-main > .post-actions .post-actions-report')
                        .removeClass('in');
                    $scope.userForms.subForms[undefined][undefined].showReport = false;
                    $scope.forums[subforum][postIndex].meta.isReported = true;
                } else {
                    post.find('.post-replies > li:nth-child(' + parseInt(reply + 1) + ') .post-actions-report')
                        .removeClass('in');
                    $scope.userForms.subForms[undefined][undefined][reply].showReport = false;
                    $scope.forums[subforum][postIndex].meta.replies[reply].isReported = true;
                }
            });
    };

    $scope.toggleNotifications = function(post) {
        if (!$rootScope.userProfile) {return;}
        var postId = post.data._id;
        $http.post('/forum/toggleNotifications', { "postId": postId })
            .then(function (response) {
                post.meta.subbed = ! post.meta.subbed;
            });
    }

    $scope.deletePostConfirm = true;//TODO, make modal take in params
    //wait for user input, and then trigger subsequent functions

    $scope.deleteForumPost = function (subforum, index, postId, replyId = null) {
        if ($scope.deleteForumPost) {
            $http.post('/forum/delete', { "postId": $scope.postId, "replyId": replyId })
                .then(function (response) {
                    console.log("DELETION RESPONSE", response);
                    initProfileService.loadVars().then(function () {
                        getPost();
                        $scope.deletePostConfirm = false;
                    });
                },
                function () {
                    console.log("ERROR DELETING");
                });
        }
    }
});
