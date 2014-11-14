
angular.module('adminWebApp.services').factory('Validation', [function() {

	var validationArr = [];

	return {
		validate: function() {
			if(validationArr.length > 0) {
				return validationArr[0]();
			}

			return true;
		},

		getValidations: function() {
			return validationArr.concat();
		},

		addValidation: function(cb) {
			validationArr.push(cb);
		},

		removeValidation: function(cb) {
			validationArr = [];
		},

		removeAllValidations: function() {
			validationArr = [];
		}
	};
}]);
