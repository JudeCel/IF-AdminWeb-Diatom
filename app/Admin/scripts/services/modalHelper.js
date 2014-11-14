
angular.module('adminWebApp.resources')
	.controller('MessageBoxCtrl', function ($scope, $modalInstance, setup) {
		$scope.setup = setup;

		$scope.close = function (result) {
			$modalInstance.dismiss(result);
		};
	})
	.factory('modalHelper', function ($modal, $timeout) {
		function messageBox(setup, complete, error) {
			setup = _.defaults(setup, {
				title: '',
				message: '',
				buttons: [{label: 'OK'}]
			});

			var modal = $modal.open({
				templateUrl: 'pages/modals/messageBox.html',
				controller: 'MessageBoxCtrl',
				resolve: {
					setup: function () {
						return setup;
					}
				}
			});
			if (complete) {
				modal.result.then(complete, error);
			}
			return modal;
		}

		function actionBox($scope, settings) {
			_.defaults(settings, {
				title: 'Confirm',
				action: null,
				message: null,
				messageRunning: 'Please wait',
				buttonOk: 'OK',
				buttonCancel: 'Cancel',
				running: false,
				templateUrl: 'pages/modals/actionBox.html'
			});

			var modal;
			var dlgScope = $scope.$new();
			dlgScope.settings = settings;

			settings.onOk = function () {
				settings.running = true;
				settings.action(function () {
					$timeout(function () {
						modal.close();
					}, 500);
				});
			};

			modal = $modal.open({
				templateUrl: settings.templateUrl,
				scope: dlgScope
			});
		}

		return {
			messageBox: messageBox,
			actionBox: actionBox
		}
	})
