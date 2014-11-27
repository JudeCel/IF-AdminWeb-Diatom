

angular.module('adminWebApp.services').factory('userGridUtils', function (mtypes, searchHelper) {
	var customFieldNames = (function () {
		var a = [];
		for (var i = 0; i < 10; i++)
			a[i] = 'customField' + i;

		return a;
	})();

	function searchByAllTextFields(user, searchCriteria) {
		if (!searchCriteria)
			return true;

		var searchCriteriaLower = searchCriteria.toLowerCase();

		return searchByPersonName(user, searchCriteriaLower) ||
			searchHelper.filterFieldIndexOf('email')(user, searchCriteriaLower) ||
			searchHelper.filterFieldsIndexOf(customFieldNames)(user, searchCriteriaLower) ||
			false;
	}

	function searchByPersonNameEmailUserName(user, searchCriteria) {
		if (!searchCriteria)
			return true;

		var searchCriteriaLower = searchCriteria.toLowerCase();

		return searchByPersonName(user, searchCriteriaLower) ||
			searchHelper.filterFieldIndexOf('email')(user, searchCriteriaLower) ||
			searchHelper.filterFieldIndexOf('username')(user, searchCriteriaLower) ||
			false;
	}

	function searchByPersonName(user, searchCriteria) {
		var lastName = user.lastName.toLowerCase();
		var firstName = user.firstName.toLowerCase();
		var nameVariations = [];
		nameVariations.push(lastName + ', ' + firstName);
		nameVariations.push(lastName + ',' + firstName);
		nameVariations.push(lastName + ' ' + firstName);
		nameVariations.push(firstName + ' ' + lastName);

		for (var i = 0; i < nameVariations.length; i++) {
			if (nameVariations[i].indexOf(searchCriteria) >= 0)
				return true;
		}
		return false;
	}

	function searchByBooleanField(user, field) {
		return !!user[field];
	}

	function searchByCourseState(user, courseStates) {
		return !!courseStates[user.id];
	}

	function searchBySeriesState(user, seriesStates) {
		return !!seriesStates[user.id];
	}

	function searchByGroupMembership(user, groupId) {
		if (groupId < 0) {
			return !user.groupMemberships || user.groupMemberships.length == 0;
		}
		return user.groupMemberships && user.groupMemberships.indexOf(groupId) >= 0;
	}

	function searchByIds(user, ids) {
		return ids && ids.indexOf(user.id) >= 0;
	}

	function sortByPersonName(a, b) {
		var nameA = a.name_last.toLowerCase() + ', ' + a.name_first.toLowerCase();
		var nameB = b.name_last.toLowerCase() + ', ' + b.name_first.toLowerCase();
		return nameA < nameB ? -1 : 1;
	}

	function sortByCourseStatus(a, b) {
		var aWeight = getCourseStateSortWeight(a);
		var bWeight = getCourseStateSortWeight(b);

		return aWeight - bWeight;
	}

	function getCourseStateSortWeight(state) {
		if (!state)
			return 0;

		if (state.status == mtypes.courseStateStatus.invited || state.status == mtypes.courseStateStatus.enrolled) {
			return 50;
		} else if (state.status == mtypes.courseStateStatus.started) {
			return 100 + (state.progress || 0);
		} else if (state.status == mtypes.courseStateStatus.completed) {
			var passed = state.passed;
			if (state.passed) {
				return 300 + (state.grade || 0);
			}
			else {
				return 500 + (state.grade || 0);
			}
		}
		else if (state.status == mtypes.courseStateStatus.missedCompletionDeadline) {
			return 700;
		}
		return 900;
	}

	function searchByName(item, searchCriteria) {
		return searchCriteria && item.name.toLowerCase().indexOf(searchCriteria.toLowerCase()) >= 0;
	}

	return {
		filter: {
			byAllTextFields: searchByAllTextFields,
			byPersonNameEmailUserName: searchByPersonNameEmailUserName,
			byPersonName: searchByPersonName,
			byCourseState: searchByCourseState,
			byFields: searchHelper.searchByFields,
			byBooleanField: searchByBooleanField,
			byGroupMembership: searchByGroupMembership,
			byIds: searchByIds,
			bySeriesState: searchBySeriesState,
			createFilter: searchHelper.createCompositeSearchFieldFilter,
			byEmail: searchHelper.filterFieldIndexOf('email'),
			byUsername: searchHelper.filterFieldIndexOf('username'),
			byName: searchByName
		},
		sort: {
			byPersonName: sortByPersonName,
			byCourseStatus: sortByCourseStatus
		}
	};
});
