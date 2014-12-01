angular.module('ngDragDrop', []);
angular.module('adminWebApp.consts', []).value('adminWebApp.consts', {});
angular.module('adminWebApp.resources', ['ngResource']);
angular.module('adminWebApp.services', ['ngResource']);
angular.module('adminWebApp.directives', ['adminWebApp.consts']);
angular.module('adminWebApp.modals', []);
angular.module('adminWebApp.popovers', ['adminWebApp.resources']);
angular.module('adminWebApp.main', ['adminWebApp.services']);
angular.module('adminWebApp.controllers', ['adminWebApp.resources', 'adminWebApp.services']);
angular.module('adminWebApp', ['ngCookies']);

angular.module('adminWebApp', [
	'ngRoute',
	'ngCookies',
	'$strap',
	'ui',
	'ui.bootstrap',
	'ngDragDrop',
	'adminWebApp.consts',
	'adminWebApp.resources',
	'adminWebApp.services',
	'adminWebApp.directives',
	'adminWebApp.modals',
	'adminWebApp.popovers',
	'adminWebApp.controllers',
	'adminWebApp.main']);

//angular.module('adminWebApp').config(['$routeProvider', '$locationProvider', '$httpProvider', 'mtypes', function ($routeProvider, $locationProvider, $httpProvider, mtypes) {
angular.module('adminWebApp').config(['$routeProvider', '$locationProvider', '$httpProvider', function ($routeProvider, $locationProvider, $httpProvider) {
	//$httpProvider.defaults.headers.common['x-if-sess'] = ifConfig.sessionId;
	//$httpProvider.defaults.headers['delete'] = {'Content-Type': 'application/json'};

	function newResolver(name) {
		var ret = function (fn) {
			return fn();
		};
		ret.$inject = [name];
		return ret;
	}

	var manageProfileCtrlResolver = newResolver('ManageProfileCtrlResolver');
	var manageResourcesCtrlResolver = newResolver('ManageResourcesCtrlResolver');
	var manageSessionsCtrlResolver = newResolver('ManageSessionsCtrlResolver');
	var sessionBuilderCtrlResolver = newResolver('SessionBuilderCtrlResolver');

	// check to see if user is logged in
	//if (!ifConfig.sessionId) return;

//	function hasFeature(feature) {
//		return ~ifConfig.features.indexOf(feature) || ~ifConfig.trialFeatures.indexOf(feature);
//	}

	$routeProvider
		//Login and SignUp
		.when('/Login', {templateUrl: 'pages/login/login.html', controller: 'LoginCtrl', pageName: 'login'})
		.when('/Logout', {template: "", controller: 'LogoutCtrl'})
		.when('/SignUp', {templateUrl: 'pages/signUp/signUp.html', controller: 'SignUpCtrl', pageName: 'SignUp'})

		// First Tab
		.when('/ManageProfile', {templateUrl: 'pages/manageProfile/manageProfile.html', controller: 'ManageProfileCtrl', pageName: 'manageProfile', resolve: {resolveData: manageProfileCtrlResolver}})
		.when('/ManageProfile/:tabName', {templateUrl: 'pages/manageProfile/manageProfile.html', controller: 'ManageProfileCtrl', reloadOnSearch: false, pageName: 'manageProfile', resolve: {resolveData: manageProfileCtrlResolver}})

		// Second Tab
		.when('/ManageSessions', {templateUrl: 'pages/manageSessions/manageSessions.html', controller: 'ManageSessionsCtrl', pageName: 'manageSessions', resolve: {resolveData: manageSessionsCtrlResolver}})
		.when('/SessionBuilder/:sessionId', {templateUrl: 'pages/manageSessions/sessionBuilder.html', controller: 'SessionBuilderCtrl', pageName: 'sessionBuilder', resolve: {resolveData: sessionBuilderCtrlResolver}})
		.when('/SessionBuilder/:sessionId/:tabName', {templateUrl: 'pages/manageSessions/sessionBuilder.html', controller: 'SessionBuilderCtrl', pageName: 'sessionBuilder', resolve: {resolveData: sessionBuilderCtrlResolver}})

		// Third Tab
		.when('/ManageResources', {templateUrl: 'pages/manageResources/manageResources.html', controller: 'ManageResourcesCtrl', pageName: 'manageResources', resolve: {resolveData: manageResourcesCtrlResolver}})
		.when('/ManageResources/addContact', {templateUrl: 'pages/manageResources/addContact.html', controller: 'AddContactCtrl', pageName: 'addContact', resolve: {resolveData: manageResourcesCtrlResolver}})
		.when('/ManageResources/:tabName', {templateUrl: 'pages/manageResources/manageResources.html', controller: 'ManageResourcesCtrl', reloadOnSearch: false, pageName: 'manageResources', resolve: {resolveData: manageResourcesCtrlResolver}})
}])
	.run(['$rootScope', 'refreshSession', 'Auth', 'accountFeatures', '$window', '$cookies', '$http', 'urlHelper', '$cookieStore', function ($rootScope, refreshSession, Auth, accountFeatures, $window, $cookies, $http, urlHelper, $cookieStore) {
		var sessId = urlHelper.getUrlVars()["sessId"];
		var sessCookie = $cookies.sess0;

		if (sessId)
			setCookie(sessId);
		else if (sessCookie)
			setCookie(sessCookie);

		function setCookie(value) {
			$cookies.sess0 = value;

			$rootScope.sessId = value;
			ifConfig.sessId = value;

			$http.defaults.headers.common['x-if-sess'] = value;
		}

//		if (!ifConfig || ifConfig.sessionId <= 0) {
//			var sessId = urlHelper.getUrlVars()["sessionID"];
//			if (sessId && !$window.document.cookie) {
//				$window.location = '/Default.aspx?sessionID=' + sessId;
//			} else {
//				$window.location = 'http://localhost:6500/register';
//			}
//
//			return;
//		}

	refreshSession.refresh({
		ignoreInactiveAccount: true
	});
}]);

window.loadScriptAsync = function (src) {
	(function () {
		var scrpt = document.createElement('script');
		scrpt.type = 'text/javascript';
		scrpt.async = true;
		scrpt.src = ('https:' == document.location.protocol ? 'https://' : 'http://') + src;
		var s = document.getElementsByTagName('script')[0];
		s.parentNode.insertBefore(scrpt, s);
	})();
};