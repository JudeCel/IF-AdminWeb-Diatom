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
                start_time: dateHelper.dateFilter($scope.resolvedData.start_time),
                start_time_hours: dateHelper.timeFilter($scope.resolvedData.start_time) || '00:00',
                end_time: dateHelper.dateFilter($scope.resolvedData.end_time),
                end_time_hours: dateHelper.timeFilter($scope.resolvedData.end_time) || '00:00',
                step: $rootScope.page.name
            };


            socketHelper.on('file:uploading', function (data) {
                $scope.chatSession.sessionLogoStatus = data.msg;
            });
            socketHelper.on('file:converting', function (data) {
                $scope.chatSession.sessionLogoStatus = data.msg;
            });
            socketHelper.on('file:ready', function (data) {
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
                var resCb = function (data) {
                    var thumbUrl = urlHelper.getApiUrl(ifConfig.uploadPath + "/" + $rootScope.accountId + "/" + data.sessionLogoName + ifConfig.sessionLogoThumb + data.sessionLogoExt);

                };

                var errCb = function (err) {
                    console.log(err);
                };
                chatSessionResource.getSession($scope.chatSession.id, resCb, errCb);
            };

            $scope.error = false;
            $scope.message = "";
            $scope.save = function () {

                $scope.chatSession.start_time = dateHelper.joinDateTime($scope.chatSession.start_time, $scope.chatSession.start_time_hours);
                $scope.chatSession.end_time = dateHelper.joinDateTime($scope.chatSession.end_time, $scope.chatSession.end_time_hours);

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


            refreshSession.refresh();

        }]);
