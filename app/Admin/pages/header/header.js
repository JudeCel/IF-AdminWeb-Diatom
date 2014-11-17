angular.module('adminWebApp.controllers').controller('HeaderCtrl',
	function($scope, $rootScope, authView, $window, $route, $routeParams, $location, $modal, gridFormatters, mtypes, Auth, navigationHelper) {
		$scope.tabs = authView.getHeaderTabs();
	}
);
