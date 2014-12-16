angular

    .module('adminWebApp.controllers')

    .controller('EditChatSessionCtrl', ['$q', '$scope', '$rootScope', '$routeParams', 'authView', '$location', 'tabUtil',
        'refreshSession', '$window', '$filter', 'urlHelper', 'chatSessionResource','errorHandler', 'dateHelper',
        'fileUploaderHelper',
        function ($q, $scope, $rootScope, $routeParams, authView, $location, tabUtil,
                  refreshSession, $window, $filter, urlHelper, chatSessionResource, errorHandler, dateHelper,
                  fileUploaderHelper) {

            $scope.chatSession = {
                id: $routeParams.sessionId,
                session_logo: '',// FIXME: Need to add new field in session table for logo src path (mir4a at 10:01, 12/12/14)
                name: $scope.resolvedData.name,
                start_time: dateHelper.dateFilter($scope.resolvedData.start_time),
                start_time_hours: dateHelper.timeFilter($scope.resolvedData.start_time) || '00:00',
                end_time: dateHelper.dateFilter($scope.resolvedData.end_time),
                end_time_hours: dateHelper.timeFilter($scope.resolvedData.end_time) || '00:00',
                step: $rootScope.page.name
            };

            $scope.uploader = fileUploaderHelper.init();
            $scope.uploader.onSuccessItem = function(fileItem, response, status, headers) {
                $scope.chatSession.sessionLogo = fileItem.file.name;
            };

            $scope.error = false;
            $scope.message = "";
            $scope.save = function () {

                $scope.chatSession.start_time = dateHelper.joinDateTime($scope.chatSession.start_time, $scope.chatSession.start_time_hours);
                $scope.chatSession.end_time = dateHelper.joinDateTime($scope.chatSession.end_time, $scope.chatSession.end_time_hours);

                $scope.loading = true;

                var resCb = function (data) {
                    $scope.loading = false;
                    $scope.success = true;
                    $scope.error = false;
                    $scope.message = "Successfully saved";
                    refreshSession.refresh();
                };

                var errCb = function (err) {
                    $scope.loading = false;
                    $scope.success = false;
                    $scope.error = true;
                    $scope.message = "Save failed";
                };

                chatSessionResource.updateSessionFirstStep($scope.chatSession, resCb, errCb);


            };


            $rootScope.$on('changedStep', $scope.save);

            refreshSession.refresh();

        }]);
