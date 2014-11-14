
angular.module('adminWebApp.controllers').controller('ManageResourcesCtrl', ['$scope', '$rootScope', '$routeParams', 'authView',
		'$location', 'tabUtil', 'resolveData', 'refreshSession', '$window',
		function ($scope, $rootScope, $routeParams, authView, $location, tabUtil, resolveData, refreshSession, $window) {

			$window.document.title = "Manage Resources | Insider Focus";

			$scope.resolvedData = resolveData;
			$scope.tabs = authView.getManageResourcesTabs();

			$scope.contentSrc = '';
			$scope.currentTab = $routeParams;

			$scope.$watch('currentTab', function (newValue) {
				var tab = tabUtil.getTab(newValue.tabName, $scope.tabs);
				if (!tab) {
					tab = $scope.tabs[0];
				}
				tabUtil.selectTab(tab, $scope.tabs);
				$scope.contentSrc = tab.contentSrc;
				$rootScope.page = tab;
			});

			refreshSession.refresh();
		}]).factory('tabUtil', [function () {

		function findWhere(arr, byName) {
			return _.find(arr, function(item) {
				return item.name == byName;
			});
		}

		return {
			getTab: function (byName, tabs) {
				var foundTab = _.find(tabs, function(tab) {
					return tab.name == byName || findWhere(tab.subSelection, byName);
				});

				if(!foundTab) return null;
				if(foundTab.name == byName)
					return foundTab;
				return findWhere(foundTab.subSelection, byName);
			},

			selectTab: function (byTab, tabs) {
				var byName = byTab.name;
				_.each(tabs, function(tab) {
					tab.selected = tab.name == byName || !!findWhere(tab.subSelection, byName);
				});
			}
		};
	}]);