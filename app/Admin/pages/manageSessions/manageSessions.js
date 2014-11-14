
angular.module('adminWebApp.controllers').controller('ManageSessionsCtrl', ['$scope', '$rootScope', '$routeParams', 'authView',
		'$location', 'tabUtil', 'resolveData', 'refreshSession', '$window', 'gridFormatters',
		function ($scope, $rootScope, $routeParams, authView, $location, tabUtil, resolveData, refreshSession, $window, gridFormatters) {

			$window.document.title = "Manage Sessions | Insider Focus";

			$scope.resolvedData = resolveData;


			function getGridColumns() {
				return [
					{id: "name", name: "Name", field: "name", width: 330, cssClass: "cell-title", headerCssClass: "header-column-first", formatter: gridFormatters.traineeNameFormatter, sortable: true},
					{id: "facilitator", name: "Facilitator", field: "facilitator", width: 330, headerCssClass: "header-column", formatter: gridFormatters.traineeNameFormatter, sortable: true},
					{id: "startDate", name: "Start Date", field: "startDate", minWidth: 180, maxWidth: 180, headerCssClass: "header-column", formatter: gridFormatters.traineeNameFormatter, sortable: true},
					{id: "endtDate", name: "End Date", field: "endDate", minWidth: 180, maxWidth: 180, headerCssClass: "header-column", formatter: gridFormatters.traineeNameFormatter, sortable: true},
					{id: "status", name: "Status", field: "status", minWidth: 180, maxWidth: 180, headerCssClass: "header-column", formatter: gridFormatters.traineeNameFormatter, sortable: true}
				];
			}

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
				onRowsChanged: onRowsChanged,
				onRowCountChanged: onRowCountChanged,
				onSelectedRowsChanged: onSelectedRowsChanged,
				includeSelectCheckbox: true,
				onClick: onRowClick,
				rowMetadataProvider: rowMetadataProvider,
				filterFn: filterer,
				checkboxSelectionFormatter: checkboxSelectionFormatter,
				data: []
			};

			$scope.gridData = [
				{
					id: 100,
					name: "Session 1",
					facilitator: "John Waters",
					startDate: "1/1/2015",
					endDate: "1/15/2015",
					status: "Open"
				},
				{
					id: 101,
					name: "Session 2",
					facilitator: "John White",
					startDate: "1/1/2015",
					endDate: "1/15/2015",
					status: "Completed"
				},
				{
					id: 102,
					name: "Session 3",
					facilitator: "Steve Waters",
					startDate: "1/1/2015",
					endDate: "1/15/2015",
					status: "Open"
				}
			]

			function onRowClick(item, targetClasses, target) {
				// TBD
			}

			function onRowsChanged(args, items) {
				// TBD
			}

			function onRowCountChanged(args, items) {
				// TBD
			}

			function onSelectedRowsChanged(args, value) {
				// TBD
			}

			function rowMetadataProvider(row) {
				var item = this.getItem(row);
				// TBD
			}

			function filterer(itemToFilter, args) {
				if (!args) return true;
				return false;
			}

			function checkboxSelectionFormatter(row, cell, value, columnDef, dataContext) {
				// TBD
			}

			refreshSession.refresh();
}]);