
angular.module('adminWebApp.services').factory('gridFormatters', function ($filter, mtypes, dateHelper, urlHelper) {
	var mtypeLabels = {};
	mtypeLabels[mtypes.sessionStatus.pending] = "Pending";
	mtypeLabels[mtypes.sessionStatus.open] = "Open";
	mtypeLabels[mtypes.sessionStatus.closed] = "Closed";

	function mtypeFormatter(value) {
		return mtypeLabels[value];
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

	function resourceNameFormatter(row, cell, value, columnDef, item) {
		if (item.metaType) return value;

		var downloadButtonClass = "btn btn-mini btn-info action action-download";     // change to Download class (add it)
		var deleteButtonClass = "btn btn-mini btn-info action action-delete";
		var downloadDisabled = '';
		var deleteDisabled = '';

//		if (!item.canBeDropped && !dropDisabled)
//			dropDisabled = " disabled";

		var tempResult = '<button' + deleteDisabled + ' class="' + deleteButtonClass + '">Drop</button>' +
			'<button' + downloadDisabled + ' class="' + downloadButtonClass + '">Download</button>';

		return '<span></span><div>' + value + '</div>' + tempResult;
	}

	function sessionNameFormatter(row, cell, value, columnDef, item) {
		if (item.metaType) return value;

		var copyButtonClass = "btn btn-mini btn-info action action-copy";
		var editButtonClass = "btn btn-mini btn-info action action-edit";     // change to Edit class (add it)
		var dropButtonClass = "btn btn-mini btn-info action action-delete";
		var copyDisabled = '';
		var editDisabled = '';
		var dropDisabled = '';

//		if (!item.canBeDropped && !dropDisabled)
//			dropDisabled = " disabled";

		var tempResult = '<button' + copyDisabled + ' class="' + copyButtonClass + '">Copy</button>' +
			'<button' + dropDisabled + ' class="' + dropButtonClass + '">Drop</button>' +
			'<button' + editDisabled + ' class="' + editButtonClass + '">Edit</button>';

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

	var gotoChatFormatter = function ( row, cell, value, columnDef, item) {
	    return '<a href="' + urlHelper.getApiUrl() + '/?id=55&sid=' + item['id'] + '">&#9654;</a>';     //TODO: no need to pass userId here [TM]
    };

	function sessionStatusFormatter(row, cell, value, columnDef, item) {
		return mtypeFormatter(value);
	}

	return {
		dateFormatterBasic: dateFormatterBasic,
		mtypeFormatter: mtypeFormatter,
		dateFormatter: dateFormatter,
		sessionNameFormatter: sessionNameFormatter,
		traineeEmailFormatter: traineeEmailFormatter,
		traineeEmailWithInviteFormatter: traineeEmailWithInviteFormatter,
		inviteFormatter: inviteFormatter,
		mtypeLabels: mtypeLabels,
		checkboxFormatter: checkboxFormatter,
		checkboxInviteFormatter: checkboxInviteFormatter,
		traineeImageFormatter: traineeImageFormatter,
		resourceNameFormatter: resourceNameFormatter,
		gotoChatFormatter: gotoChatFormatter,
		sessionStatusFormatter: sessionStatusFormatter
	};
});
