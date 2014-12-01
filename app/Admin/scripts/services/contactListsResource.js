
angular.module('adminWebApp.resources').factory('contactListsResource',
	function ($resource, errorHandler) {

		var GroupsResource = $resource(ifConfig.insiderFocusApiBaseUrlSegment + '/group');
		var GroupResource = $resource(ifConfig.insiderFocusApiBaseUrlSegment + '/group/:groupId');
		var AdminGroupResource = $resource(ifConfig.insiderFocusApiBaseUrlSegment + '/group/:groupId/trainer');
		var BulkGroupResource = $resource(ifConfig.insiderFocusApiBaseUrlSegment + '/group/:type');

		// User management page
		GroupsResource.prototype.getGroups = function getAllGroups(resultCb, errorCb) {
			return GroupsResource.query({}, resultCb || angular.noop, errorHandler.defaultServerErrorHandler(errorCb));
		};

		GroupsResource.prototype.getGroupUsers = function getAllGroupUsers(groupId, resultCb, errorCb) {
			return GroupResource.query({groupId: groupId}, resultCb || angular.noop, errorHandler.defaultServerErrorHandler(errorCb));
		};

		GroupsResource.prototype.getGroupTrainers = function getAllGroupTrainers(resultCb, errorCb) {
			return BulkGroupResource.get({type: 'trainer'}, resultCb || angular.noop, errorHandler.defaultServerErrorHandler(errorCb));
		};

		GroupsResource.prototype.addGroups = function addGroups(groups, resultCb, errorCb) {
			return GroupsResource.save({groups: groups}, resultCb || angular.noop, errorHandler.validationFaultServerErrorHandler(errorCb));
		};

		GroupsResource.prototype.updateGroup = function updateGroup(group, resultCb, errorCb) {
			return GroupResource.save({groupId: group.id}, {groupName: group.name, addNumberSuffix: group.addNumberSuffix }, resultCb || angular.noop, errorHandler.validationFaultServerErrorHandler(errorCb));
		};

		GroupsResource.prototype.deleteGroup = function deleteGroup(groupId, resultCb, errorCb) {
			return GroupResource['delete']({groupId: groupId}, resultCb || angular.noop, errorHandler.defaultServerErrorHandler(errorCb));
		};

		GroupsResource.prototype.updateGroupUsers = function updateGroupUsers(params, resultCb, errorCb) {
			return BulkGroupResource.save({type: 'user'}, params, resultCb || angular.noop, errorHandler.defaultServerErrorHandler(errorCb));
		};

		GroupsResource.prototype.updateGroupTrainers = function updateGroupTrainers(groupId, userIds, resultCb, errorCb) {
			return AdminGroupResource.save({groupId: groupId},{userIds: userIds}, resultCb || angular.noop, errorHandler.defaultServerErrorHandler(errorCb));
		};

		return new GroupsResource;
	}
);