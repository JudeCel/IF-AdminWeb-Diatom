window.MF = window.MF || {};
window.MF.TextHelper = function () {
	return {
		truncateText: function (text, length) {
			if (text && text.length > length) {
				return text.substring(0, length) + "...";
			}
			else {
				return text;
			}
		}
	};
} ();