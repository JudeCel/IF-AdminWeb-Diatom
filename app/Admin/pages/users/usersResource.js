angular.module('adminWebApp.resources')
  .factory('usersResource', function ($resource, errorHandler) {

    var usersResource = $resource(ifConfig.insiderFocusApiBaseUrlSegment + '/userProfile');
    var countriesResource  = $resource(ifConfig.insiderFocusApiBaseUrlSegment + '/countryLookup');

	usersResource.prototype.getUser = function getUser(resultCb, errorCb) {
        return usersResource.get(resultCb, errorHandler.defaultServerErrorHandler(errorCb));
    };

	usersResource.prototype.saveUser = function saveUser(data, resultCb, errorCb) {
        return usersResource.save(data, resultCb, errorHandler.defaultServerErrorHandler(errorCb));
    };

	usersResource.prototype.getCountries = function getCountries (resultCb, errorCb) {
        return countriesResource.query(resultCb, errorHandler.defaultServerErrorHandler(errorCb));
    };

	return new usersResource;
});