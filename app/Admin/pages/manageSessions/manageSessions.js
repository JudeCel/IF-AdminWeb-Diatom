
angular.module('adminWebApp.controllers').controller('ManageSessionsCtrl', ['$scope', '$rootScope', '$routeParams', 'authView',
		'$location', 'tabUtil', 'resolveData', 'refreshSession', '$window', 'gridFormatters', 'manageSessionsResource',
		function ($scope, $rootScope, $routeParams, authView, $location, tabUtil, resolveData, refreshSession, $window, gridFormatters, manageSessionsResource) {

			$window.document.title = "Manage Sessions | Insider Focus";
			$scope.gridData = resolveData;

			function getGridColumns() {
				return [
					{id: "name", name: "Name", field: "name", width: 150, headerCssClass: "header-column-first", formatter: gridFormatters.sessionNameFormatter, sortable: true},
					{id: "facilitator", name: "Facilitator", field: "facilitator", width: 130, headerCssClass: "header-column", sortable: true},
					{id: "start_time", name: "Start Date", field: "start_time", minWidth: 180, maxWidth: 180, headerCssClass: "header-column", sortable: true},
					{id: "end_time", name: "End Date", field: "end_time", minWidth: 180, maxWidth: 180, headerCssClass: "header-column", sortable: true},
					{id: "status_id", name: "Status", field: "status_id", minWidth: 280, maxWidth: 280, cssClass: "cell-title", headerCssClass: "header-column", formatter: gridFormatters.sessionStatusFormatter, sortable: true},
					{id: "goto", name: "Chat", minWidth: 80, maxWidth: 80, headerCssClass: "header-column", formatter: gridFormatters.gotoChatFormatter, sortable: false}
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
				includeSelectCheckbox: false,
				onClick: onRowClick,
				rowMetadataProvider: rowMetadataProvider,
				filterFn: filterer,
				//checkboxSelectionFormatter: checkboxSelectionFormatter,
				data: []
			};

			function doEdit(sessions, cb) {
				// TBD: redirect to /SessionBuilder/:sessionId/step1
			}

			function doDrop(session, cb) {
				manageSessionsResource.dropSession(session.id, function (result) {
					(cb || angular.noop)();
					//refreshData();
				}, function (error) {
					(cb || angular.noop)();
				});
			}

			function doCopy(session, cb) {
				manageSessionsResource.copySession(session.id, function (result) {
					(cb || angular.noop)();
					//refreshData();
				}, function (error) {
					(cb || angular.noop)();
				});
			}

			function onRowClick(item, targetClasses, target) {
				//if (target.type == "checkbox") return;

				if (targetClasses.indexOf('action-copy') !== -1) {
					return showCopyConfirmation(item);
				}

				if (targetClasses.indexOf('action-edit') !== -1) {
					return doEdit(item);
				}

				if (targetClasses.indexOf('action-delete') !== -1) {
					//if (!item.canBeDropped) return;
					return showDropConfirmation(item);
				}
			}

			function showCopyConfirmation(item) {
				$scope.$broadcast('copySessionEvent', item);
			}

			function showDropConfirmation(item) {
				$scope.$broadcast('deleteSessionEvent', item);
			}

			$scope.$on('deleteSessionConfirmEvent', function (event, session, cb) {
				event.stopPropagation();
				doDrop(session, cb);
			});

			$scope.$on('copySessionConfirmEvent', function (event, session, cb) {
				event.stopPropagation();
				doCopy(session, cb);
			});


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

			//function checkboxSelectionFormatter(row, cell, value, columnDef, dataContext) {
				// TBD
			//}

			$scope.buildSession = function() {
				manageSessionsResource.createSession(function(session)	{
					$location.path('/SessionBuilder/' + session.id);
				});
			}

			refreshSession.refresh();
}]);