angular.module('adminWebApp.modals')
	.controller('CopySessionCtrl', ['$scope', '$timeout', function ($scope, $timeout) {

	$scope.modal = {
		content: 0,
		data: {},
		status: ''
	};

	$scope.copySession = function() {
		$scope.modal.status = 'saving';
		$scope.$emit('copySessionConfirmEvent', $scope.modal.data, function() {
			$scope.dismiss();
			$timeout(function() {$scope.modal.status = ''}, 500);
		});
	};

	$scope.$on('copySessionEvent', function(event, session) {
		if(!session) return;
		$scope.modal.content = 1;
		$scope.modal.data = session;
		$scope.show();
	});
}]);