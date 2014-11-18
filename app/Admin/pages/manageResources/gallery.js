
angular.module('adminWebApp.controllers').controller('GalleryCtrl', ['$scope', '$rootScope', '$routeParams', 'authView',
	'$location', 'tabUtil', 'refreshSession', '$window', 'gridFormatters', 'galleryResource', 'mtypes',
	function ($scope, $rootScope, $routeParams, authView, $location, tabUtil, refreshSession, $window, gridFormatters, galleryResource, mtypes) {

		function getGridColumns() {
			return [
				{id: "name", name: "Name", field: "name", width: 330, cssClass: "cell-title", headerCssClass: "header-column-first", formatter: gridFormatters.resourceNameFormatter, sortable: true}
			];
		}

		var gridCommands = $scope.gridCommands = {};
		var resourcesToDrop = [];
		var resourcesToDownload = [];
		var viewData = [];

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
//			onRowCountChanged: onRowCountChanged,
			onSelectedRowsChanged: onSelectedRowsChanged,
			includeSelectCheckbox: true,
			onClick: onRowClick,
//			rowMetadataProvider: rowMetadataProvider,
			filterFn: filterer,
//			checkboxSelectionFormatter: checkboxSelectionFormatter,
			data: []
		};

		$scope.gridData = $scope.resolvedData;

		function onRowClick(item, targetClasses, target) {
			if (item.metaType) return;

			if (targetClasses.indexOf('action-delete') !== -1) {
				return showDropConfirmation(item);
			}

			if (targetClasses.indexOf('action-download') !== -1) {
				return showDownloadConfirmation(item);
			}
		};

		function onRowsChanged(args, items) {
			viewData = _.filter(items, function (item) {
				return !item._parent;
			});
			updateDropBtnState();
			updateDownloadBtnState();
		}

		function updateFilter() {
			$scope.filterData = {
				resourceTypeCriteria: $scope.resourceTypeCriteria
			};
		};

		$scope.$watch('resourceTypeCriteria', function (item) {
			if (!item) return;
			updateFilter();
		});

		function filterer(itemToFilter, args) {
			if (!args) return true;
			if (!args.resourceTypeCriteria && !args.searchFilter)
				return true;

			var item = itemToFilter._parent || itemToFilter;

			if (args.resourceTypeCriteria === 'all') return true;

			if (item.type === mtypes.resourceType.image)
				return args.resourceTypeCriteria === 'images';
			if (item.type === mtypes.resourceType.brandLogo)
				return args.resourceTypeCriteria === 'brandLogo';
			if (item.type === mtypes.resourceType.video)
				return args.resourceTypeCriteria === 'video';
			if (item.type === mtypes.resourceType.audio)
				return args.resourceTypeCriteria === 'audio';
			if (item.type === mtypes.resourceType.document)
				return args.resourceTypeCriteria === 'document';

			return false;
		};

		function showDropConfirmation(item) {
			$scope.$broadcast('deleteResourceEvent', item);
		};

		function showDownloadConfirmation(item) {
			$scope.$broadcast('downloadResourceEvent', item);
		};

		$scope.$on('deleteResourceConfirmEvent', function (event, resource, cb) {
			event.stopPropagation();
			doDrop(_.isEmpty(resource) ? resourcesToDrop : resource, cb);
		});

		$scope.$on('downloadResourceConfirmEvent', function (event, resource, cb) {
			event.stopPropagation();
			doDownload(_.isEmpty(resource) ? resourcesToDownload : resource, cb);
		});

		$scope.broadcastResourcesToDrop = function () {
			$scope.$broadcast('deleteResourceEvent');
		};

		function doDrop(resources, cb) {
			var ids = _.pluck(resources, 'id');
			galleryResource.deleteResource(ids, function (result) {
				(cb || angular.noop)();
				refreshData();
			}, function (error) {
				(cb || angular.noop)();
			});
		};

		function doDownload(resources, cb) {
			var ids = _.pluck(resources, 'id');
			// TBD mass download
		};

		function refreshData() {
			galleryResource.gallerySetup(function (result) {
				$scope.gridData = result;
			});
		};

		var selectedIds = [];

		function onSelectedRowsChanged(args, value) {
			selectedIds = value;
			$scope.selectedRowsCount = selectedIds.length;
			updateDropBtnState();
			updateDownloadBtnState();
		};

		function updateDownloadBtnState() {
			$scope.bulkDownloadEnabled = false;
			resourcesToDownload = [];

			_.each(viewData, function (resource) {
				if (selectedIds.indexOf(resource.id) != -1) {
					$scope.bulkDownloadEnabled = true;
					resourcesToDownload.push(resource);
				}
			});

			$scope.resourcesToDownloadCnt = resourcesToDownload.length;
		};

		function updateDropBtnState() {
			$scope.bulkDropEnabled = false;
			resourcesToDrop = [];

			_.each(viewData, function (resource) {
				//if (resource.canBeDropped && selectedIds.indexOf(resource.id) != -1) {
				if (selectedIds.indexOf(resource.id) != -1) {
					$scope.bulkDropEnabled = true;
					resourcesToDrop.push(resource);
				}
			});

			$scope.resourcesToDropCnt = resourcesToDrop.length;
		};

//			refreshSession.refresh();
	}]);