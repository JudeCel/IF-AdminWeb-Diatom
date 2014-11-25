angular.module('adminWebApp.resources')
  .factory('changeContactDetailsResource', function ($resource, errorHandler) {

    var changeContactDetailsResource = $resource(ifConfig.insiderFocusApiBaseUrlSegment + '/userProfile');
    var countriesResource  = $resource(ifConfig.insiderFocusApiBaseUrlSegment + '/countryLookup');

    changeContactDetailsResource.prototype.getUser = function getUser(resultCb, errorCb) {
      return changeContactDetailsResource.get(resultCb, errorHandler.defaultServerErrorHandler(errorCb));
    };

    changeContactDetailsResource.prototype.saveUser = function saveUser(data, resultCb, errorCb) {
      return changeContactDetailsResource.save(data, resultCb, errorHandler.defaultServerErrorHandler(errorCb));
    };

    changeContactDetailsResource.prototype.getCountries = function getCountries (resultCb, errorCb) {
      return countriesResource.query(resultCb, errorHandler.defaultServerErrorHandler(errorCb));
    };

    return new changeContactDetailsResource;
  }
);

