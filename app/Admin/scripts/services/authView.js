angular.module('adminWebApp.services').factory('authView', ['Auth', 'mtypes', 'accountFeatures', '$rootScope',
	function (Auth, mtypes, accountFeatures, $rootScope) {

		var tabs = {
			manageProfileTab: {name: 'ManageProfile', title: 'Manage Profile', contentSrc: 'pages/manageProfile/manageProfile.html', selected: false},
			manageSessionsTab: {name: 'ManageSessions', title: 'Manage Sessions', contentSrc: 'pages/manageSessions/manageSessions.html', selected: false},
			manageResourcesTab: {name: 'ManageResources', title: 'Manage Resources', contentSrc: 'pages/manageResources/manageResources.html', selected: false},

			reviewAndAddFeaturesTab: {name: 'reviewAndAddFeatures', title: 'Review and Add Features', contentSrc: 'pages/manageProfile/reviewAndAddFeatures.html', selected: false},
			changeContactDetailsTab: {name: 'changeContactDetails', title: 'Change Contact Details', contentSrc: 'pages/manageProfile/changeContactDetails.html', selected: false},
			changePaymentDetailsTab: {name: 'changePaymentDetails', title: 'Change Payment Details', contentSrc: 'pages/manageProfile/changePaymentDetails.html', selected: false},
			organizeAccountManagersTab: {name: 'organizeAccountManagers', title: 'Organize Account Managers', contentSrc: 'pages/manageProfile/organizeAccountManagers.html', selected: false},
			changeYourPasswordTab: {name: 'changePassword', title: 'Change Password', contentSrc: 'pages/manageProfile/changeYourPassword.html', selected: false},

			galleryTab: {name: 'gallery', title: 'Gallery', contentSrc: 'pages/manageResources/gallery1.html', selected: false},
			contactListsTab: {name: 'contactLists', title: 'Contact Lists', contentSrc: 'pages/manageResources/contactLists.html', selected: false},
			topicsTab: {name: 'topics', title: 'Topics', contentSrc: 'pages/manageResources/topics.html', selected: false},
			emailTemplatesTab: {name: 'emailTemplates', title: 'Email Templates', contentSrc: 'pages/manageResources/emailTemplates.html', selected: false},
			coloursGalleryTab: {name: 'coloursGallery', title: 'Colours Gallery', contentSrc: 'pages/manageResources/coloursGallery.html', selected: false},

			sbStep1: {name: 'step1', title: 'Edit Chat Session', contentSrc: 'pages/manageSessions/editChatSession.html', selected: false},
			sbStep2: {name: 'step2', title: 'Facilitator and Topics', contentSrc: 'pages/manageSessions/facilitatorAndTopics.html', selected: false},
			sbStep3: {name: 'step3', title: 'Manage Session Emails', contentSrc: 'pages/manageSessions/sessionEmails.html', selected: false},
			sbStep4: {name: 'step4', title: 'Manage Participants', contentSrc: 'pages/manageSessions/manageParticipants.html', selected: false},
			sbStep5: {name: 'step5', title: 'Manage Observers', contentSrc: 'pages/manageSessions/manageObservers.html', selected: false}

//			traineesTab: {name: 'trainees', title: 'Trainees', contentSrc: 'pages/series/seriesTrainees.html', selected: false,
//				subSelection: [
//					{name: 'addExistingTrainees', contentSrc: 'pages/users/inviteTrainees.html'},
//					{name: 'addNewUser', contentSrc: 'pages/users/addNewUser.html'},
//					{name: 'addYammerUsers', contentSrc: 'pages/yammer/yammerTrainees.html'},
//					{name: 'importXls', contentSrc: 'pages/users/xls/xls.html'}
//				]},
//			customizeTab: {name: 'customize', title: 'Customize', contentSrc: 'pages/series/seriesCustomize.html', selected: false,
//				subSelection: [
//					{name: 'emails', contentSrc: 'pages/series/seriesEmails.html'}
//				]},
//			customizeManagerTab: {name: 'customize', title: 'Customize', contentSrc: 'pages/series/seriesCustomizeManager.html', selected: false}
		};

		function isAccountManager() {
			return true;
			//return Auth.userRole() == mtypes.userPermissions.administrator;
		}

		function getAdvancedTrialDaysLeft() {
			if (!accountFeatures.advancedTierDaysLeft)
				return null;
			return accountFeatures.advancedTierDaysLeft;
		}

		function isInFeatureTrial() {
			var daysLeft = getAdvancedTrialDaysLeft();
			if (!daysLeft)
				return false;
			return daysLeft >= 0;
		}

		return {
			getHeaderTabs: function() {
				if (isAccountManager())
					return [tabs.manageProfileTab, tabs.manageSessionsTab, tabs.manageResourcesTab];
				else
					return [tabs.manageSessionsTab];
			},
			getManageProfileTabs: function () {
				return [tabs.reviewAndAddFeaturesTab, tabs.changeContactDetailsTab, tabs.changePaymentDetailsTab, tabs.organizeAccountManagersTab, tabs.changeYourPasswordTab];
			},
			getSessionBuilderSteps: function () {
				return [tabs.sbStep1, tabs.sbStep2, tabs.sbStep3, tabs.sbStep4, tabs.sbStep5];
			},
			getManageResourcesTabs: function () {
				return [tabs.galleryTab, tabs.contactListsTab, tabs.topicsTab, tabs.emailTemplatesTab, tabs.coloursGalleryTab];
			},

			isAdministrator: isAccountManager,

			isTrial: function () {
				return true;
				//return accountFeatures.pricingType == mtypes.pricingType.trial;
			},

			isInFeatureTrial: isInFeatureTrial,
			getAdvancedTrialDaysLeft: getAdvancedTrialDaysLeft,

			getManageAccountLink: function () {
				if (this.isAdministrator())
					return 'redirect';

				return 'modal';
			},

			getListOfRolesCurrentUserCanAdd: function () {
				// if roles are not available
				if (accountFeatures.maxTeamMembers <= 1)
					return [];

				// trainers and managers can only add trainees
				if (isAdmin() || isManager()) {
					return [];
				}

				if (isAdministrator()) {
					if (!_.contains(accountFeatures.features, mtypes.featureEntry.trainerPermissions)) {
						return [mtypes.userPermissions.trainee, mtypes.userPermissions.administrator];
					}

					return [
						mtypes.userPermissions.trainee,
						mtypes.userPermissions.manager,
						mtypes.userPermissions.trainer,
						mtypes.userPermissions.administrator
					];
				}

				return [];
			},

			getTrialDaysLeft: function () {
				if (accountFeatures.trialDaysLeft == null)
					return null;
				if (accountFeatures.trialDaysLeft < 0)
					return null;
				return accountFeatures.trialDaysLeft;

			},

			showUserPermissionsManagement: function () {
				return isAdministrator() &&
					accountFeatures.features.indexOf(mtypes.featureEntry.userMgmtRestrictions) != -1;
			},

			isActiveAdvancedtrial: function () {
				if (isInFeatureTrial()) {
					return getAdvancedTrialDaysLeft() > 0;
				}
				return false;
			}
		}
	}]);
