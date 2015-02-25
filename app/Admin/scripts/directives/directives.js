(function () {
	'use strict';

	var mfDirectivesModules = angular.module('adminWebApp.directives');

	mfDirectivesModules.directive('mfFullHeight', ['$window', function ($window) {
		function naner(v) {
			v = parseInt(v);
			return isNaN(v) ? 0 : v;
		}

		return function ($scope, elem, attrs) {
			var delayedResize = null;
			var doResize = _.throttle(function () {
				if (!elem) return;

				var foot = $(attrs.mfFullHeight);
				if (!foot.length)
					throw Error('No sibling autosize-footer found!');

				var elemExtent = elem.offset().top + elem.outerHeight();
				var footTop = foot.offset().top;

				elemExtent += Math.max(naner(elem.css('margin-bottom')), naner(foot.css('margin-top')));    //Handle margin collapse
				var deltaY = footTop - elemExtent - 1;

				if (deltaY) {
					//There is a bug in jquery .height if you use border-box. Workaround is to read/write with raw css height
					var h = parseInt(elem.css('height') || '0');
					h += deltaY;
					elem.css('height', h);

					clearTimeout(delayedResize);
					delayedResize = setTimeout(doResize, 150);
				} else {
					$scope.$broadcast('resized');
				}
		}, 100);


			angular.element($window).bind('resize', doResize);
			setTimeout(doResize, 50);

			$scope.$on('$destroy', function () {
				angular.element($window).unbind('resize', doResize);
				elem = null;
			});
		}
	}]);

    mfDirectivesModules.directive('datepicker', function (dateHelper) {
        return {
            restrict: 'AE',
            require: '^ngModel',
            link: function (scope, element, attrs, ctrl) {
                ctrl.$parsers.unshift(function(viewValue) {
                    console.log(viewValue);
                    if (dateHelper.isValidDate(viewValue)) {
                        ctrl.$setValidity('validDate', true);
                        //element.datepicker('setValue', viewValue);
                        return viewValue;
                    } else {
                        ctrl.$setValidity('validDate', false);
                        //element.datepicker('setValue', undefined);
                        return undefined;
                    }
                });

            }
        }
    });

    mfDirectivesModules.directive('ngSessionBuilderStepsArrows', function ($rootScope, $window) {
        return {
            restrict: 'A',
            require: '^ngModel',
            template: '<button class="prev_link" ng-click="changeStep($event)" data-href="{{linkPrev}}">Prev Step</button><button class="next_link" ng-click="changeStep($event)" data-href="{{linkNext}}">Next Step</button>',
            link: function (scope, element, attrs) {
                var prevLink = element.find('.prev_link'),
                    nextLink = element.find('.next_link');
                nextLink.attr('disabled', 'disabled');

                if ($rootScope.page.name === 'step1') {
                    prevLink.hide();
                } else if ($rootScope.page.name === 'step5') {
                    nextLink.hide();
                } else {
                    prevLink.show();
                    nextLink.show();
                }

                scope.$watchCollection(attrs.ngModel, function() {
                    if (scope.form === undefined) return;
                    nextLink.attr('disabled', scope.form.$invalid);
                });

                function checkSelected(arr) {
                    for (var i = 0; i < arr.length; i++) {
                        if (arr[i].selected) {
                            return i;
                        }
                    }
                }

                scope.changeStep = function($event) {
                    if (scope.form === undefined) {
                        $window.location.hash = $($event.target).attr('data-href');
                        return;
                    }
                    scope.save();
                };

                var step = checkSelected(scope.tabs);
                scope.linkPrev = '#/SessionBuilder/' + scope.currentTab.sessionId +'/step' + step;
                scope.linkNext = '#/SessionBuilder/' + scope.currentTab.sessionId +'/step' + (step + 2);
            }
        }
    });

    mfDirectivesModules.directive('ngThumb', ['$window', function ($window) {
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

})();
