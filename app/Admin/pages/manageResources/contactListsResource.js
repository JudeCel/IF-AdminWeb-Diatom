
angular.module('adminWebApp.resources').factory('contactListsResource',
	function ($resource, errorHandler) {

		var contactListsResource = $resource(ifConfig.insiderFocusApiBaseUrlSegment + '/contactLists');
		var GroupResource = $resource(ifConfig.insiderFocusApiBaseUrlSegment + '/group/:groupId');
		var AdminGroupResource = $resource(ifConfig.insiderFocusApiBaseUrlSegment + '/group/:groupId/trainer');
		var BulkGroupResource = $resource(ifConfig.insiderFocusApiBaseUrlSegment + '/group/:type');

		// User management page
		contactListsResource.prototype.getGroups = function getAllGroups(resultCb, errorCb) {
			return GroupsResource.query({}, resultCb || angular.noop, errorHandler.defaultServerErrorHandler(errorCb));
		};

		contactListsResource.prototype.contactListsSetup = function contactListsSetup(resultCb, errorCb) {
			return contactListsResource.get(resultCb, errorHandler.defaultServerErrorHandler(errorCb));
		};

		contactListsResource.prototype.getGroupUsers = function getAllGroupUsers(groupId, resultCb, errorCb) {
			return GroupResource.query({groupId: groupId}, resultCb || angular.noop, errorHandler.defaultServerErrorHandler(errorCb));
		};

		contactListsResource.prototype.getGroupTrainers = function getAllGroupTrainers(resultCb, errorCb) {
			return BulkGroupResource.get({type: 'trainer'}, resultCb || angular.noop, errorHandler.defaultServerErrorHandler(errorCb));
		};

		contactListsResource.prototype.addGroups = function addGroups(groups, resultCb, errorCb) {
			return GroupsResource.save({groups: groups}, resultCb || angular.noop, errorHandler.validationFaultServerErrorHandler(errorCb));
		};

		contactListsResource.prototype.updateGroup = function updateGroup(group, resultCb, errorCb) {
			return GroupResource.save({groupId: group.id}, {groupName: group.name, addNumberSuffix: group.addNumberSuffix }, resultCb || angular.noop, errorHandler.validationFaultServerErrorHandler(errorCb));
		};

		contactListsResource.prototype.deleteGroup = function deleteGroup(groupId, resultCb, errorCb) {
			return GroupResource['delete']({groupId: groupId}, resultCb || angular.noop, errorHandler.defaultServerErrorHandler(errorCb));
		};

		contactListsResource.prototype.updateGroupUsers = function updateGroupUsers(params, resultCb, errorCb) {
			return BulkGroupResource.save({type: 'user'}, params, resultCb || angular.noop, errorHandler.defaultServerErrorHandler(errorCb));
		};

		contactListsResource.prototype.updateGroupTrainers = function updateGroupTrainers(groupId, userIds, resultCb, errorCb) {
			return AdminGroupResource.save({groupId: groupId},{userIds: userIds}, resultCb || angular.noop, errorHandler.defaultServerErrorHandler(errorCb));
		};

		return new contactListsResource;
	}
);