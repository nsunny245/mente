angular.module('psdnetAppControllers').controller('podcastController', function ($http, $scope, $sce, youtubeService) {


    var youtubeUrlBase = "https://www.youtube.com/watch?v=";
    $scope.generateYoutubeUrl = function(videoId) {
        const url = youtubeUrlBase + videoId;
        let trustedResource = $sce.trustAsResourceUrl(url);
        return trustedResource;
    };
    
    console.log(youtubeService);

    $scope.getChannelPlaylists = function (channelId) {
        //get playlists
        youtubeService.getPlaylists(channelId)
            .then(function (response) {
                $scope.$apply(function () {
                    angular.forEach(response.items, function (item) {
                        //if (item.snippet.title !== "Deleted video") {
                            item.active = false;
                            item.videos = [];
                            $scope.channelPlaylists.push(item);
                        //}
                    });
                    $scope.allPlaylists = true;
                    console.log($scope.channelPlaylists);

                    //loop through playlists
                    var allPromises = [];
                    for (let i=0; i<$scope.channelPlaylists.length; ++i) {
                        //TODO limit api calls

                        //call getPlaylistVideos with id + index

                        //let promise = new Promise(function(resolve, reject){});
                        
                        let promise = $scope.getPlaylistVideos($scope.channelPlaylists[i].id, i);
                        allPromises.push(promise);//$scope.getPlaylistVideos($scope.channelPlaylists[i].id, i));
                    }
                    console.log(allPromises);
                    //all playlist information gathered
                    Promise.all(allPromises).then(function() {
                        console.log("channelPlaylists",$scope.channelPlaylists);
                        if ($scope.channelPlaylists > 2) {
                            updateDisplayed();
                        }
                        setTimeout(function(){
                            $scope.$apply();
                        });
                    });
                    console.log(allPromises);
                });
            });
    };
    $scope.getPlaylistVideos = function (playlistId, index) {
        return youtubeService.getPlaylistVideos(playlistId, $scope.nextPageToken)
            .then(function (response) {
                $scope.$apply(function () {
                    $scope.channelPlaylists[index].videos = [];
                    angular.forEach(response.items, function (item) {
                        if (item.snippet.title !== "Deleted video") {
                            $scope.channelPlaylists[index].videos.push(item);
                        }
                    });

                    if (response.nextPageToken != '') {
                        $scope.nextPageToken = response.nextPageToken;
                        // call the get playlist function again
                        $scope.getPlaylistVideos(playlistId, index);
                    } else {
                        console.log($scope.channelPlaylists[index].snippet.title,$scope.channelPlaylists[index].videos);
                    }

                });
            });
    };
    $scope.getVideos = function (keyword) {
        youtubeService.getVideos(keyword).then(function (response) {
            $scope.$apply(function () {
                $scope.videos = response.items;
            });
        });
    };
    $scope.getChannelLivestream = function(channelId) {
        youtubeService.getChannelLivestream(channelId).then(function (response) {
            console.log("hello?");
            console.log(response);
            $scope.$apply(function () {
                angular.forEach(response.items, function (item) {
                    $scope.liveFeed.push(item);
                });
            })
        });
    }


    $scope.liveFeed = [];
    $scope.channelPlaylists = [];
    $scope.media = [];
    

    let channelId = "UCZbzwgXZa4bJIK4bSvi2ZRA";
    let testChannelId = "UC4aUJ2FQzTGyzlAmmQ5Y4OA";
    let liveTestChannel = "UCZXZQxS3d6NpR-eH_gdDwYA";

    $scope.getChannelLivestream(channelId);
    $scope.getChannelPlaylists(channelId);

    $scope.selectPlaylist = function(param) {
        if (typeof param === 'boolean') {
            if (param) {
                if ($scope.allPlaylists) {
                    setNoneFromAll();
                } else {
                    if ($scope.noPlaylists) {
                        setAllInactive();
                    }
                    $scope.allPlaylists = true;
                    $scope.noPlaylists = false;
                }
            } else {
                if ($scope.noPlaylists) {
                    setAllFromNone();
                } else {
                    if ($scope.allPlaylists) {
                        setAllActive();
                    }
                    $scope.noPlaylists = true;
                    $scope.allPlaylists = false;
                }
            }
        } else {
            if ($scope.allPlaylists) {
                setAllActive();
                $scope.allPlaylists = false;
                $scope.channelPlaylists[param].active = false;
            }
            else if ($scope.noPlaylists) {
                setAllInactive();
                $scope.noPlaylists = false;
                $scope.channelPlaylists[param].active = true;
            }
            else {
                if ($scope.channelPlaylists[param].active) {
                    $scope.channelPlaylists[param].active = false;
                    setNoneFromAll();
                } else {
                    $scope.channelPlaylists[param].active = true;
                    setAllFromNone();
                }
            }
        }
        updateDisplayed();
    };
    function setAllFromNone() {
        let inactivity = checkInactiveOne();
        if (inactivity) {
            $scope.allPlaylists = false;
        } else {
            $scope.allPlaylists = true;
            setAllInactive();
        }
        $scope.noPlaylists = false;
    }
    function setNoneFromAll() {
        let activity = checkActiveOne();
        $scope.allPlaylists = false;
        if (activity) {
            $scope.noPlaylists = false;
        } else {
            $scope.noPlaylists = true;
            setAllActive();
        }
    }
    function checkActiveOne() {
        for (let i=0; i<$scope.channelPlaylists.length; ++i) {
            if ($scope.channelPlaylists[i].active) {
                return true;
            }
        }
        return false;
    }
    function checkInactiveOne() {
        for (let i=0; i<$scope.channelPlaylists.length; ++i) {
            if (! $scope.channelPlaylists[i].active) {
                return true;
            }
        }
        return false;
    }
    function setAllActive() {
        for (let i=0; i<$scope.channelPlaylists.length; ++i) {
            $scope.channelPlaylists[i].active = true;
        }
    }
    function setAllInactive() {
        for (let i=0; i<$scope.channelPlaylists.length; ++i) {
            $scope.channelPlaylists[i].active = false;
        }
    }
    function updateDisplayed() {
        var temp = [];

        if ($scope.allPlaylists || ! $scope.noPlaylists) {
            if ($scope.allPlaylists) {
                for (let i=0; i<$scope.channelPlaylists.length; ++i) {
                    angular.forEach($scope.channelPlaylists[i].videos, function (video) {
                        temp.push(video);
                    });
                }
            } else {
                for (let i=0; i<$scope.channelPlaylists.length; ++i) {
                    if ($scope.channelPlaylists[i].active) {
                        angular.forEach($scope.channelPlaylists[i].videos, function (video) {
                            temp.push(video);
                        });
                    }
                }
            }
            temp.sort(function(a,b){ return dateSort(a,b); });
        }
        console.log(temp);

        $scope.media = temp;
    }
    function dateSort(a,b) {
        var aTime = new Date(a.snippet.publishedAt);
        aTime = aTime.getTime();

        var bTime = new Date(b.snippet.publishedAt);
        bTime = bTime.getTime();

        return bTime - aTime;
    }

    //get webinars too
    //either:
    //  store in same array and order by date
    //  in ng-repeat, differentiate between podcasts/webinars
    //or:
    //  have two columns, like mentorshipTab documents/modules

});











