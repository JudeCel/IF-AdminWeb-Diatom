angular.module('adminWebApp.modals')
	.controller('UnsavedChangesCtrl', function ($scope) {
		var events = {
			leave: 'unsavedChangesLeave',
			cancel: 'unsavedChangesCancel'
		};

		$scope.leave = function() {
			$scope.$emit(events.leave);
		};
		$scope.cancel = function() {
			$scope.$emit(events.cancel);
		};

		$scope.$on('showUnsavedChanges', function (event, options) {
			options = options || {};

			$scope.title = options.title || 'Unsaved Changes';
			$scope.text = options.text || 'By leaving this page, your changes will be lost. Are you sure you want to continue?';
			$scope.leaveButtonTitle = options.leaveButtonTitle || 'Yes';
			$scope.cancelButtonTitle = options.cancelButtonTitle || 'No';
			events.leave = options.leaveEventName || events.leave;
			events.cancel = options.cancelEventName || events.cancel;

			angular.element('#unsaved-changes').modal('show');
		});
	});
