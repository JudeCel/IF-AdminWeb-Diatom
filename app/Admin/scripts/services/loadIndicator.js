
angular.module('adminWebApp.services').service('loadIndicator', ['$rootScope', '$timeout', function($rootScope, $timeout) {

	var self = this,
			promise;

	self.show = function(delay) {
		if(promise)
			return;

		promise = $timeout(function() {
			$rootScope.$broadcast('loadIndicator', true);
			promise = null;
		}, delay || 500);
	};

	self.hide = function() {
		if(promise)
			$timeout.cancel(promise);

		$rootScope.$broadcast('loadIndicator', false);
	};
}]);
