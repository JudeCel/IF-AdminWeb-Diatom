
angular.module('adminWebApp.controllers').controller('OrganizeAccountManagersCtrl', ['$scope', '$rootScope', '$routeParams', 'authView',
		'$location', 'tabUtil', 'resolveData', 'refreshSession', '$window',
		function ($scope, $rootScope, $routeParams, authView, $location, tabUtil, resolveData, refreshSession, $window) {

			$window.document.title = "Organize Account Managers | Insider Focus";

			$scope.resolvedData = resolveData;
      $scope.gridData = resolveData;

      function getGridColumns() {
        return [
          {id: "name_first", name: "First Name", field: "name_first", width: 150, headerCssClass: "header-column-first", cssClass: "cell-title", formatter: gridFormatters.userNameFormatter, sortable: true},
          {id: "name_last", name: "Last Name", field: "name_last", width: 130, headerCssClass: "header-column", sortable: true},
          {id: "email", name: "E-mail", field: "email", minWidth: 180, maxWidth: 180, headerCssClass: "header-column", sortable: true},
          {id: "phone", name: "Phone", field: "phone", minWidth: 180, maxWidth: 180, headerCssClass: "header-column", sortable: true},
          {id: "mobile", name: "Email", field: "mobile", minWidth: 280, maxWidth: 280, cssClass: "cell-title", headerCssClass: "header-column",  sortable: true}
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
        checkboxSelectionFormatter: checkboxSelectionFormatter,
        data: []
      };

      function doEdit(user, cb) {
        $location.path('/ManageProfile/editAccountManagers/' + user.id);
      }

      function doDrop(user, cb) {
        usersResource.dropUser(user.id, function (result) {
          (cb || angular.noop)();
           refreshData();
        }, function (error) {
          (cb || angular.noop)();
        });
      }

      function doSend(user, cb) {
        usersResource.sendUser(user.id, function (result) {
          (cb || angular.noop)();
           refreshData();
        }, function (error) {
          (cb || angular.noop)();
        });
      }

      function refreshData() {
        usersResource.getUsers(function (result) {
          $scope.gridData = result;
        });
      };

      function onRowClick(item, targetClasses, target) {
        if (target.type == "checkbox") return;

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
        $scope.$broadcast('copyUserEvent', item);
      }

      function showDropConfirmation(item) {
        $scope.$broadcast('deleteUserEvent', item);
      }

      $scope.$on('deleteUserConfirmEvent', function (event, user, cb) {
        event.stopPropagation();
        doDrop(user, cb);
      });

      $scope.$on('sendUserConfirmEvent', function (event, user, cb) {
        event.stopPropagation();
        doSend(user, cb);
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

      function checkboxSelectionFormatter(row, cell, value, columnDef, dataContext) {
         TBD
      }

			refreshSession.refresh();
}]);