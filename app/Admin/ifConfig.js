var ifConfig = {
	insiderFocusApiBaseUrlSegment: 'http://localhost:7777/insiderfocus-api',

	defaultRoute: '/Home',
	adminHomeUrl: '/Home',
	AppName: 'insiderFocusApp',
	BackgroundColor: '#D8EFF8',
	domainName: 'insiderFocus.com'
};

if (typeof window === 'undefined')
	exports.ifConfig = ifConfig;