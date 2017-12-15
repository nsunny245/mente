angular.module('psdnetAppControllers').controller('testController', function ($rootScope, $scope, $http, previousLoc, $location, $state, checkBoxes) {
    
    $scope.testListAdmin = function () {
        $http.post('/fooing/sendUserListToAdminTEST', { foo: $rootScope.userProfile }).then(function (res) {
            console.log(res);
        })
    }

});