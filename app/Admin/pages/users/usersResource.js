angular.module('adminWebApp.resources')
  .factory('usersResource', function ($resource, errorHandler) {

    var usersResource = $resource(ifConfig.insiderFocusApiBaseUrlSegment + '/userProfile');
    var countriesResource  = $resource(ifConfig.insiderFocusApiBaseUrlSegment + '/countryLookup');
    var addUserResource = $resource(ifConfig.insiderFocusApiBaseUrlSegment + '/addUser');
    var dropUserResource = $resource(ifConfig.insiderFocusApiBaseUrlSegment + '/dropUser');
    var getUsersResource = $resource(ifConfig.insiderFocusApiBaseUrlSegment + '/getUsers');

	usersResource.prototype.getUser = function getUser(userId, resultCb, errorCb) {
        return usersResource.get({userId: userId}, resultCb, errorHandler.defaultServerErrorHandler(errorCb));
    };

	usersResource.prototype.saveUser = function saveUser(data, resultCb, errorCb) {
        return usersResource.save(data, resultCb, errorHandler.defaultServerErrorHandler(errorCb));
    };

	usersResource.prototype.getCountries = function getCountries (resultCb, errorCb) {
        return countriesResource.query(resultCb, errorHandler.defaultServerErrorHandler(errorCb));
    };

    usersResource.prototype.dropUser = function dropUser(userId, resultCb, errorCb) {
      return dropUserResource.delete({userId: userId}, resultCb, errorHandler.defaultServerErrorHandler(errorCb));
    };

    usersResource.prototype.getUsers = function getUsers(resultCb, errorCb) {
      return getUsersResource.query(resultCb, errorHandler.defaultServerErrorHandler(errorCb));
    };

    usersResource.prototype.addUser = function addUser(data, resultCb, errorCb) {
      return addUserResource.save(data, resultCb, errorHandler.defaultServerErrorHandler(errorCb));
    };

	return new usersResource;
});