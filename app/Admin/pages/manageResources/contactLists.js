
angular.module('adminWebApp.controllers').controller('ContactListsCtrl', ['$scope', '$rootScope', '$routeParams', 'authView',
		'$location', 'tabUtil', 'refreshSession', '$window', 'gridFormatters', 'userGridUtils',
		function ($scope, $rootScope, $routeParams, authView, $location, tabUtil, refreshSession, $window, gridFormatters, userGridUtils) {
			
			$window.document.title = "Contact Lists | Insider Focus";

			var accountUsers = $scope.resolvedData.users;

			accountUsers = $scope.gridData = accountUsers.sort(userGridUtils.sort.byPersonName);
			$scope.usersCount = $scope.gridData.length;
			$scope.accountContactLists = $scope.resolvedData.contactLists;

			var selectedContactList = {
				id: -1,
				name: 'All',
				userIds: accountUsers
			};
			$scope.accountContactLists.splice(0, 0, selectedContactList);

			$scope.searchChanged = updateFilter;

			if (!$scope.gridCommands)
				$scope.gridCommands = {};
			var gridCommands = $scope.gridCommands;

			$scope.gridInfoGroups = {
				options: {editable: false,
					selectable: true,
					enableCellNavigation: true,
					asyncEditorLoading: false,
					enableColumnReorder: false,
					forceFitColumns: true,
					forceSyncScrolling: $scope.accountContactLists.length < 100
				},
				columns: [
					{
						id: "name",
						name: "Contact Lists",
						field: "name", width: 300, cssClass: "cell-title", formatter: gridFormatters.contactListNameFormatter
					}
				],
				onClick: onGroupRowClick,
				rowMetadataProvider: contactListRowMetadataProvider,
				data: []
			};

			$scope.gridInfoUsers = {
				options: {
					editable: false,
					enableCellNavigation: false,
					enableColumnReorder: false,
					forceFitColumns: true,
					multiColumnSort: true,
					forceSyncScrolling: accountUsers.length < 500
				},
				columns: [
					{id: "name", name: "Name", field: "name", width: 250, cssClass: "cell-title", sortable: true},
					{id: "email", name: "Email", field: "email", width: 350, cssClass: "cell-title", sortable: true}        // TODO: add formatter
				],
				onRowsChanged: onRowsChanged,
				onRowCountChanged: onRowCountChanged,
				filterFn: filterer,
				rowMetadataProvider: userRowMetadataProvider,
				data: [],
				includeSelectCheckbox: true,
				checkboxSelectionFormatter: checkboxSelectionFormatter,
				onSelectedRowsChanged: onSelectedRowsChanged
			};

			getInvitedUserIds();

			var selectedIds = [];
			$scope.selectedRowsCount = 0;

			function onSelectedRowsChanged(args, value) {
				$scope.selectedRowsCount = value.length;
				selectedIds = value;

				refreshInviteButtonState();
			}

			function userRowMetadataProvider(row) {
				if (!this.getItem(row))
					return {cssClasses: 'enabledRow'};

				return this.getItem(row).canBeInvited ? {cssClasses: 'enabledRow'} : {cssClasses: 'disabledRow'};
			}

			function contactListRowMetadataProvider(row) {
				if (!this.getItem(row))
					return {cssClasses: 'shiftedRow'};
				return this.getItem(row).name.toLowerCase() === 'all' ? {cssClasses: 'boldedRow'} : {cssClasses: 'shiftedRow'};
			}

			function filterer(itemToFilter, args) {
				if (!args || !args.nameCriteria) return true;
				return userGridUtils.filter.byPersonNameEmailUserName(itemToFilter, args.nameCriteria);
			}

			function updateFilter() {
				$scope.filterData = { nameCriteria: $scope.userSearchCriteria };
			}

			function onGroupRowClick(item, targetClasses) {
				selectedContactList = item;
				return loadUsersForContactList(item);
			}

			this.onGroupRowClick = onGroupRowClick;

			function arrayToLookup(arr) {
				var lookup = {};
				for (var i = 0; i < arr.length; i++)
					lookup[arr[i]] = true;
				return lookup;
			}

			function preselectInvitedUsers() {
				gridCommands.setSelectedRows(getInvitedUserIdx());
			}

			function getInvitedUserIdx() {
				var cannotBeInvitedIdx = [];

				for (var i = 0; i < $scope.gridData.length; i++) {
					if (!$scope.gridData[i].canBeInvited) {
						cannotBeInvitedIdx.push(i);
					}
				}
				return cannotBeInvitedIdx;
			}

			function getInvitedUserIds() {
				var cannotBeInvitedIds = [];
				for (var i = 0; i < $scope.gridData.length; i++) {
					if (!$scope.gridData[i].canBeInvited) {
						cannotBeInvitedIds.push($scope.gridData[i].id);
					}
				}
				return cannotBeInvitedIds;
			}

			function loadUsersForContactList(contactList) {
				var usersInContactList = restoreSortIn(unsortedUsersFor(contactList));
				$scope.gridData = usersInContactList;
				viewData = $scope.userSearchCriteria ? filterViewBySearchCriteria() : $scope.gridData;
				preselectInvitedUsers(usersInContactList);
				gridCommands.cleanSelection();
			}

			function filterViewBySearchCriteria() {
				return _.filter($scope.gridData, function (user) {
					return userGridUtils.filter.byPersonNameEmailUserName(user, $scope.userSearchCriteria);
				});
			}

			function unsortedUsersFor(contactList) {
				if (contactList.id === -1) {
					return accountUsers;
				}
				else {
					var ids = arrayToLookup(contactList.userIds);
					return _.filter(accountUsers, function (user) {
						return ids[user.id];
					});
				}
			}

			var currentSortColumn;

			function restoreSortIn(data) {
				currentSortColumn = gridCommands.sort();
				if (!currentSortColumn) return data.sort(userGridUtils.sort.byPersonName);
				switch (currentSortColumn.columnId) {
					case "name" :
					{
						return data.sort(userGridUtils.sort.byPersonName);
						break;
					}
					case "email" :
					{
						return data.sort(sortByEmail);
						break;
					}
				}
			}

			function sortByEmail(a, b) {
				var aEmail = a.email.toLowerCase();
				var bEmail = b.email.toLowerCase();
				var sign = currentSortColumn.sortAsc ? 1 : -1;
				return ((aEmail < bEmail) ? -1 : ((aEmail > bEmail) ? 1 : 0)) * sign;
			}

			var viewData = [];

			function onRowsChanged(args, items) {
				viewData = items;
				refreshInviteButtonState();
			}

			function onRowCountChanged(args, items) {
				viewData = items;
				refreshInviteButtonState();
				$scope.usersCount = viewData.length;
			}

			function showSpinner() {
				$rootScope.$broadcast('$showLoadingSpinner', true);
				refreshInviteButtonState();
			}

			function hideSpinner() {
				$rootScope.$broadcast('$showLoadingSpinner', false);
				refreshInviteButtonState();
			}

			function refreshInviteButtonState() {
				calculateUsersToInvite();
				buildInviteButtonText();
			}

			function calculateUsersToInvite() {
				var usersToInvite = 0;
				_.each(viewData, function (user) {
					if (user.canBeInvited && selectedIds.indexOf(user.id) != -1) {
						usersToInvite++;
					}
				});
				$scope.usersToInvite = usersToInvite;
			}

			function buildInviteButtonText() {
				var label = inviting ? "Inviting... (" + $scope.usersToInvite + ')' : $scope.usersToInvite == 0 ? 'Invite' : 'Invite (' + $scope.usersToInvite + ')';

				$scope.inviteButtonState = {
					enabled: $scope.usersToInvite > 0 && !inviting,
					text: label
				};
			}

			var spinnerTimeout;
			var inviting = false;

			$scope.addAllUsers = function () {
				// TODO
			};

			function clearAfterInvite() {
				inviting = false;
				clearTimeout(spinnerTimeout);
				hideSpinner();
				gridCommands.cleanSelection();
			}

			function refreshData(cb) {
				// TODO
			}

			function restoreSelectedContactList() {
				//TODO
//				var updatedSelectedContactList = $.grep($scope.accountContactLists, function (e) {
//					return e.id == selectedContactList.id
//				});
//				loadUsersForContactList(updatedSelectedContactList[0]);
			}


			$scope.getBackUrl = function () {
				// TODO
			};

			function checkboxSelectionFormatter(row, cell, value, columnDef, dataContext) {
				if (dataContext && !dataContext.canBeInvited) return "";
				var selectedRows = gridCommands.getSelectedRows();
				var checked = !!~selectedRows.indexOf(row);
				return checked ? "<input type='checkbox' checked='checked'>" : "<input type='checkbox'>";
			}

			$scope.getAddUserUrl = function () {
				return '#/ManageResources/addContact';
			};

			$scope.$watch('userSearchCriteria', updateFilter);

		}]);