
angular.module('adminWebApp.controllers').controller('GalleryCtrl', ['$scope', '$rootScope', '$routeParams', 'authView',
	'$location', 'tabUtil', 'refreshSession', '$window', 'gridFormatters', 'galleryResource', 'mtypes',
	function ($scope, $rootScope, $routeParams, authView, $location, tabUtil, refreshSession, $window, gridFormatters, galleryResource, mtypes) {

		function getGridColumns() {
			return [
				{id: "name", name: "Name", field: "name", width: 330, cssClass: "cell-title", headerCssClass: "header-column-first", formatter: gridFormatters.traineeNameFormatter, sortable: true}
			];
		}

		var gridCommands = $scope.gridCommands = {};

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
			filterFn: filterer,
//				checkboxSelectionFormatter: checkboxSelectionFormatter,
			data: []
		};

		$scope.gridData = $scope.resolvedData;

		function onRowClick(item, targetClasses, target) {
			// why is this here?
			if (item.metaType) return;

			if (targetClasses.indexOf('action-delete') !== -1) {
				return showDropConfirmation(item);
			}
//
//				if (targetClasses.indexOf('action-delete') !== -1) {
//					return showDropConfirmation(item);
//				}
		};

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
		}

		$scope.$on('deleteResourceConfirmEvent', function (event, trainee, cb) {
			event.stopPropagation();
			doDrop(_.isEmpty(trainee) ? traineesToDrop : trainee, cb);
		});

		function doDrop(resources, cb) {
			var ids = _.pluck(resources, 'id');
			galleryResource.deleteResource(ids, function (result) {
				(cb || angular.noop)();
				refreshData();
			}, function (error) {
				(cb || angular.noop)();
			});
		};

		function refreshData() {
			galleryResource.gallerySetup(function (result) {
				$scope.gridData = result;
			});
		}

//			refreshSession.refresh();
	}]);