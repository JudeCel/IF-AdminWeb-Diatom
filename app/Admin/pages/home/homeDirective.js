
angular.module('adminWebApp.directives')
	.directive('mfHome', function () {
		return {
			restrict: 'A',
			link: function (scope, iElement, iAttrs) {
				scope.$watch('homeState.sidebarContentSrc', function () {
					$(window).trigger('resize');
				});
			}
		}
	});
