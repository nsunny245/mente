angular.module('psdnetAppControllers').controller('contactController', function ($scope, $http, $state) {
    $scope.subject = ["Question", "Concern", "Praise"];

    $scope.sendFeedback = function () {
        console.log($scope.feedback);
        $http.post('/sendFeedback', { subject: $scope.subjectSel, feedback: $scope.feedback, email: $scope.email }).then(function (res) {
            if (res) {
                console.log("success");
                $state.reload();
            } else {
                console.log("there was an error");
            }
        })
    }
}
);