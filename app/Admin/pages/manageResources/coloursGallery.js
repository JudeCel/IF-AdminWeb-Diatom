
angular.module('adminWebApp.controllers').controller('ColoursGalleryCtrl', ['$scope', '$rootScope', '$routeParams', 'authView',
		'$location', 'tabUtil', 'resolveData', 'refreshSession', '$window',
		function ($scope, $rootScope, $routeParams, authView, $location, tabUtil, refreshSession, $window) {

			refreshSession.refresh();
}]);