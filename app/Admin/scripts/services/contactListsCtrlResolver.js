
angular.module('adminWebApp.resources').factory('ContactListsCtrlResolver',
	function ($q, $route, contactListsResource, usersResource, Validation, $location, errorHandler, authView) {

		return function () {
			var deferred = $q.defer();
			var groupsDeferred = $q.defer();
			var usersDeferred = $q.defer();
			var groupTrainersDeferred = $q.defer();

			var pageName = $route.current.params.pageName || $route.current.pageName;

			// let the controller handle the validate
			if (!Validation.validate()) {
				deferred.reject(false);
				return deferred.promise;
			}

			if (!pageName || pageName == 'manageGroups') {
				usersResource.getUsers(function(result){
					usersDeferred.resolve(result);
				},errorHandler.defaultServerErrorHandler())

				contactListsResource.getGroups(function(result){
					groupsDeferred.resolve(result);
				}, errorHandler.defaultServerErrorHandler());

				/*
				groupsResource.getGroupTrainers(function(result){
					groupTrainersDeferred.resolve(_.groupBy(result.allRestrictedTrainers, 'id'));
				});
				*/

				$q.all([usersDeferred.promise, groupsDeferred.promise/*, groupTrainersDeferred.promise*/]).then(function(values){
					return deferred.resolve({
						users: values[0],
						groups: values[1]/*,
						restrictedTrainers: values[2]*/
					});
				});
			}

			return deferred.promise;
		};
	}
);