
angular.module('adminWebApp.controllers').controller('AddContactCtrl', ['$scope', '$rootScope', '$routeParams', 'authView',
		'$location', 'refreshSession', '$window',
		function ($scope, $rootScope, $routeParams, authView, $location, refreshSession, $window) {

		    $window.document.title = "Add New Contact | Insider Focus";

			$scope.resolvedData = {};
			$scope.resolvedData.contactLists = [{id: 1, name: "Contact List 1"}, {id: 2, name: "Contact List 22"}];

			$scope.allContactLists = _.map($scope.resolvedData.contactLists, function (value) {
				return { id: value.id, text: value.name }
			});

			$scope.$watch('contactLists', function () {
				var selectedContactLists = $scope.contactLists;
			});
}]);