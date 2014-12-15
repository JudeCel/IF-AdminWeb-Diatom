angular

    .module('adminWebApp.controllers')

    .controller('EditChatSessionCtrl', ['$q', '$scope', '$rootScope', '$routeParams', 'authView', '$location', 'tabUtil',
        'refreshSession', '$window', '$filter', 'urlHelper', 'chatSessionResource','errorHandler', 'dateHelper','fileUploaderHelper', 'FileUploader',
        function ($q, $scope, $rootScope, $routeParams, authView, $location, tabUtil,
                  refreshSession, $window, $filter, urlHelper, chatSessionResource, errorHandler, dateHelper, fileUploaderHelper, FileUploader) {

            var session = $scope.session = {
                id: $routeParams.sessionId,
                session_logo: '',// FIXME: Need to add new field in session table for logo src path (mir4a at 10:01, 12/12/14)
                start_date_filtered: dateHelper.dateFilter($scope.resolvedData.start_time),
                start_time_filtered: dateHelper.timeFilter($scope.resolvedData.start_time) || '00:00',
                end_date_filtered: dateHelper.dateFilter($scope.resolvedData.end_time),
                end_time_filtered: dateHelper.timeFilter($scope.resolvedData.end_time) || '00:00'
            };
            angular.extend($scope.session, $scope.resolvedData);
            $scope.uploader = fileUploaderHelper.init();

            $scope.uploader.onSuccessItem = function(fileItem, response, status, headers) {
                session.session_logo = fileItem.file.name;
            };

            $scope.stepChange = function (event) {
                $scope.resolvedData.start_time = joinDateTime($scope.start_date, $scope.start_time);
                $scope.resolvedData.end_time = joinDateTime($scope.end_date, $scope.end_time);

                chatSessionResource.updateSessionFirstStep($scope.session, angular.noop, errorHandler.defaultServerErrorHandler());
            };

            refreshSession.refresh();

        }]);
