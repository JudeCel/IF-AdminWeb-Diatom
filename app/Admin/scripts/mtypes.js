angular.module('adminWebApp.consts').constant('mtypes', {
	accountStatus: {
		none: 0,
		active: 127000100,
		cancellationPending: 127000600,
		cancelled: 127000700,
		nonPayment: 127000200,
		trialExpired: 127000500
	},
	actionType: {
		none: 0,
		accountDeleted: 113013900,
		accountDisabled: 113007600,
		accountEnabled: 113007700
	},
	billingIntervalType: {
		none: 0,
		annual: 165000200,
		annualInvoiced: 165000300,
		monthly: 165000100
	},
	brandingColorScheme: {
		none: 0,
		blue: 102000100,
		green: 102000200,
		orange: 102000300
	},
	resourceType: {
		image: 103000100,
		brandLogo: 103000200,
		video: 103000300,
		audio: 103000400,
		document: 103000500
	},
	sessionStatus: {
		pending: 0,
		open: 166000100,
		closed: 166000200
	}
});
