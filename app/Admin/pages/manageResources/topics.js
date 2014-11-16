
angular.module('adminWebApp.controllers').controller('TopicsCtrl', ['$scope', '$rootScope', '$routeParams', 'authView',
		'$location', 'tabUtil', 'refreshSession', '$window', 'gridFormatters', 'topicsResource',
		function ($scope, $rootScope, $routeParams, authView, $location, tabUtil, refreshSession, $window, gridFormatters, topicsResource) {

			var a = $scope.resolvedData;

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
				rowMetadataProvider: rowMetadataProvider,
//				filterFn: filterer,
//				checkboxSelectionFormatter: checkboxSelectionFormatter,
				data: []
			};

			$scope.gridData = $scope.resolvedData;

			function rowMetadataProvider(row) {
				var item = this.getItem(row)
				if (!item) return {cssClasses: 'collapsed'};

				var obj = {
					rows: {},
					cssClasses: ''
				};

				if (!item.metaType) {
					if (gridCommands.hasChildren(item)) {
						obj['cssClasses'] = 'expanded';
					} else if (coursesCount) {
						obj['cssClasses'] = 'collapsed';
					}
					return obj;
				}

				obj['cssClasses'] = item.metaType;
				return obj;
			};

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

				if (gridCommands.hasChildren(item)) {
					gridCommands.removeChildRows(item);
				} else {
					var sessionHeader = {
						id: 'loading' + item.id,
						name: 'Session Name',
						status: 'Status',
						metaType: 'sessionHeaderHeaderRow'
					};

					topicsResource.getSessionsForTopic(item.id, function (sessions) {
						var rows = [sessionHeader];
						_.each(sessions, function (session, index) {
							rows.push({
								id: session.id,
								name: session.name,
								metaType: 'sessionRow' + (index == sessions.length - 1 ? ' last' : '')
							});
						});
						gridCommands.setChildRows(item, rows);
					});
				}
			}

//			refreshSession.refresh();
}]);