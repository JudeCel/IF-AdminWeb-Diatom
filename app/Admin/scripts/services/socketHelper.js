angular.module('adminWebApp.services').factory('socketHelper', ['urlHelper', 'socketFactory', function (urlHelper, socketFactory) {

    var socketConnection = io.connect(urlHelper.getApiUrl());

    socket = socketFactory({
        ioSocket: socketConnection
    });

    return socket;

}]);





