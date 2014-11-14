

angular.module('adminWebApp.main').controller('MainCtrl', function ($scope, $rootScope, $location, $timeout, $window, refreshSession, navigationHelper) {
	$scope.page = {};
	$rootScope.newLocation = {};
	$rootScope.ifConfig = ifConfig;
	$scope.loading = false;

	var needPlaceHolderSupport = BrowserDetect.browser == 'Explorer' && BrowserDetect.version < 10;
	var placeHolderTimeout = 0;

	var idleTimeout = 0;

	$rootScope.$on("$locationChangeStart", function(event, newUrl, oldUrl){
	});

	$rootScope.$on("$showLoadingSpinner", function (event, loading) {
		$scope.loading = loading;
	});

	$rootScope.$on("$routeChangeStart", function (event, next, previous) {
		resetIdleTimer();
		clearTimeout(placeHolderTimeout);

		//$scope.loading = true;
		$scope.loading = false;
		$scope.active = "progress-striped active progress-warning";
	});


	$rootScope.$on("$routeChangeSuccess", function (event, next, previous) {
		$scope.page.header = next.header === undefined ? '/Admin/pages/header/header.html' : next.header;  //Compare to undefined explicitly to preserve false
		$scope.page.footer = next.footer === undefined ? '/Admin/pages/footer/footer.html' : next.footer;  //Compare to undefined explicitly to preserve false

		$('body').css('background-color', next.pageColor || '#fff');      //Is there a cleaner way to set the background for different routes?

		initPlaceholders();

		$('#appWrapper').toggleClass('removedFromLayout', !!next.flex);

		$rootScope.newLocation.path = $location.path();
		$rootScope.newLocation.search = $location.search();

		$scope.loading = false;
		$scope.active = "progress-success";

	});

	$rootScope.$on("$routeChangeError", function (event, current, previous, rejection) {
		$scope.loading = false;

		if(rejection && rejection.redirectUrl) {
			// replace for history
			$location.url(rejection.redirectUrl).replace();
			return;
		}

		// if we don't have a rejection let the controller handle it
		// lets just make sure to stay where we are
		if (rejection === false) {
			$rootScope.newLocation.next = {};
			$rootScope.newLocation.next.path = $location.path();
			$rootScope.newLocation.next.search = $location.search();
			$location.path($rootScope.newLocation.path).search($rootScope.newLocation.search);
			return;
		}

		$scope.active = "";

		$window.location.href = '/500.html';
	});

	$rootScope.$on("initPlaceholders", initPlaceholders);

	function initPlaceholders() {
		// only need placeholder support for IE8 and IE9
		if (needPlaceHolderSupport) {
			placeHolderTimeout = setTimeout(function () {
				// ignore input that are select2 because placeholder is built in
				$('input[placeholder]:not([ui-select2])').placeholder();
				$('textarea[placeholder]').placeholder();
			}, 500);
		}
	}


	if ($window.addEventListener) {  // all browsers except IE before version 9
		//$window.addEventListener("beforeunload", onBeforeUnloadHandler, false);
	}
	else {
		if ($window.attachEvent) {   // IE before version 9
		//	$window.attachEvent("onbeforeunload", onBeforeUnloadHandler);
		}
	}

	// the OnBeforeUnLoad method will only be called in Google Chrome and Safari
	function onBeforeUnloadHandler(event) {
		var flexResult = $window.MF.flexOnBeforeUnload();
		if (flexResult) {
			if (event)
				event.returnValue = message;
			return flexResult;
		}
		var customWarnings = [];
		var e = $rootScope.$broadcast("appOnBeforeUnload", customWarnings);
		if (e.defaultPrevented) {
			var message = customWarnings.length > 0 ? customWarnings[0] : "Refreshing or leaving this page will cause you to lose any unsaved data.";
			if (event)
				event.returnValue = message;
			return message;
		}
	}

	function resetIdleTimer() {
		if(ifConfig && ifConfig.sessionInactivityExpirationMinutes) {
			$timeout.cancel(idleTimeout);
			idleTimeout = $timeout(function () {
				window.location = 'http://' + window.location.host + '/logout.aspx?userId=' + ifConfig.userId +
					'&redirectUrl=' + encodeURIComponent(window.location.pathname + window.location.hash);
			}, ifConfig.sessionInactivityExpirationMinutes * 60000);
		} else {
			// If we don't have ifConfig loaded yet then wait until we do.
			$timeout(resetIdleTimer, 500);
		}
	}


	//flexAngularProxy.setup();
});
