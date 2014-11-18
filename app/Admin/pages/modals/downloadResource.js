angular.module('adminWebApp.modals')
	.controller('DownloadResourceCtrl', ['$scope', '$timeout', function ($scope, $timeout) {

	$scope.modal = {
		content: 0,
		data: {},
		status: ''
	};

	$scope.dropSession = function() {
		$scope.modal.status = 'saving';
		$scope.$emit('downloadResourceConfirmEvent', $scope.modal.data, function() {
			$scope.dismiss();
			$timeout(function() {$scope.modal.status = ''}, 500);
		});
	};

	$scope.$on('downloadResourceEvent', function(event, resource) {
		if(!resource) return;
		$scope.modal.content = 1;
		$scope.modal.data = resource;
		$scope.show();
	});
}]);