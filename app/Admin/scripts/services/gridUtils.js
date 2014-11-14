

angular.module('adminWebApp.services').factory('gridUtils', [function () {

	function showDatePicker(element, item, cb) {
		// Store callback and item.
		$(element).data('datePickerChangeDateCb', cb);
		$(element).data('datePickerGridItem', item);

		var now = new Date(Date.now());
		var startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
		startDate.setMinutes(startDate.getMinutes() - startDate.getTimezoneOffset()); // Make it the date we just set in UTC
		if(item.completionDeadline)
			$(element).datepicker({
				startDate: startDate,
				date: new Date(Date.parse(item.completionDeadline)),
				activeHighlight: true
			});
		else
			$(element).datepicker({
				startDate: startDate,
				activeHighlight: false
			});
		$(element).on('click', onDatePickerClick);
		$(element).on('hide', onDatePickerHide);
		$('.slick-viewport').data('openDatePicker', element);
		$('.slick-viewport').on('scroll', onDatePickerScroll);
		$(element).datepicker().on('changeDate', onDatePickerChangeDate);

		$(element).closest('.slick-row').addClass('highlightRow');

		setTimeout(function() {
			$(element).click();
		}, 1);
	};

	function onDatePickerClick (ev) {
		ev.stopPropagation();
		$(ev.target).off('click', onDatePickerClick);
	};

	function onDatePickerChangeDate (ev) {
		var cb = $(ev.target).data('datePickerChangeDateCb');
		var item = $(ev.target).data('datePickerGridItem');

		closeDatePicker(ev.target);

		var date = ev.date;
		var dateString = date.getUTCFullYear() + '/' + (date.getUTCMonth()+1) + '/' + date.getUTCDate();

		if(cb) cb(dateString, item);
	};

	function onDatePickerScroll (ev) {
		closeDatePicker($('.slick-viewport').data('openDatePicker'));
		$('.slick-viewport').data('openDatePicker', null);
	};

	function onDatePickerHide (ev) {
		closeDatePicker(ev.target);
	}

	function closeDatePicker (target) {
		$(target).datepicker('hide');
		$(target).datepicker('remove');
		$(target).off('click', onDatePickerClick);
		$(target).off('hide', onDatePickerHide);
		$(target).off('changeDate', onDatePickerChangeDate);
		$(target).closest('.slick-row').removeClass('highlightRow');
		$('.slick-viewport').off('scroll', onDatePickerScroll);
	}

	return {
		showDatePicker: showDatePicker
	};
}]);
