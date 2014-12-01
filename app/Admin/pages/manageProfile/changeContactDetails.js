
angular.module('adminWebApp.controllers').controller('ChangeContactDetailsCtrl', ['$scope', '$rootScope', '$routeParams', 'authView',
		'$location', 'tabUtil', 'refreshSession', '$window', 'usersResource',
		function ($scope, $rootScope, $routeParams, authView, $location, tabUtil, refreshSession, $window, usersResource) {

	    $window.document.title = "Change Contact Details | Insider Focus";

        $scope.contact = angular.copy($scope.resolvedData);

			usersResource.getCountries(function (result) {
            $scope.countries = angular.copy(result);
            for (var i in $scope.countries) {
                if($scope.contact.country_id == $scope.countries[i].id){
                    $scope.contact.country_id = $scope.countries[i];
                    break;
                }
            }
        });     
        $scope.error = false;
        $scope.message = "";
        $scope.save = function (contact) {
      
            contact.country_id = (contact.country_id)?contact.country_id.id : 0;
            $scope.contact = angular.copy(contact);
            $scope.loading = true;

            var resCb = function (data) {
                $scope.loading = false;
                $scope.success = true;
                $scope.error = false;
                $scope.message = "Successfully saved";
                refreshSession.refresh();
            }

            var errCb = function (err) {
                $scope.loading = false;
                $scope.success = false;
                $scope.error = true;
                $scope.message = "Save failed";
            }

            if ($scope.contact.id) {
                 usersResource.saveUser($scope.contact, resCb, errCb);
            }else{
                 usersResource.addUser($scope.contact, resCb, errCb);
            }
        }

        $scope.reset = function() {
            $scope.contact = angular.copy($scope.resolvedData);
            for (var i in $scope.countries) {
                if($scope.contact.country_id == $scope.countries[i].id){
                    $scope.contact.country_id = $scope.countries[i];
                    break;
                }
            }
        };

		refreshSession.refresh();
}]);