

angular.module('adminWebApp.services').factory('searchHelper', function () {

	// strict === filtering
	function filterFieldStrict(field) {
		return function addItemAndCriteria(item, searchCriteria) {
			return filterFieldStrictInternal(field, item, searchCriteria);
		};
	}

	function filterFieldStrictForUnderscore(field) {
		return function addCriteria(searchCriteria) {
			return function addItem(item) {
				return filterFieldStrictInternal(field, item, searchCriteria);
			};
		};
	}

	function filterFieldsStrict(fields) {
		return function (item, searchCriteria) {
			if (!searchCriteria) return true;

			for (var i = 0, len = fields.length; i < len; i++) {
				if (filterFieldStrictInternal(fields[i], item, searchCriteria))
					return true;
			}
			return false;
		};
	}

	function filterFieldStrictInternal(field, item, searchCriteria) {
		if (!searchCriteria) return true;
		if (!item[field]) return false;
		return item[field] === searchCriteria;
	}

	// indexOf filtering
	function filterFieldIndexOf(field) {
		return function addItemAndCriteria(item, searchCriteria) {
			return filterFieldIndexOfInternal(field, item, searchCriteria);
		};
	}

	function filterFieldIndexOfForUnderscore(field) {
		return function addCriteria(searchCriteria) {
			return function addItem(item) {
				return filterFieldIndexOfInternal(field, item, searchCriteria);
			};
		};
	}

	function filterFieldsIndexOf(fields) {
		return function addItemAndCriteria(item, searchCriteria) {
			if (!searchCriteria) return true;

			for (var i = 0, len = fields.length; i < len; i++) {
				if (filterFieldIndexOfInternal(fields[i], item, searchCriteria))
					return true;
			}
			return false;
		};
	}

	function filterFieldIndexOfInternal(field, item, searchCriteria) {
		if (!searchCriteria) return true;
		if (!item[field]) return false;
		return !!~item[field].toLowerCase().indexOf(searchCriteria.toLowerCase());
	}

	function searchByFields(item, searchCriteria, fields) {
		return filterFieldsIndexOf(fields)(item, searchCriteria)
	}

	function createCompositeSearchFieldFilter(filterFunction, filterParams) {
		return createCompositeSearchFieldFilter2(filterFunction)(filterParams);
	}

	function createCompositeSearchFieldFilter2(filterFunction) {
		return function addCriteria(filterParams) {
			return function addItem(item) {
				var args = [item];
				args = args.concat(filterParams);
				return filterFunction.apply(this, args);
			};
		};
	}

	return {
		filterFieldStrict: filterFieldStrict,
		filterFieldStrictForUnderscore: filterFieldStrictForUnderscore,
		filterFieldsStrict: filterFieldsStrict,

		filterFieldIndexOf: filterFieldIndexOf,
		filterFieldIndexOfForUnderscore: filterFieldIndexOfForUnderscore,
		filterFieldsIndexOf: filterFieldsIndexOf,

		searchByFields: searchByFields,
		createCompositeSearchFieldFilter: createCompositeSearchFieldFilter,
		createCompositeSearchFieldFilter2: createCompositeSearchFieldFilter2
	};
});
