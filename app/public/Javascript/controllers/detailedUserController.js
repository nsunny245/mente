angular.module('psdnetAppControllers').controller('detailedUserController', function ($scope, $http, $stateParams) {
    $scope.userType = null;
    $scope.userBasicDetails = $stateParams.user;
    $scope.userTypeDetails;

    if ($scope.userBasicDetails.status.includes('mentee')) {
        $scope.userType = 'mentee';
        $scope.userTypeDetails = $scope.userBasicDetails.mentee[0]
    } else if ($scope.userBasicDetails.status.includes('mentor')) {
        $scope.userType = 'mentor';
        $scope.userTypeDetails = $scope.userBasicDetails.mentor[0]
    }
});