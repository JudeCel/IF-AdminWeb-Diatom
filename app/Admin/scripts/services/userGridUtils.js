
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

	function searchByPersonNameEmail(user, searchCriteria) {
		if (!searchCriteria)
			return true;

		var searchCriteriaLower = searchCriteria.toLowerCase();

		return searchByPersonName(user, searchCriteriaLower) ||
			searchHelper.filterFieldIndexOf('email')(user, searchCriteriaLower) ||
			false;
	}

	function searchByPersonName(user, searchCriteria) {
		var lastName = user.name_last.toLowerCase();
		var firstName = user.name_first.toLowerCase();
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

	function searchByIds(user, ids) {
		return ids && ids.indexOf(user.id) >= 0;
	}

	function sortByPersonName(a, b) {
		var nameA = a.name_last.toLowerCase() + ', ' + a.name_first.toLowerCase();
		var nameB = b.name_last.toLowerCase() + ', ' + b.name_first.toLowerCase();
		return nameA < nameB ? -1 : 1;
	}

	function searchByName(item, searchCriteria) {
		return searchCriteria && item.name.toLowerCase().indexOf(searchCriteria.toLowerCase()) >= 0;
	}

	return {
		filter: {
			byAllTextFields: searchByAllTextFields,
			byPersonNameEmail: searchByPersonNameEmail,
			byPersonName: searchByPersonName,
			byFields: searchHelper.searchByFields,
			byBooleanField: searchByBooleanField,
			byIds: searchByIds,
			createFilter: searchHelper.createCompositeSearchFieldFilter,
			byEmail: searchHelper.filterFieldIndexOf('email'),
			byName: searchByName
		},
		sort: {
			byPersonName: sortByPersonName
		}
	};
});
