var files = {
	'src': [
		'app/Admin/app.js',
		'app/Admin/scripts/mtypes.js',
		'app/Admin/scripts/gaConstants.js',
		'app/Admin/scripts/main.js',

		'app/Admin/pages/login/login.js',
		'app/Admin/pages/logout/logout.js',
		'app/Admin/pages/signUp/signUp.js',

		'app/Admin/pages/manageProfile/manageProfileCtrlResolver.js',
		'app/Admin/pages/manageProfile/manageProfile.js',
		'app/Admin/pages/manageProfile/changeContactDetails.js',
		'app/Admin/pages/manageProfile/organizeAccountManagers.js',

		'app/Admin/pages/users/usersResource.js',
		'app/Admin/pages/users/usersCtrlResolver.js',

		'app/Admin/pages/manageSessions/manageSessionsCtrlResolver.js',
		'app/Admin/pages/manageSessions/manageSessions.js',
		'app/Admin/pages/manageSessions/manageSessionsResource.js',
		'app/Admin/pages/manageSessions/editChatSession.js',
		'app/Admin/pages/manageSessions/manageParticipants.js',
		'app/Admin/pages/manageSessions/manageObservers.js',
		'app/Admin/pages/manageSessions/sessionEmails.js',
		'app/Admin/pages/manageSessions/facilitatorAndTopics.js',
		'app/Admin/pages/manageSessions/sessionResource.js',

		'app/Admin/pages/manageResources/manageResourcesCtrlResolver.js',
		'app/Admin/pages/manageResources/manageResources.js',
		'app/Admin/pages/manageResources/contactLists.js',
		'app/Admin/pages/manageResources/gallery.js',
		'app/Admin/pages/manageResources/topics.js',
		'app/Admin/pages/manageResources/coloursGallery.js',
		'app/Admin/pages/manageResources/addContact.js',
		'app/Admin/pages/manageResources/emailTemplates.js',

		'app/Admin/pages/footer/footer.js',
		'app/Admin/pages/header/header.js',
		'app/Admin/pages/title/title.js',

		'app/Admin/scripts/mtypes.js',

		'app/Admin/scripts/services/accountFeatures.js',
		'app/Admin/scripts/services/accountService.js',
		'app/Admin/scripts/services/logoutService.js',

		'app/Admin/scripts/services/authProvider.js',
		'app/Admin/scripts/services/authView.js',
		'app/Admin/scripts/services/dateHelper.js',

		'app/Admin/scripts/services/errorHandler.js',

		'app/Admin/scripts/services/gridFormatters.js',
		'app/Admin/scripts/services/fileUploaderHelper.js',
		'app/Admin/scripts/services/socketHelper.js',
		'app/Admin/scripts/services/navigationHelper.js',
		'app/Admin/scripts/services/gridUtils.js',
		'app/Admin/scripts/services/refreshSession.js',
		'app/Admin/scripts/services/userGridUtils.js',
		'app/Admin/scripts/services/validationService.js',
		'app/Admin/scripts/services/groupsService.js',
		'app/Admin/scripts/services/contactListsCtrlResolver.js',
		'app/Admin/scripts/directives/uiContactListSelect2.js'
	],

	'testSrc': [
		'test/ifConfig.js',
		'test/vendor/angular-mocks-FIX.js',
		'test/vendor/testabilityPatch.js',
		'test/spec/*.js',
		'test/spec/**/*.js'
	],

	'vendorSrc': [
		'app/Admin/scripts/vendor/browser-detect.js',
		'app/Admin/components/jquery/jquery.js',
		'app/Admin/components/underscore/underscore.js',
		'app/Admin/scripts/vendor/angular/angular.js',
		'app/Admin/scripts/vendor/angular-file-upload.js',
		'app/Admin/scripts/vendor/angular/angular-resource.js',
		'app/Admin/scripts/vendor/angular/angular-sanitize.js',
		'app/Admin/scripts/vendor/angular/angular-route.js',
		'app/Admin/scripts/vendor/angular-ui/common/module.js',
		'app/Admin/scripts/vendor/angularui-bootstrap/ui-bootstrap-custom-tpls-0.6.0.min.js',
		'app/Admin/scripts/vendor/socket.io.js',
		'app/Admin/scripts/vendor/angular-socket-io/socket.js'
	]
};

exports.files = files;
exports.mergeFiles = function mergeFiles() {
	var mergedFiles = [];

	[].splice.call(arguments, 0).forEach(function (file) {
		if (file.match(/karma/)) {
			mergedFiles.push(file);
		} else {
			files[file].forEach(function (f) {
				// replace @ref
				var match = f.match(/^\@(.*)/);
				if (match) {
					var deps = files[match[1]];
					mergedFiles = mergedFiles.concat(deps);
				} else {
					if (!/jstd|jasmine/.test(f)) {
						mergedFiles.push(f);
					}
				}
			});
		}
	});

	return mergedFiles;
};
exports.mergeFilesForCoverage = function mergeFilesForCoverage() {
	// need to pass the array
	var mergedFiles = [];

	[].splice.call(arguments, 0).forEach(function (file) {
		files[file].forEach(function (f) {
			// replace @ref
			var match = f.match(/^\@(.*)/);
			if (match) {
				var deps = files[match[1]];
				mergedFiles = mergedFiles.concat(deps);
			} else {
				if (!/jstd|jasmine/.test(f)) {
					mergedFiles.push(f)
				}
			}
		});
	});

	var coverageFiles = {};
	mergedFiles.forEach(function (key) {
		coverageFiles[key] = 'coverage';
	});

	return coverageFiles;
};
