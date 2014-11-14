angular.module('adminWebApp.controllers').controller('HomeCtrl',
	function ($scope, $rootScope, $window, $filter, Auth, homePreferencesService, resolveData, mtypes, homeResource,
	          $location, homeSearchService, accountFeatures, authView, sortHelper) {

		$window.document.title = "Home | Insider Focus Dashboard";
});
