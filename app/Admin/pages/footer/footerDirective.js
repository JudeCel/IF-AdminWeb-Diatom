
angular.module('adminWebApp.directives')
	.directive('mfFooter', ['$parse', '$timeout', function($parse, $timeout){
	return {
		link:function (scope) {
			scope.feedbackFocus = function() {
				scope.feedbackInFocus = true;
				$('.feedback-container').css({
					position:'fixed'
				});
				$('.feedback-text-box').animate({height:"90px"}, 400, 'swing');
			};

			scope.feedbackBlur = function() {
				collapseFeedback();
			};

			function collapseFeedback() {
				$timeout(function() {
					if(scope.sendingFeedback) {
						// Wait until feedback is sent.
						collapseFeedback();
					} else {
						scope.feedbackInFocus = false;
						$('.feedback-text-box').animate({height:"30px"}, 400, 'swing', function() {
							$('.feedback-container').css({
								position:'absolute'
							});
						});
					}
				}, 250);
			}
		}
	}
}]);
