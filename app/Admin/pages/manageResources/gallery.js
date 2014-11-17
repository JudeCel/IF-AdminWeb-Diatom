
angular.module('adminWebApp.controllers').controller('GalleryCtrl', ['$scope', '$rootScope', '$routeParams', 'authView',
	'$location', 'tabUtil', 'refreshSession', '$window', 'gridFormatters', 'galleryResource',
	function ($scope, $rootScope, $routeParams, authView, $location, tabUtil, refreshSession, $window, gridFormatters, galleryResource) {

		function getGridColumns() {
			return [
				{id: "name", name: "Name", field: "name", width: 330, cssClass: "cell-title", headerCssClass: "header-column-first", formatter: gridFormatters.traineeNameFormatter, sortable: true}
			];
		}

		var gridCommands = $scope.gridCommands = {};

		var coursesCount = 3;

		$scope.gridInfo = {
			options: {editable: false,
				enableCellNavigation: false,
				asyncEditorLoading: false,
				enableColumnReorder: false,
				forceFitColumns: true,
				forceSyncScrolling: true,
				multiColumnSort: true
			},
			columns: getGridColumns(),
//				onRowsChanged: onRowsChanged,
//				onRowCountChanged: onRowCountChanged,
//				onSelectedRowsChanged: onSelectedRowsChanged,
			includeSelectCheckbox: false,
			onClick: onRowClick,
//			rowMetadataProvider: rowMetadataProvider,
//				filterFn: filterer,
//				checkboxSelectionFormatter: checkboxSelectionFormatter,
			data: []
		};

		$scope.gridData = $scope.resolvedData;

		function onRowClick(item, targetClasses, target) {
			// why is this here?
			if (item.metaType) return;

//				if (targetClasses.indexOf('action-edit') !== -1) {
//					return doEdit(item);
//				}
//
//				if (targetClasses.indexOf('action-delete') !== -1) {
//					return showDropConfirmation(item);
//				}
		}

//			refreshSession.refresh();
	}]);