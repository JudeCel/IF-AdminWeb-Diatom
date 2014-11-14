
angular.module('adminWebApp.directives')
	.directive('mfGrid', function ($window, $timeout, $route) {
		return function (scope, elem, attrs) {
			elem.addClass('mf-grid');
			var throttled = _.throttle(function () {
				if (grid) grid.resizeCanvas();
			}, 50);

			scope.$on('resized', throttled);

			var grid;
			var dataView;
			var clickedRowIdx;
			var includeSelectCheckbox = false;
			var highlightId = 0;

			var _commands = {};
			scope.$watch(attrs.gridCommands, function (commands) {
				if (!commands)
					return;

				commands.hasChildren = function (parentItem) {
					return parentItem._expanded;
				};

				commands.setChildRows = function (parentItem, rows) {
					return setChildRows(parentItem, rows);
				};

				commands.removeChildRows = function (parentItem) {
					return removeChildRows(parentItem);
				};

				commands.setSortColumn = function (columnId, sortAsc) {
					grid.setSortColumn(columnId, sortAsc);
				};

				commands.sort = function () {
					var currentSortColumn;
					var sortColumns = grid.getSortColumns();
					if (sortColumns && sortColumns.length > 0) {
						currentSortColumn = sortColumns[0];
						grid.setSortColumn(currentSortColumn.columnId, currentSortColumn.sortAsc);
					}
					return currentSortColumn;
				};

				//This will trigger an actual sort of the data
				commands.reSort = function () {
					dataView.reSort();
				};

				commands.updateColumnHeader = function (html) {
					grid.updateColumnHeader("name", html);
				};

				commands.updateRow = function (item) {
					grid.invalidateRow(clickedRowIdx);
					grid.render();
				};

				commands.updateCell = function (row, cell){
					grid.updateCell(row, cell);
				};

				commands.updateAllRows = function () {
					grid.invalidate();
				};

				commands.setHeaderRowVisibility = function (visible) {
					grid.setHeaderRowVisibility(visible);
				};

				commands.updateItem = function (updatedItemId, updatedItem) {
					dataView.updateItem(updatedItemId, updatedItem);
				};

				commands.getItem = function (index) {
					return dataView.getItem(index);
				};

				commands.getActiveCell = function () {
					return grid.getActiveCell();
				};

				commands.getCellEditor = function () {
					return grid.getCellEditor();
				};

				commands.getEditController = function(){
					return grid.getEditController();
				}

				commands.setActiveCell = function (row, cell) {
					return grid.setActiveCell(row, cell);
				};

				commands.gotoCell = function (row, cell, forceEdit) {
					return grid.gotoCell(row, cell, forceEdit);
				};


				commands.editActiveCell = function (editor) {
					return grid.editActiveCell(editor);
				};

				commands.cleanSelection = function () {
					grid.setSelectedRows([]);
				};

				commands.getSelectedRows = function () {
					return grid.getSelectedRows();
				};

				commands.setSelectedRows = function (rows) {
					return grid.setSelectedRows(rows);
				};

				commands.navigateLeft = function () {
					return grid.navigateLeft();
				};

				commands.getColumns = function () {
					return grid.getColumns();
				};

				commands.setColumns = function (data) {
					grid.setColumns(data);
				};

				commands.scrollHighlightRowTop = function (item) {
					var newItem = dataView.getRowById(item);
					grid.scrollRowToTop(newItem);
				};

				commands.getItemById = function(id){
					var index = dataView.getIdxById(id);
					return dataView.getItem(index);
				}

				commands.getIdxById = function(id){
					return dataView.getIdxById(id);
				}

				commands.scrollItemIntoView = function (id) {
					if (!id) return;
					var row = dataView.getRowById(id);
					grid.scrollRowIntoView(row);
				};

				commands.beginUpdate = function () {
					dataView.beginUpdate();
				};

				commands.endUpdate = function () {
					dataView.endUpdate();
				};
				commands.highlightGridRow = function (id) {
					if (id == highlightId)
						return;

					if (highlightId) {
						var oldItem = dataView.getRowById(highlightId);
						highlightId = 0;
						if (oldItem >= 0) {
							grid.invalidateRow(oldItem);
						}
					}
					if (id) {
						highlightId = id;
						var newItem = dataView.getRowById(highlightId);
						grid.invalidateRow(newItem);
					}
					grid.render();
				};

				_commands = commands;
			});

			scope.$watch(attrs.mfGrid, function (info) {
				if (!info) return;

				elem.toggleClass('selectable-row', info.selectable);

				if (!dataView || !grid) {
					dataView = new Slick.Data.DataView();
					includeSelectCheckbox = info.includeSelectCheckbox;

					if (info.includeSelectCheckbox) {
						var checkboxSelector = new Slick.CheckboxSelectColumn({
							cssClass: info.options.selectCheckboxClass || "slick-cell-checkboxsel",
							width: 37,
							formatter: info.checkboxSelectionFormatter
						});
						info.columns.splice(0, 0, checkboxSelector.getColumnDefinition());
					}

					var options = angular.extend(
						{
							enableColumnReorder: false,
							rowHeight: 33
						}, info.options
					);

					grid = new Slick.Grid(elem, dataView, info.columns, options);
					grid.registerPlugin(new Slick.AutoTooltips());

					if (_commands.onGridCreated)
						_commands.onGridCreated();

					if (info.includeSelectCheckbox) {
						grid.setSelectionModel(new Slick.RowSelectionModel({selectActiveRow: false}));
						grid.registerPlugin(checkboxSelector);
					}

					var hasHeaderButtons = info.columns && _.find(info.columns, function (c) {
						return !!c.header;
					});

					if (hasHeaderButtons) {
						var headerButtonsPlugin = new Slick.Plugins.HeaderButtons();
						if (info.onColumnHeaderCommand) {
							headerButtonsPlugin.onCommand.subscribe(function (e, args) {
								info.onColumnHeaderCommand(e, args);
							});
						}
						grid.registerPlugin(headerButtonsPlugin);
					}


					if (info.onClick) {
						grid.onClick.subscribe(function (e, args) {
							var className = (e && e.target) ? e.target.className : '';
							var item = dataView.getItem(args.row);
							clickedRowIdx = args.row;
							if (item) {
								scope.$apply(function () {
									var updatedItem = info.onClick(item, className, e.target, args);
									if (updatedItem)
										dataView.updateItem(updatedItem.id, updatedItem);
								});
							}

							if (!options.selectable)
								e.stopImmediatePropagation();
						});
					}

					grid.onSort.subscribe(function (e, args) {
						if (info.onSort) {
							var sortCol = args.sortCols[0];
							info.onSort(sortCol.sortAsc, sortCol.sortCol.field);
						}

						var items = dataView.getItems();

						/* 1. Get all expanded rows */
						var expandedRows = $.grep(items, function (e) {
							return e._expanded == true
						});

						/* 2. Collect all their children and collapse expanded items */
						for (var i = 0; i < expandedRows.length; i++) {
							expandedRows[i].childRows = getChildRows(expandedRows[i], items);
							removeChildRows(expandedRows[i], items);
						}

						/* 3. Sort grid with all collapsed items */
						var cols = args.sortCols;
						dataView.sort(function (dataRow1, dataRow2) {
							for (var i = 0, l = cols.length; i < l; i++) {
								var field = cols[i].sortCol.field;
								var sign = cols[i].sortAsc ? 1 : -1;
								var result;
								if (cols[i].sortCol.sorter) {
									result = cols[i].sortCol.sorter(dataRow1, dataRow2) * sign;
								} else {
									var value1, value2;
									if (isNaN(dataRow1[field])) {
										value1 = dataRow1[field].toLowerCase();
									} else {
										value1 = dataRow1[field];
										if (value1 != null && value1 != undefined && !_.isNumber(value1) && value1.trim().length == 0)
											value1 = null;
									}
									if (isNaN(dataRow2[field])) {
										value2 = dataRow2[field].toLowerCase();
									} else {
										value2 = dataRow2[field];
										if (value2 != null && value2 != undefined && !_.isNumber(value2) && value2.trim().length == 0)
											value2 = null;
									}

									if (value1 == null && value2 != null) {
										result = 1 * sign;
									} else if (value1 != null && value2 == null) {
										result = -1 * sign;
									} else {
										result = (value1 == value2 ? 0 : (value1 > value2 ? 1 : -1)) * sign;
									}
								}

								if (result != 0) {
									return result;
								}
								else if (info.onEqualSort) {
									return info.onEqualSort(dataRow1, dataRow2);
								}
							}
							return 0;
						});

						/* 4. Restore expanded state for previously expanded items */
						for (i = 0; i < expandedRows.length; i++) {
							setChildRows(expandedRows[i], expandedRows[i].childRows, items);
							expandedRows[i].childRows = null;
						}

						grid.invalidate();
						grid.render();
					});

					//TODO: Make sure these dont leak!
					dataView.onRowCountChanged.subscribe(function (e, args) {
						if (info.onRowCountChanged) {
							info.onRowCountChanged(args, dataView.getRows());
						}

						grid.updateRowCount();
						grid.render();

					});

					grid.onBeforeCellEditorDestroy.subscribe(function(e, args){
						if(info.onBeforeCellEditorDestroy){
							info.onBeforeCellEditorDestroy(args);
							if(!scope.$$phase)
								scope.$apply();
						}
					});

					grid.onBeforeEditCell.subscribe(function(e, args){
						if(info.onBeforeEditCell){
							if(args.item && args.item.disableEdit && args.item.disableEdit == true){
								//if(args.row === args.item)
									return false;
							}
						}
					});

					grid.onSelectedRowsChanged.subscribe(function (e, args) {
						if (info.onSelectedRowsChanged) {
							var ids = getSelectedIds();
							info.onSelectedRowsChanged(args, ids);
							//this method might be called from both Angular world and outside of it.
							if (!scope.$$phase)
								scope.$apply();
						}
					});

					if (info.highlightRowsEnabled) {
						dataView.getItemMetadata = function (index) {
							var metadata = {};

							if (info.rowMetadataProvider) {
								metadata = info.rowMetadataProvider.call(dataView, index) || {};
							}

							var item = dataView.getItem(index);
							if (!item || !highlightId || item.id != highlightId) {
								return metadata;
							}
							metadata.cssClasses = 'highlightRow';
							return metadata;
						};
					}
					else if (info.rowMetadataProvider) {
						dataView.getItemMetadata = info.rowMetadataProvider;
					}

					dataView.onRowsChanged.subscribe(function (e, args) {
						if (info.onRowsChanged) {
							info.onRowsChanged(args, dataView.getRows());
						}
						grid.invalidateRows(args.rows);
						grid.render();
					});

					if (info.includeSelectCheckbox) {
						dataView.syncGridSelection(grid, true);
					}

					if (grid) {
						// Fix for FF resize bug
						$timeout(function () {
							if (!isFlex()){
								grid.resizeCanvas();
							}
						}, 250);
					}
				}

				dataView.beginUpdate();
				dataView.setItems(info.data);
				if (info.filterFn)
					dataView.setFilter(info.filterFn);
				dataView.endUpdate();
			});

			function isFlex(){
				return ($route && $route.current && $route.current.flex)
			}

			function getSelectedIds() {
				return dataView.mapRowsToIds(grid.getSelectedRows());
			}

			function removeChildRows(parentItem, items) {
				if (!items) items = dataView.getItems();
				var idx = dataView.getIdxById(parentItem.id) + 1;
				dataView.beginUpdate();
				while (idx < items.length && items[idx]._parent === parentItem) {
					dataView.deleteItem(items[idx].id);
				}
				parentItem._expanded = false;
				dataView.updateItem(parentItem.id, parentItem);
				dataView.endUpdate();
			}

			function getChildRows(parentItem, items) {
				return $.grep(items, function (e) {
					return e._parent === parentItem
				});
			}

			function setChildRows(parentItem, rows, items) {
				if (!items) items = dataView.getItems();
				var idx = dataView.getIdxById(parentItem.id) + 1;
				dataView.beginUpdate();
				while (idx < items.length && items[idx]._parent === parentItem) {
					dataView.deleteItem(items[idx].id);
				}
				_.each(rows, function (row) {
					row._parent = parentItem;
					if (idx >= items.length) {
						dataView.addItem(row);
					} else {
						dataView.insertItem(idx, row);
					}
					idx++;
				});
				parentItem._expanded = true;
				dataView.updateItem(parentItem.id, parentItem);
				dataView.endUpdate();

				scrollRowIntoView(rows);
			}

			function scrollRowIntoView(rows) {
				var rowIdxToScrollTo = clickedRowIdx + (rows.length <= 8 ? rows.length : 8);
				if (dataView.getRows().length >= rowIdxToScrollTo)
					grid.scrollRowIntoView(rowIdxToScrollTo, false);
			}

			scope.$watch(attrs.gridData, function (data) {
				if (!data) return;

				dataView.beginUpdate();
				dataView.setItems(data);
				dataView.endUpdate();
				grid.invalidate();
			});

			scope.$watch(attrs.gridFilterData, _.throttle(function (filterData) {
				//A scope.apply may sometimes be needed here because of the throttle?
				if (!filterData) return;

				dataView.setFilterArgs(filterData);

				dataView.refresh();
			}, 50));

			scope.forceGridResize = function () {
				throttled();
			};

			scope.getVisibleGridItems = function () {
				return dataView.getRows();
			};

			scope.toggleItemSelectionById = function (id) {
				var row = dataView.getRowById(id);
				var currentSelection = grid.getSelectedRows();
				var selectedIndex = _.indexOf(currentSelection, row);
				if (selectedIndex >= 0) {
					currentSelection.splice(selectedIndex, 1);
					grid.setSelectedRows(currentSelection);
				} else {
					grid.setSelectedRows(currentSelection.concat(row));
				}
			};

			scope.$on('$destroy', function () {
				if (grid) grid.destroy();
				_commands = {};
			});

		};
	}
);
