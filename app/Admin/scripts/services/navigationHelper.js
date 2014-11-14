angular.module('adminWebApp.services')

	.factory('navigationHelper', [function() {
		var breadcrumbClicked = false;

		function setBreadcrumbClicked(){
			breadcrumbClicked = true
		}

		function getBreadcrumbClicked(reset){
			var result = breadcrumbClicked;
			if (reset){
				breadcrumbClicked = false;
			}
			return result;
		}

		return {
			setBreadcrumbClicked: setBreadcrumbClicked,
			getBreadcrumbClicked: getBreadcrumbClicked
		};
	}]);