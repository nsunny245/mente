angular.module('psdnetAppControllers').controller('forumController', function ($scope, $rootScope, $http, previousLoc, $location, $state, $stateParams) {
  // $scope.firstForumID = 0;//makes sure you know the first ID

  $scope.goToSubForums = function (e) {
    var firstForumID = 0;
    switch (e) {
      case 0:
        firstForumID = $scope.forumRanges[0]
        break;
      case 1:
        firstForumID = $scope.forumRanges[2]
        break;
      case 2:
        firstForumID = $scope.forumRanges[2]
        break;
      case 3:
        firstForumID = $scope.forumRanges[3]
        break;
      case 4:
        firstForumID = $scope.forumRanges[4]
        break;
      case 5:
        firstForumID = $scope.forumRanges[5]
        break;
    }

    $state.go("community.forums.sub", { forumParent: e, forumStart: firstForumID});
  }

  // $scope.generateSubPagesMetaIndex = function(index) {
  //     var pageMeta = {
  //         'currentPage': 0,
  //         'totalPosts': $scope.subPagesIterator + 1,
  //         'sortByPopularity': true
  //     };
  //     $scope.subPagesMeta[index] = pageMeta;
  // }
  // for (var i=0; i<10; i++) {
  //     $scope.generateSubPagesMetaIndex(i);
  // }

  $scope.superCategories = [
    "CommunAbility.ca",
    "Accomodations and Disclosure",
    "Career and Working",
    "Social media and disability",
    "Undergraduate Forums",
    "Graduate School Forums"
  ];
  $scope.forumRanges = [
    { 'start': 0, 'end': 1 },
    { 'start': 1, 'end': 6 },
    { 'start': 6, 'end': 9 },
    { 'start': 9, 'end': 12 },
    { 'start': 12, 'end': 17 },
    { 'start': 17, 'end': 22 }
  ];

  $scope.getForumRangeIndex = function(forumId) {
    for (let i=0; i<$scope.forumRanges.length; ++i) {
      if (forumId < $scope.forumRanges[i].end) {
        console.log(i);
        return i;
      }
    }
  };

  $scope.openRules = function() {
    $('#forum-rules').addClass('in');
  }
});
