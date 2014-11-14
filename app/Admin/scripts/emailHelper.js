window.MF = window.MF || {};
window.MF.EmailHelper = function () {
	return {
		sendEmail: function (subject, body) {
			var resultUrl = "mailto:?subject=" + subject + "&body=" + body;
			window.location = resultUrl;
		}
	};
} ();