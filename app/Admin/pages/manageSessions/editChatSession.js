angular

    .module('adminWebApp.controllers')

    .controller('EditChatSessionCtrl', ['$q', '$scope', '$rootScope', '$routeParams', 'authView', '$location', 'tabUtil',
        'refreshSession', '$window', '$filter', 'FileUploader', 'urlHelper', 'chatSessionResource','errorHandler',
        function ($q, $scope, $rootScope, $routeParams, authView, $location, tabUtil,
                  refreshSession, $window, $filter, FileUploader, urlHelper, chatSessionResource, errorHandler) {

            function dateFilter(date) {
                return $filter('date')(date, 'MM-dd-yyyy');
            }

            function timeFilter(date) {
                return $filter('date')(date, 'hh:mm');
            }

            // TODO: Move to services, ref: http://stackoverflow.com/a/5133807/1540609 (mir4a at 15:48, 12/10/14)
            function twoDigits(d) {
                if(0 <= d && d < 10) return "0" + d.toString();
                if(-10 < d && d < 0) return "-0" + (-1*d).toString();
                return d.toString();
            }

            Date.prototype.toMysqlFormat = function() {
                return this.getUTCFullYear() + "-" + twoDigits(1 + this.getUTCMonth()) + "-" + twoDigits(this.getUTCDate()) + " " + twoDigits(this.getUTCHours()) + ":" + twoDigits(this.getUTCMinutes()) + ":" + twoDigits(this.getUTCSeconds());
            };

            $scope.session_logo = ''; // FIXME: Need to add new field in session table for logo src path (mir4a at 10:01, 12/12/14)
            $scope.start_date = dateFilter($scope.resolvedData.start_time);
            $scope.start_time = timeFilter($scope.resolvedData.start_time) || '00:00';
            $scope.end_date = dateFilter($scope.resolvedData.end_time);
            $scope.end_time = timeFilter($scope.resolvedData.end_time) || '00:00';

            function joinDateTime(date, time) {
                if (date === 'undefined' || date === null) {
                    return null;
                }
                var d = new Date(date + ' ' + time)
                return d.toMysqlFormat();
            }

            $scope.stepChange = function (event) {
                $scope.resolvedData.start_time = joinDateTime($scope.start_date, $scope.start_time);
                $scope.resolvedData.end_time = joinDateTime($scope.end_date, $scope.end_time);
                var session = {
                  id: $routeParams.sessionId,
                  name: $scope.resolvedData.name,
                  start_time: $scope.resolvedData.start_time,
                  end_time: $scope.resolvedData.end_time,
                  colours_used: $scope.resolvedData.colours_used
                };

                chatSessionResource.updateSessionFirstStep(session, angular.noop, errorHandler.defaultServerErrorHandler());
            };

            refreshSession.refresh();

            var uploader = $scope.uploader = new FileUploader({
                url: urlHelper.getApiUrl() + '/insiderfocus-api/uploadImage',
                queueLimit: 1,
                headers: {
                    'x-if-sess': $rootScope.sessId,
                    'userId': $rootScope.userId
                }
            });

            // FILTERS

            uploader.filters.push({
                name: 'imageFilter',
                fn: function (item /*{File|FileLikeObject}*/, options) {
                    var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
                    return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
                }
            });

            // CALLBACKS

            uploader.onWhenAddingFileFailed = function (item /*{File|FileLikeObject}*/, filter, options) {
                console.info('onWhenAddingFileFailed', item, filter, options);
            };
            uploader.onAfterAddingFile = function (fileItem) {
                console.info('onAfterAddingFile', fileItem);
            };
            uploader.onAfterAddingAll = function (addedFileItems) {
                console.info('onAfterAddingAll', addedFileItems);
            };
            uploader.onBeforeUploadItem = function (item) {
                console.info('onBeforeUploadItem', item);
            };
            uploader.onProgressItem = function (fileItem, progress) {
                console.info('onProgressItem', fileItem, progress);
                $scope.session_logo = fileItem.file.name;
            };
            uploader.onProgressAll = function (progress) {
                console.info('onProgressAll', progress);
            };
            uploader.onSuccessItem = function (fileItem, response, status, headers) {
                console.info('onSuccessItem', fileItem, response, status, headers);
            };
            uploader.onErrorItem = function (fileItem, response, status, headers) {
                console.info('onErrorItem', fileItem, response, status, headers);
            };
            uploader.onCancelItem = function (fileItem, response, status, headers) {
                console.info('onCancelItem', fileItem, response, status, headers);
            };
            uploader.onCompleteItem = function (fileItem, response, status, headers) {
                console.info('onCompleteItem', fileItem, response, status, headers);
            };
            uploader.onCompleteAll = function () {
                console.info('onCompleteAll');
            };

        }]).directive('ngThumb', ['$window', function ($window) {
//    TODO: Adopt according mockups and move to separate file
        var helper = {
            support: !!($window.FileReader && $window.CanvasRenderingContext2D),
            isFile: function (item) {
                return angular.isObject(item) && item instanceof $window.File;
            },
            isImage: function (file) {
                var type = '|' + file.type.slice(file.type.lastIndexOf('/') + 1) + '|';
                return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
            }
        };

        return {
            restrict: 'A',
            template: '<canvas/>',
            link: function (scope, element, attributes) {
                if (!helper.support) return;

                var params = scope.$eval(attributes.ngThumb);

                if (!helper.isFile(params.file)) return;
                if (!helper.isImage(params.file)) return;

                var canvas = element.find('canvas');
                var reader = new FileReader();

                reader.onload = onLoadFile;
                reader.readAsDataURL(params.file);

                function onLoadFile(event) {
                    var img = new Image();
                    img.onload = onLoadImage;
                    img.src = event.target.result;
                }

                function onLoadImage() {
                    var width = params.width || this.width / this.height * params.height;
                    var height = params.height || this.height / this.width * params.width;
                    canvas.attr({ width: width, height: height });
                    canvas[0].getContext('2d').drawImage(this, 0, 0, width, height);
                }
            }
        };
    }])

;
