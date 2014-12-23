angular.module('adminWebApp.services')
    .factory('Utils', function ($q, $http) {

        var tryQuery = function (url) {
            var counter = 0;
            var MAX_REQUESTS = 5;
            var DELAY = 500;
            var deferred = $q.defer();

            function doQuery() {
                var deferred2 = $q.defer();
                setTimeout(function(){
                    deferred2.resolve();
                }, DELAY);

                deferred2.promise.then(function(){
                    $http.get(url)
                        .success(function (body) {
                            deferred.resolve(body)
                        })
                        .error(function (err) {
                            if (counter < MAX_REQUESTS) {
                                counter++;
                                doQuery();
                            } else {
                                deferred.reject(err);
                            }
                        });
                });
            }

            doQuery();

            return deferred.promise;
        };

        var isImage = function (src) {

            var deferred = $q.defer();

            var image = new Image();
            image.onerror = function () {
                deferred.resolve(false);
            };
            image.onload = function () {
                deferred.resolve(true);
            };
            image.src = src;

            return deferred.promise;
        };

        return {
            tryQuery: tryQuery,
            isImage: isImage
        };
    }
);
