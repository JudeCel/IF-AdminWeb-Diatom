window.MF = window.MF || {};
window.MF.UriHelper = function () {
	return {
		build: function (baseUri, frags) {
			if (frags)
				return baseUri + '?' + frags.join('&');
			else
				return baseUri;
		},
		getDomain: function () {
			return "https://" + document.domain;
		},
		encode: function (uriToEncode) {
			return encodeURI(uriToEncode);
		},
		encodeComponent: function (uriComponentToEncode) {
			return encodeURIComponent(uriComponentToEncode);
		}
	};
}();