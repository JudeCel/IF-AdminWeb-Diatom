angular.module('adminWebApp.modals')
	.controller('DeleteUserCtrl', ['$scope', '$timeout', function ($scope, $timeout) {

	$scope.modal = {
		content: 0,
		data: {},
		status: ''
	};

	$scope.dropUser = function() {
		$scope.modal.status = 'saving';
		$scope.$emit('deleteUserConfirmEvent', $scope.modal.data, function() {
			$scope.dismiss();
			$timeout(function() {$scope.modal.status = ''}, 500);
		});
	};

	$scope.$on('deleteUserEvent', function(event, user) {
		if(!user) return;
		$scope.modal.content = 1;
		$scope.modal.data = user;
		$scope.show();
	});
}]);