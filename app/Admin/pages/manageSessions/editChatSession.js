angular

  .module('adminWebApp.controllers')

  .controller('EditChatSessionCtrl', ['$scope', '$rootScope', '$routeParams', 'authView', '$location', 'tabUtil', 'refreshSession', '$window', '$filter','FileUploader',
    function ($scope, $rootScope, $routeParams, authView, $location, tabUtil, refreshSession, $window, $filter, FileUploader) {

      function dateFilter(date) {
        return $filter('date')(date, 'MM-dd-yyyy');
      }

      function timeFilter(date) {
        return $filter('date')(date, 'hh:mm');
      }

      $scope.start_date = dateFilter($scope.resolvedData.start_time);
      $scope.start_time = timeFilter($scope.resolvedData.start_time);
      $scope.end_date = dateFilter($scope.resolvedData.end_time);
      $scope.end_time = timeFilter($scope.resolvedData.end_time);

      function joinDateTime(date, time) {
        var d = new Date(date + ' ' + time),
            dayUTC = d.getUTCDate(),
            monthUTC = d.getUTCMonth() + 1,
            yearUTC = d.getUTCFullYear(),
            hoursUTC = d.getUTCHours(),
            minutesUTC = d.getUTCMinutes();

        monthUTC = monthUTC < 10 ? '0' + monthUTC.toString() : monthUTC;
        dayUTC = dayUTC < 10 ? '0' + dayUTC.toString() : dayUTC;
        hoursUTC = hoursUTC < 10 ? '0' + hoursUTC.toString() : hoursUTC;
        minutesUTC = minutesUTC < 10 ? '0' + minutesUTC.toString() : minutesUTC;

        return yearUTC + '-' + monthUTC + '-' + dayUTC + 'T' + hoursUTC + ':' + minutesUTC + ':00.000Z';
      }

      $scope.stepChange = function(event) {
        event.preventDefault();
        $scope.resolvedData.start_time = joinDateTime($scope.start_date, $scope.start_time);
        $scope.resolvedData.end_time = joinDateTime($scope.end_date, $scope.end_time);
      };

    refreshSession.refresh();



      var uploader = $scope.uploader = new FileUploader({
        url: '/api/save_image_url/'
      });

      // FILTERS

      uploader.filters.push({
        name: 'imageFilter',
        fn: function(item /*{File|FileLikeObject}*/, options) {
          var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
          return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
        }
      });

      // CALLBACKS

      uploader.onWhenAddingFileFailed = function(item /*{File|FileLikeObject}*/, filter, options) {
        console.info('onWhenAddingFileFailed', item, filter, options);
      };
      uploader.onAfterAddingFile = function(fileItem) {
        console.info('onAfterAddingFile', fileItem);
      };
      uploader.onAfterAddingAll = function(addedFileItems) {
        console.info('onAfterAddingAll', addedFileItems);
      };
      uploader.onBeforeUploadItem = function(item) {
        console.info('onBeforeUploadItem', item);
      };
      uploader.onProgressItem = function(fileItem, progress) {
        console.info('onProgressItem', fileItem, progress);
      };
      uploader.onProgressAll = function(progress) {
        console.info('onProgressAll', progress);
      };
      uploader.onSuccessItem = function(fileItem, response, status, headers) {
        console.info('onSuccessItem', fileItem, response, status, headers);
      };
      uploader.onErrorItem = function(fileItem, response, status, headers) {
        console.info('onErrorItem', fileItem, response, status, headers);
      };
      uploader.onCancelItem = function(fileItem, response, status, headers) {
        console.info('onCancelItem', fileItem, response, status, headers);
      };
      uploader.onCompleteItem = function(fileItem, response, status, headers) {
        console.info('onCompleteItem', fileItem, response, status, headers);
      };
      uploader.onCompleteAll = function() {
        console.info('onCompleteAll');
      };

      console.info('uploader', uploader);

  }]).directive('ngThumb', ['$window', function($window) {
//    TODO: Adopt according mockups and move to separate file
    var helper = {
      support: !!($window.FileReader && $window.CanvasRenderingContext2D),
      isFile: function(item) {
        return angular.isObject(item) && item instanceof $window.File;
      },
      isImage: function(file) {
        var type =  '|' + file.type.slice(file.type.lastIndexOf('/') + 1) + '|';
        return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
      }
    };

    return {
      restrict: 'A',
      template: '<canvas/>',
      link: function(scope, element, attributes) {
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
