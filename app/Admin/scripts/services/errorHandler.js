
angular.module('adminWebApp.resources').factory('errorHandler', function ($location, modalHelper, $window) {

	var genericServerErrorDialog;

	function defaultServerErrorHandler(customErrorHandler) {
		return function (e) {
			var cancelDefault = customErrorHandler && customErrorHandler(e);
			if (cancelDefault)
				return;

			if(e && e.status == 0){
				//console.log("Seems like request was canceled: Status: " + e.status);
				return;
			} else if (e && e.status == 401 && e.data) {
				if (e.data.accountInactive) {
					$location.path('/Manage_Account');		// Show expired trial popup in Flex
					return;
				} else {
					//$window.location.href = $location.protocol() + '://' + $location.host() + '/logout.aspx';
					$window.location.href = "http://localhost:6600/register";
					return;
				}
			}

			showGenericServerError();
		}
	}

	function validationFaultServerErrorHandler(cb) {
		return function (e) {
			if (e.status === 400){
				var errorTitle = e.data.title || "Validation Error";
				var errorMessage = e.data.message || e.data;
				showGenericServerError(errorTitle, errorMessage, null, function () {
					if (cb) {
						cb(e);
					}
				});
			}
			else showGenericServerError(null, null, null, function () {
				if (cb) {
					cb(e);
				}
			});
		}
	}

	function showGenericServerError(title, message, buttons, cb) {
		if (!title) title = 'Server Error';
		if (!message) message = 'Oops, an unexpected server error occurred. You may try refreshing this page.';
		if (!buttons) buttons = [
			{label:'OK'}
		];
		if (!genericServerErrorDialog) {
			var genericServerErrorDialog = modalHelper.messageBox({title: title, message: message, buttons: buttons}, function () {
				genericServerErrorDialog = null;
				if (cb) {
					cb();
				}
			}, function(err){
				genericServerErrorDialog = null;
				if (cb) {
					cb(err);
				}
			});
		}
		return genericServerErrorDialog;
	}

	return {
		defaultServerErrorHandler: defaultServerErrorHandler,
		validationFaultServerErrorHandler:validationFaultServerErrorHandler,
		showGenericServerError: showGenericServerError
	}
});
