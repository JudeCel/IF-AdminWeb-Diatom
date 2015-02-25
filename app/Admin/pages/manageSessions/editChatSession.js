angular

    .module('adminWebApp.controllers')

    .controller('EditChatSessionCtrl', ['$q', '$scope', '$rootScope', '$routeParams', 'authView', '$location', 'tabUtil',
        'refreshSession', '$window', '$filter', 'urlHelper', 'chatSessionResource', 'errorHandler', 'dateHelper',
        'fileUploaderHelper', 'Utils', 'socketHelper',
        function ($q, $scope, $rootScope, $routeParams, authView, $location, tabUtil, refreshSession, $window, $filter, urlHelper, chatSessionResource, errorHandler, dateHelper, fileUploaderHelper, Utils, socketHelper) {
            var thumbUrl = urlHelper.getApiUrl(ifConfig.uploadPath + "/" + $rootScope.accountId + "/" + $scope.resolvedData.sessionLogoName + ifConfig.sessionLogoThumb + $scope.resolvedData.sessionLogoExt);
            $scope.chatSession = {
                id: $routeParams.sessionId,
                session_logo: $scope.resolvedData.sessionLogoName ? thumbUrl : ifConfig.defaultSessionLogo,
                sessionLogoStatus: '',
                name: $scope.resolvedData.name,
                start_time: new Date($scope.resolvedData.start_time),
                end_time: new Date($scope.resolvedData.end_time),
                step: $rootScope.page.name
            };

            $scope.opened = {
                start_time: false,
                end_time: false
            };

            // File uploading handlers
            socketHelper.on('file:uploading', function (data) {
                $scope.error = false;
                $scope.chatSession.sessionLogoStatus = data.msg;
            });
            socketHelper.on('file:converting', function (data) {
                $scope.error = false;
                $scope.chatSession.sessionLogoStatus = data.msg;
            });
            socketHelper.on('file:ready', function (data) {
                $scope.error = false;
                $scope.chatSession.sessionLogoStatus = data.msg;
                $scope.chatSession.session_logo = urlHelper.getApiUrl('/' + data.filePath);
                setTimeout(function(){
                    $scope.chatSession.sessionLogoStatus = '';
                }, 2000);
            });


            $scope.uploader = fileUploaderHelper.init({removeAfterUpload: true});
            $scope.uploader.onAfterAddingFile = function (fileItem) {
                fileItem.upload();
            };

            $scope.uploader.onCompleteAll = function () {
                var resCb = function () {
                    $scope.chatSession.sessionLogoStatus = 'File have been uploaded';
                };

                var errCb = function (err) {
                    console.log(err);
                };
                chatSessionResource.getSession($scope.chatSession.id, resCb, errCb);
            };

            $scope.uploader.onWhenAddingFileFailed = function (item, filter, options) {
                $scope.error = true;
                $scope.chatSession.sessionLogoStatus = filter.name + ": file should be an image";
            };

            $scope.uploader.onAfterAddingFile = function(item) {
                if (item.file.size > (ifConfig.sessionLogoSize * 1024 * 1024)) {
                    $scope.uploader.cancelItem(item);
                    $scope.uploader.removeFromQueue(item);
                    $scope.error = true;
                    $scope.chatSession.sessionLogoStatus = "Image file size should not exceed " + ifConfig.sessionLogoSize + "Mb";
                } else {
                    $scope.uploader.uploadItem(item);
                }
            };
            // end File uploading handlers

            $scope.error = false;
            $scope.message = "";

            $scope.openDatePicker = function($event) {
                $event.preventDefault();
                $event.stopPropagation();
                var target = $event.target.name;

                $scope.opened[target] = true;
            };

            $scope.save = function () {

                $scope.chatSession.start_time = dateHelper.toMysqlFormat($scope.chatSession.start_time);
                $scope.chatSession.end_time = dateHelper.toMysqlFormat($scope.chatSession.end_time);

                $scope.loading = true;

                var resCb = function (data) {
                    console.log(data);
                    $scope.loading = false;
                    $scope.success = true;
                    $scope.error = false;
                    $scope.message = "Successfully saved";
                    $window.location.hash = $scope.linkNext;
                    refreshSession.refresh();
                };

                var errCb = function (err) {
                    console.log(err);
                    $scope.loading = false;
                    $scope.success = false;
                    $scope.error = true;
                    $scope.message = "Save failed";
                };

                chatSessionResource.updateSessionFirstStep($scope.chatSession, resCb, errCb);


            };

            $scope.logScope = function($event){
                console.log($event);
                console.log($scope.chatSession);
            };

            refreshSession.refresh();

        }]);
