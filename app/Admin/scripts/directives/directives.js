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

  mfDirectivesModules.directive('datepicker', function(){
    return {
      restrict: 'A',
      link: function(scope, element, attrs) {
        element.datepicker({
          format: 'mm-dd-yyyy'
        });
      }
    }
  });
})();