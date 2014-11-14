
angular.module('adminWebApp.services').factory('gridFormatters', function ($filter, mtypes, dateHelper) {
	var mtypeLabels = {};

	function mtypeFormatter(row, cell, value, columnDef, item) {
		var suffix = '';
		if (value == mtypes.courseStateStatus.invited && item.addedAfterCompletion)
			suffix = ' (after completion)';
		return mtypeLabels[value] + suffix;
	}

	function dateFormatterBasic(value) {
		return $filter('date')(value, 'dd-MMM-yyyy');
	}

	function dateFormatter(row, cell, value, columnDef, item) {
		return dateFormatterBasic(value);
	}

	function datetimeFormatter(row, cell, value, columnDef, item) {
		return $filter('date')(value, 'dd-MMM-yyyy h:mm a');
	}

	function inviteFormatter(row, cell, value, columnDef, item) {
		if (item.metaType.indexOf('courseRow') > -1) {
			return '<a ng-href class="action-retake">Reset</a>';
		}
		return dateFormatter(row, cell, value, columnDef, item);
	}

	function stringToDate(value) {
		var d = new Date(Date.parse(value));
		return dateFormatterBasic(d);
	}

	function traineeNameFormatter(row, cell, value, columnDef, item) {
		if (item.metaType) return value;

		var reinviteButtonClass = "btn btn-mini btn-info action action-reinvite";
		var remindButtonClass = "btn btn-mini btn-info action action-remind";
		var dropButtonClass = "btn btn-mini btn-info action action-delete";
		var remindText = "Remind";
		var reinviteText = "Reset";
		var remindDisabled = '';
		var dropDisabled = '';
		var reinviteDisabled = '';

		if (!item.canBeReinvited) {
			reinviteDisabled += ' disabled';
		}

		if (!item.canBeDropped && !dropDisabled)
			dropDisabled = " disabled";

		var tempResult = '<button' + dropDisabled + ' class="' + dropButtonClass + '">Drop</button>' +
			'<button' + remindDisabled + ' class="' + remindButtonClass + '">' + remindText + '</button>' +
			'<button' + reinviteDisabled + ' class="' + reinviteButtonClass + '">' + reinviteText + '</button>';

		return '<span></span><div>' + value + '</div>' + tempResult;
	}

	function traineeEmailFormatter(row, cell, value, columnDef, item) {
		if (!item.metaType) item.metaType = '';
		return item.metaType.indexOf('courseRow') > -1 ? courseStateStatusFormatter(row, cell, value, columnDef, item) : value;
	}

	function traineeEmailWithInviteFormatter(row, cell, value, columnDef, item) {
		if (!value) {
			return "";
		}
		var email = '<div class="inline-email tooltiped showWhenEllipsis" title="' + value + '">' + value + '</div>';
		return '<span class="email-cell-wrapper">' + email + '</span>';
	}

	function traineeImageFormatter(row, cell, value, columnDef, item) {
		return '<img src = "' + value + '"/>';
	}

	function checkboxFormatter(row, cell, value, columnDef, item) {
		var checked = item.selected || false;
		return checked ? '<input type="checkbox" checked></input>' : '<input type="checkbox"></input>';
	}

	function checkboxInviteFormatter(row, cell, value, columnDef, item) {
		var checked = item.selected || false;
		var disabled = ~[mtypes.courseStateStatus.invited, mtypes.courseStateStatus.started, mtypes.courseStateStatus.completed].indexOf(item.status);

		var result = '<input type="checkbox" ';
		result += checked ? ' checked' : '';
		result += disabled ? 'disabled' : '';
		return result + '></input>';
	}

	return {
		dateFormatterBasic: dateFormatterBasic,
		mtypeFormatter: mtypeFormatter,
		dateFormatter: dateFormatter,
		traineeNameFormatter: traineeNameFormatter,
		traineeEmailFormatter: traineeEmailFormatter,
		traineeEmailWithInviteFormatter: traineeEmailWithInviteFormatter,
		inviteFormatter: inviteFormatter,
		mtypeLabels: mtypeLabels,
		checkboxFormatter: checkboxFormatter,
		checkboxInviteFormatter: checkboxInviteFormatter,
		traineeImageFormatter: traineeImageFormatter
	};
});
