var ifConfig = {
	insiderFocusApiBaseUrlSegment: 'http://localhost:7777/insiderfocus-api',

	defaultRoute: '/Home',
	adminHomeUrl: '/Home',
	AppName: 'insiderFocusApp',
	BackgroundColor: '#D8EFF8',
	domainName: 'insiderFocus.com',
	publicWebAppPort: 6600
};

if (typeof window === 'undefined')
	exports.ifConfig = ifConfig;