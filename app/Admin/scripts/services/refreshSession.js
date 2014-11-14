'use strict'
angular.module('adminWebApp.services').factory('refreshSession',
	['$rootScope', 'Auth', 'accountFeatures', 'accountService', 'mtypes',
	function ($rootScope, Auth, accountFeatures, accountService, mtypes) {

		return {
			refresh: function (options, successCb) {
				options = options || {
					ignoreInactiveAccount: false
				};
				accountService.getAccountInfo(options, function (res) {
					$rootScope.adminFirstName = res.firstName;
					$rootScope.adminLastName = res.lastName;
					$rootScope.adminEmail = res.email;
					$rootScope.accountId = res.accountId;
					$rootScope.userId = res.userId;

					$rootScope.ifConfig.accountStatus = res.accountStatus;
					$rootScope.ifConfig.accountCancellationDate = res.accountInfo.cancellationDate;
					$rootScope.ifConfig.features = res.accountFeatures;
					$rootScope.ifConfig.trialFeatures = res.accountTrialFeatures;

					accountFeatures.features = res.accountFeatures;
					accountFeatures.pricingType = res.accountInfo.pricingType;

					Auth.setUserPermissions(res.permissions);

					accountService.accountInfo = res.accountInfo;

					if(successCb) successCb(res);

				}, function (err) {
					if (!err.data) return;
					if (err.data.accountInactive && options.ignoreInactiveAccount)
						return true;
				});
			}
		};
	}]
);
