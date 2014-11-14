// WindowHelper
window.MF = window.MF || {};
window.MF.WindowHelper = {
	// Note: you must call this method from a user click action only.  
	// If this is called within a callback or on load, etc it will block the popup from opening.
	popup: function (url, w, h) {
		//var width = 626;  <-- SocialAPI width
		//var height = 436;  <-- SocialAPI height

		w = w || 875;
		h = h || 600;

		var windowOptions = "scrollbars=yes,resizable=yes,toolbar=no,status=no";
		var left = Math.round((screen.width / 2) - (w / 2));
		var top = 0;
		if (screen.height > h) {
			top = Math.round((screen.height / 2) - (h / 2));
		}

		return window.open(url, 'intent', windowOptions + ",width=" + w + ",height=" + h + ",left=" + left + ",top=" + top);
	},
	fetchSwf: function (movieName) {
		if (navigator.appName.indexOf("Microsoft") != -1) {
			return window[movieName];
		} else {
			return document[movieName];
		}
	}
};
