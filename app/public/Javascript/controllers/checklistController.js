angular.module('psdnetAppControllers').controller('checklistController', function ($scope, $rootScope, $location, $http) {
    console.log("load checklist");
    $scope.numberComplete = 0;
    $scope.modulesAllComplete = false;
    $scope.checkIfCompleted = function (completed) {
        if (completed) {
            $scope.numberComplete++;
            console.log($scope.numberComplete);
        }
    }

    function readModules() {
        $scope.modulesAllComplete = true;
        $rootScope.userProfile.modules.forEach(function (element) {
            console.log("element", element);
            if (!element.completed) {
                $scope.modulesAllComplete = false;
            }
        }, this);
    }
    readModules();
});
