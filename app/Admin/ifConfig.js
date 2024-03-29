var ifConfig = {
	insiderFocusApiBaseUrlSegment: 'http://localhost:7777/insiderfocus-api',
    uploadImageUrl: '/uploadImage',
    uploadPath: '/uploads',
    sessionLogoThumb: '_thumb',
    sessionLogoSize: 2,
	defaultRoute: '/Home',
	adminHomeUrl: '/Home',
    defaultSessionLogo: 'images/default_session_logo.png',
	AppName: 'insiderFocusApp',
	BackgroundColor: '#D8EFF8',
	domainName: 'insiderFocus.com',
	publicWebAppPort: 6600,
	apiPort: 7777,
	chatRoomPort: 3501
};

if (typeof window === 'undefined')
	exports.ifConfig = ifConfig;
