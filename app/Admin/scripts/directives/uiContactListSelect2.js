angular.module('ui.directives')
	.controller('uiContactListSelect2Controller', function ($rootScope, $scope, $attrs, $parse, contactListsResource) {

		$scope.createContactListText = "Create new contact list: ";

		$scope.createNewGroup = function (groupName, cb) {
			var newGroup = { name: groupName };

			contactListsResource.addGroups([newGroup], function (res) {
				var group = {
					id: res.groups[0].id,
					text: res.groups[0].name
				};
				$scope.$emit('newContactListCreated', { id: group.id, name: group.text });
				$scope.allContactLists.push(group);
				cb(group);
			}, function (err) {
				cb();
			});
		};

		$scope.groupsQuery = function (query) {
			var data = {results: getAllResults(query.term, query.element)};
			query.callback(data);
		};

		$scope.allGroups = $scope.$eval($attrs.mfGroups) || [];


		$scope.$watch($attrs.mfGroups, function () {
			$scope.allContactLists = $scope.$eval($attrs.mfGroups) || [];
		});

		function getAllResults(term, elem) {
			if (!term || term.length == 0) {
				return $scope.allGroups;
			}

			var termLower = term.toLowerCase();

			var result = _.filter($scope.allGroups, function (item) {
				return item.text.toLowerCase().indexOf(termLower) >= 0;
			});

			if (!mfConfig.useGroupRestrictions) {
				var exists = _.find($scope.allGroups, function (item) {
					return item.text.toLowerCase() == (term || "").toLowerCase();
				});

				if ($.trim(term || "") && !exists) {
					var newItem = { id: -1, text: $scope.createGroupText + '"' + term + '"', value: $.trim(term)};
					if (elem.select2("container").hasClass('select2-drop-above')) {
						result.splice(0, 0, newItem);
					} else {
						result.push(newItem);
					}
				}
			}

			return result;
		}
	})
	.directive('uiContactListSelect2', ['ui.config', '$http', function (uiConfig) {
		var options = {};
		var  KEY = {
			TAB: 9,
			ENTER: 13 };
		if (uiConfig.select2) {
			angular.extend(options, uiConfig.select2);
		}
		return {
			require: '?ngModel',
			controller: 'uiContactListSelect2Controller',
			compile: function (tElm, tAttrs) {
				return function (scope, elm, attrs, controller) {
					// instance-specific options
					var opts = angular.extend({}, options, scope.$eval(attrs.uiGroupSelect2));

					var checkHighlightedValue = false;

					var KEY = {
						TAB: 9,
						ENTER: 13,
						ESC: 27,
						SPACE: 32,
						LEFT: 37,
						UP: 38,
						RIGHT: 39,
						DOWN: 40,
						SHIFT: 16,
						CTRL: 17,
						ALT: 18,
						PAGE_UP: 33,
						PAGE_DOWN: 34,
						HOME: 36,
						END: 35,
						BACKSPACE: 8,
						DELETE: 46,
						isArrow: function (k) {
							k = k.which ? k.which : k;
							switch (k) {
								case KEY.LEFT:
								case KEY.RIGHT:
								case KEY.UP:
								case KEY.DOWN:
									return true;
							}
							return false;
						}
					};

					opts.formatResult = function (result, container, query, escapeMarkup) {
						var markup = [];
						var term = $.trim(query.term || "");
						var text = result.text;


						var match = text.toUpperCase().indexOf(term.toUpperCase());

						if (result.id === -1) {
							match = result.value.toUpperCase().indexOf(term.toUpperCase());
							match += (scope.createGroupText + '"').length;
						}

						var tl = term.length;

						if (match < 0) {
							markup.push(escapeMarkup(text));
							return;
						}

						if (result.id === -1) {
							markup.push("<div style='font-weight: bold; text-decoration: underline'>");
						} else {

						}

						markup.push(escapeMarkup(text.substring(0, match)));
						markup.push("<span class='select2-match'>");
						markup.push(escapeMarkup(text.substring(match, match + tl)));
						markup.push("</span>");
						markup.push(escapeMarkup(text.substring(match + tl, text.length)));
						if (result.id === -1) {
							var len = (result.value || "").length;
							if (len >= 30 && len < 40) {
								markup.push("<span class='mf-text-length-near'>" + len + " / " + 40 + "</span>");
							} else if (len >= 40) {
								markup.push("<span class='mf-text-length-over'>" + len + " / " + 40 + "</span>");
							}
							markup.push("</div>")
						}
						return markup.join("");
					};


					opts.query = scope.groupsQuery;

					opts.initSelection = function (element, callback) {
						var ids = element.val().split(',');

						var data = _.filter(scope.allGroups, function (item) {
							return  _.contains(ids, item.id.toString());
						});

						callback(data);
					};

					opts.multiple = true;

					if (controller) {
						elm.bind("change", function (e) {
							e.stopImmediatePropagation();
							if (scope.$$phase || scope.$root.$$phase) {
								return;
							}
							scope.$apply(function () {
								controller.$setViewValue(elm.select2('data'));
							});
						});

						controller.$render = function(){
							if (!controller.$modelValue) {
								elm.select2('data', []);
							} else {
								elm.select2('data', controller.$modelValue);
							}
						};

						elm.on('select2-selecting', function (event) {
							var search = elm.select2("container").find("input.select2-input");
							if (event.val === -1) {
								scope.$apply(function () {
									scope.createNewGroup(event.object.value, function (res) {
										if (!res) {
											return;
										}
										var data = elm.select2('data');
										data.push(res);
										elm.select2('data', data);
										controller.$setViewValue(elm.select2('data'));
										search.val('');
										search.removeClass("select2-default");
										elm.select2('close');
										elm.select2('open');
									});
								});

								event.preventDefault();
							} else {
								if (opts.clearOnSelect){
									search.val('');
									search.removeClass("select2-default");
									elm.select2('close');
									elm.select2('open');
								}
							}


						});
					}

					elm.on('select2-highlight', function (e) {
						if (checkHighlightedValue && e.val === -1) {
							var select2 = elm.select2('container').data('select2');
							var choices = select2.findHighlightableChoices();
							if (choices.length > 1) {
								select2.moveHighlight(1);
							} else if (choices.length === 1) {
								$(choices[0]).removeClass('select2-highlighted');
							}
						}
					});

					attrs.$observe('disabled', function (value) {
						elm.select2(value && 'disable' || 'enable');
					});

					// Initialize the plugin late so that the injected DOM does not disrupt the template compiler
					setTimeout(function () {
						elm.select2(opts);

						elm.select2('val', scope.$eval(attrs.ngModel));

						var select2 = elm.select2('container').data('select2');

						select2.search.on('keydown', function (e) {
							if (!KEY.isArrow(e)) {
								checkHighlightedValue = true;
							} else if (e.which == KEY.UP || e.which == KEY.DOWN) {
								var index = select2.highlight();
								if (index === -1) {
									select2.highlight(0);
								}
							}
						});

						select2.search.on('keyup', function (e) {
							checkHighlightedValue = false;
						});
					});
				};
			}
		};
	}]);
