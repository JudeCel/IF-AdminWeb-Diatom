angular.module('adminWebApp.modals')
	.controller('DeleteResourceCtrl', ['$scope', '$timeout', function ($scope, $timeout) {

	$scope.modal = {
		content: 0,
		data: {},
		status: ''
	};

	$scope.dropSession = function() {
		$scope.modal.status = 'saving';
		$scope.$emit('deleteResourceConfirmEvent', $scope.modal.data, function() {
			$scope.dismiss();
			$timeout(function() {$scope.modal.status = ''}, 500);
		});
	};

	$scope.$on('deleteResourceEvent', function(event, session) {
		if(!session) return;
		$scope.modal.content = 1;
		$scope.modal.data = session;
		$scope.show();
	});
}]);