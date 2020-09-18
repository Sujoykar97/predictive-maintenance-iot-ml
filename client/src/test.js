(function () {
    'use strict';

    angular
        .module('charts.directives')
        .directive('utilizationChart', utilizationChart);

    utilizationChart.$inject = ['$compile'];

    function utilizationChart($compile) {
        var directive = {
            controllerAs: 'vm',
            controller: UtilizationChartController,
            restrict: 'E',
            templateUrl: 'scripts/charts/templates/utilization-multi-chart.html',
            scope: {
                config: '=',
                unlock: '=',
                range: '=',
                filter: '=',
                query: '=',
                refresh: '=',
                seriesInfo: '=',
                name: '=',
                refreshCallback: '=',
                repaint: '=',
                reloadtop: '&?',
                top10: '=?',
                drilldown: '=?',
                sync: '=?',
                syncCallback: '=?',
                chartSyncObject: '=?',
                showAutoScaleButton: '=',
                doAutoScale: '=',
                showMinMaxAvg: '=',
                minMaxAvg: '@',
                copyDateTimeDataInput: '=?',
                copyDateTimeDataOutput: '=?'
            },
            compile: function (element, attrs) {
                if (!attrs.pan || attrs.pan < 0) {
                    attrs.pan = 0;
                }
            }
        };
        return directive;
    }

    UtilizationChartController.$inject = ['$scope', '$attrs', 'ChartConfigBuilderService', 'APIService', 'i18nService', '$timeout', 'PersistenceService', 'ChartHelperService', 'CurrentTimeService', 'DateFormatService'];

    function UtilizationChartController($scope, $attrs, ChartConfigBuilderService, APIService, i18nService, $timeout, PersistenceService, ChartHelperService, CurrentTimeService, DateFormatService) {
        var vm = this;

        // var data = [{key: "2020-05-28T05:40:00.000Z", max: 97, value: 92},
        // {key: "2020-05-28T06:45:00.000Z", max: 97, value: 73},
        // {key: "2020-05-28T06:50:00.000Z", max: 97, value: 64.4},
        // {key: "2020-05-28T06:55:00.000Z", max: 97, value: 64.4},
        // {key: "2020-05-28T07:00:00.000Z", max: 97, value: 64.4},
        // {key: "2020-05-28T07:05:00.000Z", max: 97, value: 64.4},
        // {key: "2020-05-28T07:10:00.000Z", max: 97, value: 64.4},
        // {key: "2020-05-28T07:15:00.000Z", max: 97, value: 64.4},
        // {key: "2020-05-28T07:20:00.000Z", max: 97, value: 64.4},
        // {key: "2020-05-28T07:25:00.000Z", max: 97, value: 64.4},
        // {key: "2020-05-28T07:30:00.000Z", max: 97, value: 64.4}]


        // var data1= [];
        // var data2 = [];
        var labels = [];

        // for (let index = 0; index < data.length; index++) {

        // let temp = (new Date((data[index]['key'])));
        // labels.push(temp.getHours()+":"+temp.getMinutes())
        // data1.push(data[index]['value']);
        // data2.push(data[index]['max']);


        // }
        const canvas = document.getElementById('canvas');
        const ctx = canvas.getContext('2d');

        var chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [
                    {
                        data: [],
                        label: 'Percentage',
                        borderWidth: 2,
                        lineTension: 0,
                        borderColor: '#7cb5ec',
                        pointBackgroundColor: '#7cb5ec',
                        backgroundColor: 'transparent',
                        xAxisID: 'data1'
                    }

                ]
            },

            options: {
                responsive: true,
                scales: {
                    xAxes: [{
                        id: 'data1',
                        type: 'time',
                        distribution: 'series',
                        time: {
                            displayFormats: {
                                minute: 'h:mm'
                            }
                        }
                    }
                    ],
                    yAxes: [{
                        display: true,
                        ticks: {
                            suggestedMin: 0,    // minimum will be 0, unless there is a lower value.
                            // OR //
                            // beginAtZero: true   // minimum value will be 0.
                            suggestedMax: 100
                        }
                    }]
                },
                legend: {
                    display: true,
                    position: 'right',
                    // labels: {
                    // fontColor: 'rgb(255, 99, 132)'
                    // }
                },
                title: {
                    display: true,
                    text: 'Custom Chart Title',
                    position: 'top',
                    fontSize: 24,
                    fontColor: 'black',
                    padding: 20,
                    fontStyle: ''
                },
                plugins: {
                    zoom: {
                        pan: {
                            // Boolean to enable panning
                            enabled: true,

                            // Panning directions. Remove the appropriate direction to disable
                            // Eg. 'y' would only allow panning in the y direction
                            // A function that is called as the user is panning and returns the
                            // available directions can also be used:
                            //   mode: function({ chart }) {
                            //     return 'xy';
                            //   },
                            mode: 'x',

                            rangeMin: {
                                // Format of min pan range depends on scale type
                                x: null,
                                y: null
                            },
                            rangeMax: {
                                // Format of max pan range depends on scale type
                                x: null,
                                y: null
                            },

                            // On category scale, factor of pan velocity
                            speed: 20,

                            // Minimal pan distance required before actually applying pan
                            threshold: 10,

                        },

                        zoom: {
                            enabled: true,
                            drag: true,
                            mode: 'x',
                            rangeMin: {
                                // Format of min zoom range depends on scale type
                                x: null,
                                y: null
                            },
                            rangeMax: {
                                // Format of max zoom range depends on scale type
                                x: null,
                                y: null
                            },
                            speed: 0.1,

                            // Minimal zoom distance required before actually applying zoom
                            threshold: 2,

                            // On category scale, minimal zoom level before actually applying zoom
                            sensitivity: 3

                        }




                    }
                },
                annotation: {
                    // drawTime: 'afterDatasetsDraw', // (default)
                    // Array of annotation configuration objects
                    // See below for detailed descriptions of the annotation options
                    // drawTime: 'afterDatasetsDraw',
                    annotations: [{
                        type: 'line',
                        // optional annotation ID (must be unique)
                        id: 'max-line-h',
                        // set to 'vertical' to draw a vertical line
                        mode: 'horizontal',

                        // ID of the scale to bind onto
                        scaleID: 'y-axis-0',

                        // Data value to draw the line at
                        value: 0,

                        // Line color
                        borderColor: 'red',

                        // Line width
                        borderWidth: 2

                    },
                    {
                        type: 'line',
                        // optional annotation ID (must be unique)
                        id: 'max-line-v',
                        // set to 'vertical' to draw a vertical line
                        mode: 'vertical',

                        // ID of the scale to bind onto
                        scaleID: 'x-axis-0',

                        // Data value to draw the line at
                        value: 0,

                        // Line color
                        borderColor: 'red',

                        // Line width
                        borderWidth: 2

                    }
                    ]
                }

            }


        });

        vm.resetZoom = function () {
            chart.resetZoom();
        }






        // Chart synchronization support
        vm.doSync = $scope.sync;
        $scope.$watch('sync', function (newVal, oldVal) {
            vm.doSync = $scope.sync;
        });
        $scope.$watch('vm.doSync', function (newVal, oldVal) {
            $scope.sync = vm.doSync;
        });
        vm.noSyncFlag = false;
        var syncTimes = [0, 0];
        var newBetween = null;
        vm.persistenceLoaded = false;
        $scope.$watch('chartSyncObject', function (newVal, oldVal) {
            if (vm.doSync && $scope.chartSyncObject && $scope.chartSyncObject.chartId !== ($scope.chartId + "." + $scope.chartType + "." + $scope.seriesId)) {
                //console.log( "<<< SYNC IN: " + $scope.chartId + "." + $scope.chartType + "." + $scope.seriesId);
                vm.noSyncFlag = true;
                vm.timeFrom = $scope.chartSyncObject.timeFrom;
                vm.timeTo = $scope.chartSyncObject.timeTo;
                vm.dateFrom = $scope.chartSyncObject.dateFrom;
                vm.dateTo = $scope.chartSyncObject.dateTo;
                newBetween = $scope.chartSyncObject.filter.timestamp.between;
                vm.timeRangeSelected = $scope.chartSyncObject.timeRangeSelected;
                if (vm.timeRangeSelected === "custom") {
                    vm.setCustomDate();
                    vm.timeRangeChanged("load");
                    vm.hideCustomDates();
                } else {
                    vm.timeRangeChanged();
                    vm.saveChartInfo();
                }
            }
        });

        // Export chart date/time data for sending to another chart.
        if ($scope.copyDateTimeDataOutput) {
            $scope.$watchGroup(['vm.sliderValue', 'vm.customInterval', 'vm.timeRangeSelected', 'selectedRangeObj', 'vm.panOffset', 'vm.timeFrom', 'vm.timeTo', 'vm.dateFrom', 'vm.dateTo'], function (newValues, oldValues) {
                // Take the current settings, and save them for next time.
                $scope.copyDateTimeDataOutput.sliderValue = vm.sliderValue;
                $scope.copyDateTimeDataOutput.customInterval = vm.customInterval;
                $scope.copyDateTimeDataOutput.timeRangeSelected = vm.timeRangeSelected;

                if (vm.timeRangeSelected === "custom") {
                    if ($scope.selectedRangeObj.between && $scope.selectedRangeObj.between.length > 1) {
                        $scope.copyDateTimeDataOutput.from = $scope.selectedRangeObj.between[0]; // HERE IS THE RANGE
                        $scope.copyDateTimeDataOutput.to = $scope.selectedRangeObj.between[1];
                    }
                }
                $scope.copyDateTimeDataOutput.panOffset = vm.panOffset;
            });
        }

        vm.showAutoScaleButton = $scope.showAutoScaleButton;
        vm.doAutoScale = $scope.doAutoScale;
        vm.togleAutoScale = function () {
            vm.saveChartInfo(false); // With the true flag added, it will reload the chart after saving.
            vm.updateChart();
        };

        vm.toggleSync = function () {
            vm.doSync = !vm.doSync;
            if (vm.doSync) {
                // They are clicking the sync button on for THIS graph.
                // We need to trigger a reload, so it propagates the settings to the peer graphs.
                $timeout(function () {
                    // Trigger the reload outside of the current digest cycle, so the flags and sync object have
                    // time to propagate.
                    vm.noSyncFlag = false;
                    syncTimes = [0, 0];
                    vm.timeRangeChanged('drilldown');
                });
            }
        };

        vm.showMinMaxAvg = $scope.showMinMaxAvg;
        vm.minMaxAvg = $scope.minMaxAvg;
        vm.changeMinMaxAvg = function () {
            vm.saveChartInfo(false); // With the true flag added, it will reload the chart after saving.
            vm.refreshChart();
        };

        $scope.query = $attrs.query; // Fed into the API Service, one of loadAvg, commandsVolume, or commandsVolumeAvg.
        $scope.chartType = $attrs.type; // 'group' or 'device'... used for info storage and dynamic updates.
        $scope.chartId = $attrs.id; // used for info storage.
        vm.hasDrilldownBeenLoaded = false;
        if (!$scope.drilldown) {
            vm.hasDrilldownBeenLoaded = true;
        }
        vm.visibleSeries = { max_red_line: true }; // MAX Red line on by default.
        // Save the first config series object as a string since it is to be used as a template.
        vm.seriesTemplateObject = JSON.stringify($scope.config.series[0]);
        $scope.config.series = [];

        if ($attrs.id === 'groupsCombinedLoadChart_nShield' || $attrs.id === 'groupsCombinedLoadChart_clientHost') {
            $scope.config = ChartConfigBuilderService.build(['LINE-BASE-NSHIELD'], $scope.config);
        }
        else {
            $scope.config = ChartConfigBuilderService.build(['LINE-BASE'], $scope.config);
        }

        ChartHelperService.addChartZooming(vm, $scope);

        $scope.seriesId = "multi";
        // for group detail page we pass the group ID to chart diretive, the logic below exclude the chart from dashboard page
        if ($attrs.id != "groupsCombinedLoadChart" && $attrs.id != "groupsCombinedLoadChart_nShield") {
            if ($scope.seriesInfo.length === 1) {
                $scope.seriesId = $scope.seriesInfo[0].id;
            }
        }

        vm.refresh = $attrs.refresh;
        vm.refreshInterval = 0;
        vm.refreshTimer = undefined;
        if (angular.isDefined($scope.top10)) {
            $scope.$watch("top10", function (newVal, oldVal) {
                if (newVal && vm.timeRangeSelected === "custom") {
                    vm.setCustomDate();
                }
            });
        }
        $scope.$watch("seriesInfo", function (newVal, oldVal) {
            if (newVal !== oldVal) {
                updateChartSeries();

                // Need to update the visible series for the top 10 chart since it is not initially loaded
                // with data.
                if ($scope.top10) {
                    PersistenceService.getSavedChartInfo($scope.chartId, $scope.chartType, $scope.seriesId)
                        .then(function (loadData) {
                            updatePersistedVisibleSeries(loadData);
                        }, function (data) {
                            console.log("*** Failed to get saved Chart data for seriesInfo ***");
                            console.log(data);
                        });
                }
            }
        }, true);
        function updateChartSeries() {
            // Called when the series in a chart has changed.
            // We start out by clearing out any from the ng-config, and rebuilding them.
            $scope.config.series = [];

            // for group detail page we pass the group ID to chart diretive, the logic below exclude the chart from dashboard page
            if ($attrs.id != "groupsCombinedLoadChart" && $attrs.id != "groupsCombinedLoadChart_nShield") {
                if ($scope.seriesInfo.length === 1) {
                    $scope.seriesId = $scope.seriesInfo[0].id;
                }
            }

            if ($scope.seriesInfo) {
                // There needs to be a config.series object for each entry in the seriesInfo array.
                for (var si = 0; si < $scope.seriesInfo.length; si++) {
                    // Make an object based out of the object initially used to initialize this chart.
                    var newSeries = (vm.seriesTemplateObject ? JSON.parse(vm.seriesTemplateObject) : {});
                    newSeries.id = $scope.seriesInfo[si].id;
                    newSeries.name = $scope.seriesInfo[si].name;
                    newSeries.group = $scope.seriesInfo[si].group;
                    $scope.config.series.push(newSeries);
                    vm.visibleSeries[$scope.seriesInfo[si].name] = true;
                }
            }
        }

        //Utilization-only
        if (!$scope.config.options.plotOptions) {
            $scope.config.options.plotOptions = {};
        }
        var tmpOptions = {
            series: {
                noMaxLine: ($attrs.id === 'groupsCombinedLoadChart_nShield' || $attrs.id === 'groupsCombinedLoadChart_clientHost'),
                redLineGet: function () {
                    return vm.visibleSeries.max_red_line;
                },
                redLineSet: function (legendVisibility) {
                    if (legendVisibility === "hidden") {
                        vm.visibleSeries.max_red_line = false;
                        addMaxChartline("hide");
                    } else {
                        vm.visibleSeries.max_red_line = true;
                        addMaxChartline("show");
                    }

                    vm.saveChartInfo(false);

                    if (vm.doAutoScale) {
                        vm.updateChart();
                    }
                },
                events: {
                    hide: function () {
                        vm.visibleSeries[this.name] = false;
                        vm.saveChartInfo(false);
                        for (var t = 0; t < $scope.config.series.length; t++) {
                            //Highcharts-ng's config doesn't track the visible state, but that's the only config object we can access.
                            //Find the matching series and track it manually.
                            if ($scope.config.series[t].name === this.name) {
                                $scope.config.series[t].visible = false;
                            }
                        }
                        //Only recalc if the group/device that was hidden is the one tied to the max val line
                        if ($scope.config.yAxis.plotLines.length > 0 && this.name === $scope.config.yAxis.plotLines[0].name) {
                            addMaxChartline("hide");
                        }
                        if (vm.doAutoScale) {
                            vm.updateChart();
                        }
                    },
                    show: function () {
                        //Always recalc when showing another line
                        vm.visibleSeries[this.name] = true;
                        vm.saveChartInfo(false);
                        for (var t = 0; t < $scope.config.series.length; t++) {
                            //Highcharts-ng's config doesn't track the visible state, but that's the only config object we can access.
                            //Find the matching series and track it manually.
                            if ($scope.config.series[t].name === this.name) {
                                $scope.config.series[t].visible = true;
                            }
                        }
                        addMaxChartline("show");
                        if (vm.doAutoScale) {
                            vm.updateChart();
                        }
                    }
                }
            }
        };
        $.extend(true, $scope.config.options.plotOptions, tmpOptions);

        // BEGIN custom interval support ----------------------------------------------------------------

        vm.customIntervalPeriods = [
            { name: "Minute(s)", suffix: "m", min: 1, max: 60, enabled: true },
            { name: "Hour(s)", suffix: "h", min: 1, max: 24, enabled: true },
            { name: "Day(s)", suffix: "d", min: 1, max: 90, enabled: true }
        ];

        var intervalBreakers = {
            minutes: [60, 50, 45, 40, 30, 20, 15, 10, 5, 4, 3, 2, 1],
            hours: [24, 18, 16, 12, 8, 6, 4, 3, 2, 1]
        };

        vm.customInterval = {
            value: "",
            period: undefined,
        };

        vm.onCustomIntervalPeriodChanged = function () {
            if (vm.customInterval.period) {
                if (vm.customInterval.value < vm.customInterval.period.min) {
                    vm.customInterval.value = vm.customInterval.period.min;
                }
                if (vm.customInterval.value > vm.customInterval.period.max) {
                    vm.customInterval.value = vm.customInterval.period.max;
                }
            }
        };

        vm.getBreaker = function (key, val) {
            if (key === "days") {
                //Accept any day increment up to 1 week
                if (val <= 7) {
                    return val;
                } else {
                    var tmp = val - val % 5;
                    //If the rounded value would be less than 1 week (ie, 8 days would become 5), set it to 1 week
                    if (tmp < 7) {
                        return 7;
                    } else {
                        return tmp;
                    }
                }
            } else {
                for (var i in intervalBreakers[key]) {
                    if (val > intervalBreakers[key][i]) {
                        return intervalBreakers[key][i];
                    }
                }
                return 1;
            }
        };

        vm.calculateCustomIntervals = function () {
            var moment_from = moment(vm.dateFrom);
            var moment_to = moment(vm.dateTo);
            //Look at abs in case they reverse from and to (check occurs before this is fixed in the Apply call)
            var minute_total = Math.abs(moment_to.diff(moment_from, "minutes", true));
            var hour_total = Math.abs(moment_to.diff(moment_from, "hours", true));
            var day_total = Math.abs(moment_to.diff(moment_from, "days", true));
            var max_points = 100; // In case we decide to change this later.
            //Disable minute selection if it would always result in > max_points
            if (minute_total > 60 * max_points) {
                vm.customIntervalPeriods[0].enabled = false;
            } else {
                //Largest must always be small enough to give two points
                //Smallest must not exceed max_points
                vm.customIntervalPeriods[0].max = vm.getBreaker("minutes", Math.floor(minute_total / 2));
                vm.customIntervalPeriods[0].min = vm.getBreaker("minutes", Math.floor(minute_total / max_points));
                vm.customIntervalPeriods[0].enabled = true;
            }
            //Disable hour selection if it would always result in > max_points points or the range is too small
            if (hour_total > 24 * max_points || hour_total < 2) {
                vm.customIntervalPeriods[1].enabled = false;
            } else {
                //Largest must always be small enough to give two points
                //Smallest must not exceed max_points
                vm.customIntervalPeriods[1].max = vm.getBreaker("hours", Math.floor(hour_total / 2));
                vm.customIntervalPeriods[1].min = vm.getBreaker("hours", Math.floor(hour_total / max_points));
                vm.customIntervalPeriods[1].enabled = true;
            }
            //Disable day selection if the range is too small
            if (day_total < 2) {
                vm.customIntervalPeriods[2].enabled = false;
            } else {
                //Largest must always be small enough to give two points
                //Smallest must not exceed max_points
                vm.customIntervalPeriods[2].max = vm.getBreaker("days", Math.floor(day_total / 2));
                vm.customIntervalPeriods[2].min = vm.getBreaker("days", Math.floor(day_total / max_points));
                vm.customIntervalPeriods[2].enabled = true;
            }
            if (!vm.customInterval.period || !vm.customInterval.period.enabled) {
                vm.customInterval.period = vm.getStartingInterval();
            }
            vm.onCustomIntervalPeriodChanged();
        };

        vm.getStartingInterval = function () {
            for (var i in vm.customIntervalPeriods) {
                if (vm.customIntervalPeriods[i].enabled) {
                    return vm.customIntervalPeriods[i];
                }
            }
            return undefined;
        };

        $scope.$watch("vm.dateFrom", function () {
            if (vm.showCustomDates) {
                var maxTime = CurrentTimeService.getCurrentDate();
                //var maxTime = new Date(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(),  now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds());
                if (vm.dateFrom > maxTime) {
                    vm.dateFrom = maxTime;
                }
                vm.calculateCustomIntervals();
            }
        });
        $scope.$watch("vm.dateTo", function () {
            if (vm.showCustomDates) {
                var maxTime = CurrentTimeService.getCurrentDate();
                //var maxTime = new Date(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(),  now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds());
                if (vm.dateTo > maxTime) {
                    vm.dateTo = maxTime;
                }
                vm.calculateCustomIntervals();
            }
        });

        // END custom interval support ----------------------------------------------------------------

        // BEGIN date picker support --------------------------------------------------------
        vm.showCustomDates = false;
        vm.today = CurrentTimeService.getCurrentDate();
        vm.dateFrom = angular.copy(vm.today);
        vm.dateFrom.setDate(vm.dateFrom.getDate() - 10);
        vm.dateTo = angular.copy(vm.today);
        vm.showStop = false;
        vm.openedFrom = false;
        vm.openedTo = false;
        vm.showApply = false;
        vm.dateOptions = {
            formatYear: 'yy',
            startingDay: 1 // Set to 0 for popup calendar to start from Sunday instead of Monday.
        };
        vm.calculateCustomIntervals();
        vm.disabled = function () { return false; };
        vm.showCalendar = false;
        vm.dateChanged = function () {
            console.log("Date changed! ");
            vm.calculateCustomIntervals();
        };
        // Function that opens the pop-up date picker.
        vm.open = function ($event, fromOrTo) {
            $event.preventDefault();
            $event.stopPropagation();
            vm.showApply = true;
            if (fromOrTo === 0) {
                vm.openedFrom = true;
            } else {
                vm.openedTo = true;
            }
            vm.showCalendar = true;
        };
        function dateFormat(date) {
            //return $filter('date')(date, "MM/dd/yyyy HH:mm:ss 'UTC'");
            return DateFormatService.formatDate(date, null, true);
        }
        vm.hideCustomDates = function () {
            vm.showCustomDates = false;
            vm.showApply = false;
        };

        vm.toggleCustomDates = function () {
            vm.showCustomDates = true;
            vm.showApply = true;
        };

        // Pull the dates from the date objects and load them into the time range selector.
        vm.setCustomDate = function (searchFlag) {
            if (vm.dateFrom.getTime() > vm.dateTo.getTime()) {
                // Wrong, dates gotta go from < to, so switch them.
                var temp = vm.dateFrom;
                vm.dateFrom = vm.dateTo;
                vm.dateTo = temp;
            }
            //console.log( "From date: " + vm.dateFrom.getTime() );
            //console.log( "To date:   " + vm.dateTo.getTime() );
            vm.timeRangeOptions[4].name = dateFormat(vm.dateFrom) + ' - ' + dateFormat(vm.dateTo);
            vm.timeRangeOptions[4].between[0] = vm.dateFrom.getTime();
            vm.timeRangeOptions[4].between[1] = vm.dateTo.getTime();
            if (searchFlag) {
                vm.timeRangeChanged(searchFlag);
            } else {
                vm.timeRangeChanged('load'); // Trigger a reload, and save the settings.
            }
        };

        // END date picker support --------------------------------------------------------

        // BEGIN slider support ----------------------------------------------------------------
        vm.sliderOptions = {
            step: 1,
            stepsArray: ["1d", "12h", "6h", "3h", "1h", "30m", "10m", "5m"],
            showSelectionBar: true,
            showTicks: true,
            floorCeilLabelsBelow: true,
            translate: function (value, sliderId, label) {
                var temp;
                var str = value;
                var denomIdx = value.length - 1;
                switch (value.charAt(denomIdx)) {
                    case 'm':
                        temp = value.substring(0, denomIdx);
                        if (temp === '1') {
                            str = temp + " min";
                        } else {
                            str = temp + " mins";
                        }
                        break;
                    case 'h':
                        temp = value.substring(0, denomIdx);
                        if (temp === '1') {
                            str = temp + " hour";
                        } else {
                            str = temp + " hours";
                        }
                        break;
                    case 'd':
                        temp = value.substring(0, denomIdx);
                        if (temp === '1') {
                            str = temp + " day";
                        } else {
                            str = temp + " days";
                        }
                        break;
                    case 'w':
                        temp = value.substring(0, denomIdx);
                        if (temp === '1') {
                            str = temp + " week";
                        } else {
                            str = temp + " weeks";
                        }
                        break;
                    default: break;
                }
                if (label === 'model') {
                    return "<b>" + str + "</b>";
                } else {
                    return str;
                }
            }
        };

        vm.sliderValue = vm.sliderOptions.stepsArray[vm.sliderOptions.stepsArray.length - 1];
        $scope.$watch("vm.sliderValue", function (oldVal, newVal) {
            if (oldVal !== newVal) {
                vm.onUpdateInterval();

            }
        });
        // END slider support ----------------------------------------------------------------

        vm.timeRangeSelected = $scope.range;
        vm.timeRangeOptions = [
            { id: "last_hour", name: 'Last Hour', offset: (1000 * 60 * 60) },
            { id: "last_day", name: 'Last 24 Hours', offset: (1000 * 60 * 60 * 24) },
            { id: "last_week", name: 'Last 7 Days', offset: (1000 * 60 * 60 * 24 * 7) },
            { id: "last_month", name: 'Last 30 Days', offset: (1000 * 60 * 60 * 24 * 30) },
            { id: "custom", name: 'Custom Range', between: [0, 0] }
        ];
        vm.getTimeRange = function () {
            for (var i = 0; i < vm.timeRangeOptions.length; i++) {
                if (vm.timeRangeOptions[i].id === vm.timeRangeSelected) {
                    return vm.timeRangeOptions[i];
                }
            }
            return null;
        };
        $scope.selectedRangeObj = vm.getTimeRange();

        // Callback for when the time range select object changes.
        vm.timeRangeChanged = function (saveFlag) {
            $scope.selectedRangeObj = vm.getTimeRange();
            if ($scope.selectedRangeObj) {
                // Update the filter...
                var now = CurrentTimeService.getCurrentTime();
                var from = 0;
                var to = 0;
                if ($scope.selectedRangeObj.id === "custom") {
                    from = $scope.selectedRangeObj.between[0];
                    to = $scope.selectedRangeObj.between[1];
                    if (!from && !to) {
                        vm.setCustomDate();
                        return;
                    }
                    if (saveFlag !== 'drilldown') {
                        vm.showCustomDates = true;
                    }
                    vm.showCalendar = true;
                    vm.stopRefreshTimer(); // Static time ranges don't update.

                    $scope.filter.timestamp.between = [DateFormatService.getUtcToLocalTime(from), DateFormatService.getUtcToLocalTime(to)];
                } else {
                    to = now;
                    from = now - $scope.selectedRangeObj.offset;
                    vm.showCustomDates = false;
                    vm.showCalendar = false;
                    vm.startRefreshTimer(); // Canned up-to-now ranges do update.

                    $scope.filter.timestamp.between = [from, to];
                }

                vm.timeFrom = from;
                vm.timeTo = to;

                // The slider's range values may need to change here.
                // the scale used depends on the time span selected.  It doesn't make sense to allow for
                // a 1m interval in a chart that spans 6 months.
                // Time to do some math.
                // We only care about the line charts... the bar chart stays the same.
                var span = to - from;

                if (span <= (1000 * 60 * 60)) { // one hour
                    vm.sliderOptions.stepsArray = ['15m', '12m', '10m', '8m', '5m', '3m', '1m'];
                } else if (span <= (1000 * 60 * 60 * 24)) { // one day
                    vm.sliderOptions.stepsArray = ['6h', '4h', '2h', '1h', '45m', '30m', '15m', '10m', '5m'];
                } else if (span <= (1000 * 60 * 60 * 24 * 7)) { // one week
                    vm.sliderOptions.stepsArray = ['2d', '1d', '12h', '6h', '3h', '1h', '30m', '15m'];
                } else if (span <= (1000 * 60 * 60 * 24 * 30)) { // One month
                    vm.sliderOptions.stepsArray = ['1w', '5d', '3d', '1d', '12h', '8h', '6h', '3h', '1h'];
                } else if (span <= (1000 * 60 * 60 * 24 * 180)) { // Size months
                    vm.sliderOptions.stepsArray = ['4w', '2w', '1w', '3d', '1d', '12h', '8h', '4h', '1h'];
                } else {
                    // Big...
                    vm.sliderOptions.stepsArray = ['4w', '2w', '1w', '3d', '1d'];
                }

                ChartHelperService.getNearestSliderValue(vm);

                if (panSetting && !vm.copyingChartDateTimeData) {
                    // When this code gets called, reset the panning offset.
                    // It means that either the graph is loading for the first time, or the time range pull down has changed.
                    vm.panOffset = 0;
                }

                // Go get the data...
                vm.updateChart(saveFlag);
                saveDrilldownInfo();
                if (saveFlag != undefined && saveFlag !== 'drilldown') {
                    // Save the new settings...
                    vm.saveChartInfo();
                }
                return;
            }
        };

        // Re-format the title for the chart with dynamic data, and display it.
        vm.updateChartTitle = function () {
            if (typeof ($scope.name) !== 'undefined') {
                if ($scope.selectedRangeObj) {
                    if ($scope.config.title) {
                        if ($attrs.id === 'groupsCombinedLoadChart' || $attrs.id === 'groupsCombinedLoadChart_top10' || $attrs.id === 'groupsCombinedLoadChart_custom' || $attrs.id === 'groupsCombinedLoadChart_groupAverage' || $attrs.id === 'deviceLoadChart') {
                            $scope.config.title.text = i18nService.text('charts.load_chart.title', { __name__: $scope.name, __range__: $scope.selectedRangeObj.name });
                            chart.options.title.text = i18nService.text('charts.load_chart.title', { __name__: $scope.name, __range__: $scope.selectedRangeObj.name });
                        }
                        else if ($attrs.id === 'groupsCombinedLoadChart_nShield' || $attrs.id === 'groupsCombinedLoadChart_clientHost') {
                            $scope.config.title.text = i18nService.text('charts.load_chart_nShield.title', { __name__: $scope.name, __range__: $scope.selectedRangeObj.name });
                            chart.options.title.text = i18nService.text('charts.load_chart_nShield.title', { __name__: $scope.name, __range__: $scope.selectedRangeObj.name });
                        }
                        else
                            console.log("Error in utilization-chart invalid attrs.id=", $attrs.id);
                    }
                }
            }
        };

        $scope.$watch('name', function () {
            // When the name finally loads up, change the title of the chart to reflect it.
            vm.updateChartTitle();
        });
        vm.refreshChart = function () {
            vm.timeRangeChanged('refresh');
        };
        vm.onTimeRangeChanged = function () {
            vm.timeRangeChanged('load');
        };

        function updatePersistedVisibleSeries(loadData) {
            var savePersistenceBecauseDataChanged = false;

            if (loadData.visibleSeries) {
                // Add any new groups to visibility that are not in the persisted data.
                // This occurs when a new group has been created since the last time the chart
                // was persisted.
                for (var vName in vm.visibleSeries) {
                    if (loadData.visibleSeries[vName] === undefined) {
                        // Not found so add it.
                        loadData.visibleSeries[vName] = true;
                        savePersistenceBecauseDataChanged = true;
                    }
                }

                // Remove any groups from visibility that are in the persisted data but do not exist anymore.
                // This occurs when a group has been deleted since the last time the chart
                // was persisted.
                for (var lName in loadData.visibleSeries) {
                    if (vm.visibleSeries[lName] === undefined) {
                        // Not found so add to remove list.
                        delete loadData.visibleSeries[lName];
                        savePersistenceBecauseDataChanged = true;
                    }
                }

                vm.visibleSeries = angular.copy(loadData.visibleSeries);
            }

            return savePersistenceBecauseDataChanged;
        }

        vm.copyingChartDateTimeData = false;
        vm.initializeChart = function (context) {
            if (vm.hasDrilldownBeenLoaded) {
                // a new chart is being displayed, check the DB to see if there are any custom
                // settings.  If not, just leave the default in the parent controller.
                PersistenceService.getSavedChartInfo($scope.chartId, $scope.chartType, $scope.seriesId)
                    .then(getDataOK, getDataERROR);
            } else {
                vm.setDrilldownInfo();
                vm.hasDrilldownBeenLoaded = true;
                vm.timeRangeChanged();
            }
            function getDataOK(persistedData) {

                var loadData = persistedData;

                // This gets set to true if a group has been added or removed since the last time
                // persistence was updated.
                var savePersistenceBecauseDataChanged = false;

                if ($scope.copyDateTimeDataInput) {
                    // Prevent timeRangeChanged from resetting panOffset to 0.
                    vm.copyingChartDateTimeData = true;

                    loadData = $scope.copyDateTimeDataInput;

                    if ($scope.copyDateTimeDataInput.panOffset !== undefined) {
                        vm.panOffset = $scope.copyDateTimeDataInput.panOffset;
                        checkPanButtons(true);
                    }
                }

                if (loadData === undefined || Object.keys(loadData).length == 0) {
                    vm.timeRangeChanged();
                    vm.persistenceLoaded = true;
                    return;
                }
                // Set the slider to where it was
                if (loadData.sliderValue) {
                    vm.sliderValue = loadData.sliderValue;
                }
                // Set any custom intervals
                if (loadData.customInterval && loadData.customInterval.period) {
                    for (var i in vm.customIntervalPeriods) {
                        if (vm.customIntervalPeriods[i].name === loadData.customInterval.period.name) {
                            // It's THIS One... copy over the dynamic fields.
                            // DO NOT replace the object, or the template will not work.
                            vm.customInterval.period = vm.customIntervalPeriods[i];
                            vm.customInterval.period.min = loadData.customInterval.period.min;
                            vm.customInterval.period.max = loadData.customInterval.period.max;
                            vm.customInterval.period.enabled = loadData.customInterval.period.enabled;
                            break;
                        }
                    }
                    vm.customInterval.value = loadData.customInterval.value;
                }
                // If there is anything, we apply it here.
                // Check for valid data though, so undefined's aren't stuffed into places they shouldn't go.
                if (loadData.timeRangeSelected) {
                    vm.timeRangeSelected = loadData.timeRangeSelected;
                }
                if (vm.timeRangeSelected === "custom") {
                    vm.dateFrom = new Date(loadData.from);
                    vm.dateTo = new Date(loadData.to);
                    vm.timeRangeOptions[4].between[0] = loadData.from;
                    vm.timeRangeOptions[4].between[1] = loadData.to;
                    vm.timeRangeOptions[4].name = dateFormat(vm.dateFrom) + ' - ' + dateFormat(vm.dateTo);

                    // no need to re-assign the customInterval period and value, this causes persistence data to get saved again.
                    //vm.customInterval.period = false;
                    //vm.customInterval.value = 0;

                    vm.calculateCustomIntervals();
                    $scope.selectedRangeObj = vm.getTimeRange();
                    // Make the interval as small as allowed for this time span.
                    vm.onUpdateInterval();
                }
                if (loadData.doAutoScale) {
                    vm.doAutoScale = loadData.doAutoScale;
                }
                if (loadData.minMaxAvg) {
                    vm.minMaxAvg = loadData.minMaxAvg;
                }
                // Flag must be set after all values are set,
                // Otherwise data is overwritten when savePersistence is called
                vm.persistenceLoaded = true;
                // The top10 loads it seriesInfo later.  The watch on that variable
                // will update the persisted visible series.
                if (!$scope.top10) {
                    savePersistenceBecauseDataChanged = updatePersistedVisibleSeries(loadData);
                }

                // Update the chart with the saved data.
                vm.timeRangeChanged(context);

                if ($scope.copyDateTimeDataInput) {
                    // Re-enable usual behavior.
                    $timeout(function () {
                        vm.copyingChartDateTimeData = false;
                    });
                } else {
                    if (savePersistenceBecauseDataChanged) {
                        vm.saveChartInfo(false);
                    }
                }
            }
            function getDataERROR(data) {
                console.log("*** Failed to get saved Chart data ***");
                console.log(data);
                vm.timeRangeChanged(context);
            }

            // watching for deviceId list change made from the group.html top10 and custom pages, reload the config/filter and update the chart.
            // NOTE do this after the controller is loaded otherwise it will keep getting called.
            if ($scope.query === "loadAvgGroupDevices") {
                $scope.$watch("filter.deviceId", function (newVal, oldVal) {
                    //console.log('watch filter.deviceId........filter='); console.log($scope.filter);
                    if (newVal && oldVal) {
                        // compare the deviceId arrays (do not use '===')
                        var arrayIsSame = (newVal.length == oldVal.length) && newVal.every(function (element, index) {
                            return element === oldVal[index];
                        });
                        if (!arrayIsSame) {
                            //console.log('cku3 watch on filter.deviceId...................');
                            //console.log('newVal='); console.log(newVal);
                            //console.log('oldVal='); console.log(oldVal);
                            vm.updateChart();
                        }
                    }

                });
            }
        };

        vm.saveChartInfo = function (autoreload) {
            if (!vm.persistenceLoaded) {
                // If persistence data hasn't been loaded yet, don't do anything.
                return;
            }
            // Take the current settings, and save them for next time.
            var obj = {
                timeRangeSelected: vm.timeRangeSelected,
                sliderValue: vm.sliderValue,
                customInterval: vm.customInterval,
                doAutoScale: vm.doAutoScale,
                minMaxAvg: vm.minMaxAvg
            };
            if (vm.timeRangeSelected === "custom") {
                if ($scope.selectedRangeObj.between && $scope.selectedRangeObj.between.length > 1) {
                    obj.from = $scope.selectedRangeObj.between[0]; // HERE IS THE RANGE
                    obj.to = $scope.selectedRangeObj.between[1];
                }
            }

            if ($scope.seriesInfo) {
                // Top 10 is set when the seriesInfo watcher is triggered.  Top 10 initially
                // has no data.
                obj.visibleSeries = angular.copy(vm.visibleSeries);
            }

            // Do not override the persistence data with the copied data.
            if (!vm.copyingChartDateTimeData) {
                PersistenceService.setSavedChartInfo($scope.chartId, $scope.chartType, $scope.seriesId, obj)
                    .then(getDataOK, getDataERROR);
            }
            function getDataOK(result) {
                //console.log( "Chart '" + $scope.chartId + "." + $scope.chartType + "." + $scope.seriesId + "' saved.", obj );
                if (autoreload) {
                    vm.initializeChart('drilldown');
                }
            }
            function getDataERROR(data) {
                console.log("*** Failed to set saved Chart data ***");
                console.log(data);
            }
        };

        function clearSeriesData() {
            for (var i = 0; i < $scope.config.series.length; i++) {
                $scope.config.series[i].data = [];
            }
        }

        $scope.$watch('vm.customInterval.value', function (newValue, oldValue) {
            // Don't let user enter a value out side of min/max range.
            if (newValue === undefined) {
                if (oldValue === undefined || oldValue === null) {
                    // oldValue is undefined if they did a select all and then typed new value.
                    oldValue = vm.customInterval.period.min;
                }
                vm.customInterval.value = oldValue;
            }
        });

        vm.checkCustomIntervalTime = function () {
            // value is null if they cleared text and selected out of field.
            if (vm.customInterval.value === null) {
                vm.customInterval.value = vm.customInterval.period.min;
            }
        };
        vm.customInternvalKeyPress = function (event) {
            if (event.charCode === 13) {
                vm.onUpdateInterval();
            }
        };

        vm.onUpdateInterval = function () {
            //vm.panOffset = 0;
            vm.updateChart('apply_custom');
            saveDrilldownInfo();
            vm.saveChartInfo(false); // With the true flag added, it will NOT reload the chart after saving.
        };

        function updateLineChartLegend() {
            for (var t = 0; t < $scope.config.series.length; t++) {
                $scope.config.series[t].visible = vm.visibleSeries[$scope.config.series[t].name];
            }
        }

        // This is where the actual data is retrieved from the API service.
        // The filter object used for the query (and the query type) are pulled in from the
        // parent controller.
        // The chart could be for a device, group, etc... it's determined by the filter.
        vm.updateChart = function (saveFlag) {
            // Handle the refresh timer if applicable.
            if (vm.refresh === 'auto') {
                // For auto refresh, clicking the manual button means we need to reset the auto-refresh timer.
                if (vm.timeRangeSelected.indexOf("last") === 0) {
                    // NOTE:  Only loadAvg charts can use refresh="auto"... other can use "manual" or set number of seconds.
                    // We only bother refreshing for last hour, last day, etc, because static time ranges don't change.
                    vm.refreshInterval = 1000 * ChartHelperService.parseInterval(vm.sliderValue);
                }
            } else if (vm.refresh && vm.refresh !== 'manual') {
                // For non-manual, non-auto refresh, we need to reset the refresh timer with the designated time.
                vm.refreshInterval = parseInt(vm.refresh, 10) * 1000;
            }
            vm.stopRefreshTimer();
            if (!vm.panOffset) {
                vm.panOffset = 0;
            }
            if (vm.panOffset === 0) {
                // Don't auto refresh if looking at a time window in the past... the values won't change.
                vm.startRefreshTimer();
            }

            // First, apply the slider value to the appropriate filter fields.
            if (vm.timeRangeSelected === 'custom') {
                $scope.filter.timestamp.interval = vm.customInterval.value + vm.customInterval.period.suffix;
                if ($scope.query === "loadAvgGroupDevices") {
                    $scope.reloadtop();
                }
                $scope.filter.timestamp.between = [DateFormatService.getUtcToLocalTime(vm.timeFrom) + vm.panOffset, DateFormatService.getUtcToLocalTime(vm.timeTo) + vm.panOffset];
            } else {
                $scope.filter.timestamp.interval = vm.sliderValue;
                $scope.filter.timestamp.between = [vm.timeFrom + vm.panOffset, vm.timeTo + vm.panOffset];

            }

            if (newBetween) {
                $scope.filter.timestamp.between = angular.copy(newBetween);
                newBetween = null;
            }

            // Second, the slider value may have affected the chart title, update it just in case.
            vm.updateChartTitle();

            // Third, clear out the existing series data.
            if ($scope.config.series) {
                for (var i = 0; i < $scope.config.series.length; i++) {
                    $scope.config.series[i].data = [];
                }
            }

            // Then actually call the API.
            var deviceType = null;
            if ($attrs.id === 'groupsCombinedLoadChart' || $attrs.id === 'groupsCombinedLoadChart_top10' || $attrs.id === 'groupsCombinedLoadChart_custom' || $attrs.id === 'groupsCombinedLoadChart_groupAverage' || $attrs.id == 'deviceLoadChart')
                deviceType = 'ps9000';
            else if ($attrs.id === 'groupsCombinedLoadChart_nShield')
                deviceType = 'NSHIELD'; // defined in server/common/common.js
            else if ($attrs.id === 'groupsCombinedLoadChart_clientHost') {
                deviceType = 'CLIENT_HOST';
            } else {
                console.log('Error: invalid chart ID encountered in utilization-chart.directive.js');
            }

            if (deviceType !== null) {
                vm.chartLoading = true;

                // If needed, send a synchronization signal to the parent controller.
                if (vm.doSync) {
                    if (angular.isDefined($scope.syncCallback)) {
                        if (vm.noSyncFlag === false) {
                            if (syncTimes[0] !== $scope.filter.timestamp.between[0] || syncTimes[1] !== $scope.filter.timestamp.between[1] || saveFlag === 'apply_custom') {
                                $scope.syncCallback({
                                    chartId: $scope.chartId + "." + $scope.chartType + "." + $scope.seriesId,
                                    timeRangeSelected: vm.timeRangeSelected,
                                    timeFrom: vm.timeFrom,
                                    timeTo: vm.timeTo,
                                    dateFrom: vm.dateFrom,
                                    dateTo: vm.dateTo,
                                    filter: $scope.filter,
                                    panOffset: vm.panOffset
                                });
                            }
                        } else {
                            vm.noSyncFlag = false;
                        }
                    }
                }
                syncTimes = angular.copy($scope.filter.timestamp.between);

                APIService.getDeviceUtilization(deviceType, $scope.query, $scope.filter, vm.minMaxAvg)
                    .then(getDataOK, getDataERROR);
            }
            function getDataOK(result) {
                // If this is a loadAvg chart, we have to put back the original time span in the filter,
                // otherwise the pan right will not be accurate because the offset needs to only be added
                // just before the API call.
                $scope.filter.timestamp.between = syncTimes;
                if (result.data === undefined) {
                    console.log('no results.');
                    clearSeriesData();
                    vm.chartLoading = false;
                    vm.panOffset = 0;
                    return;
                }
                var seriesData;
                if ($scope.filter.byGroup && $scope.filter.byGroup === "true") {
                    seriesData = result.data.groups;

                }
                if ($scope.filter.byDevice && $scope.filter.byDevice === "true") {
                    seriesData = result.data.devices;
                }
                if (seriesData === undefined || seriesData === null) {
                    // This is what happens for single series.  The data comes back different, so we
                    // have to work with that.
                    seriesData = [{ value: result.data.dates }];
                }
                if (seriesData !== undefined && seriesData !== null) {
                    var maxValue = 0;
                    for (var seriesIndex = 0; seriesIndex < seriesData.length; seriesIndex++) {
                        var utilizationData = [];
                        var data = seriesData[seriesIndex].value;
                        var seriesInfoIndex = -1;
                        //Return order is not guaranteed to match request order. We need to match the correct seriesInfo by id first.
                        for (var seriesCheck = 0; seriesCheck < $scope.seriesInfo.length; seriesCheck++) {
                            if ($scope.seriesInfo[seriesCheck].id === seriesData[seriesIndex].key) {
                                seriesInfoIndex = seriesCheck;
                            }
                        }
                        if (data) {
                            for (var i = 0; i < data.length; i++) {
                                var plot = data[i];
                                if (!plot.value) {
                                    plot.value = 0;
                                }
                                if ($scope.seriesInfo && $scope.seriesInfo[seriesInfoIndex] && $scope.seriesInfo[seriesInfoIndex].name) {
                                    var name = $scope.seriesInfo[seriesInfoIndex].name;
                                    if (vm.visibleSeries[name]) {
                                        // Only calculate max based on visible series.
                                        var value = Math.round(plot.value);
                                        if (value > maxValue) {
                                            maxValue = value;
                                        }
                                    }
                                }

                                if (vm.visibleSeries.max_red_line && plot.max > maxValue) {
                                    maxValue = plot.max;
                                }
                                utilizationData.push({
                                    x: Date.parse(plot.key),
                                    y: Math.round(plot.value),
                                    max: plot.max
                                });
                                //Sujoy: Test
                                chart.data.datasets[0].data.push({
                                    x: Date.parse(plot.key),
                                    y: Math.round(plot.value)
                                });
                                labels.push(DateFormatService.getUtcToLocalTime(plot.key))
                                //Test ends
                            }
                        }
                        if ($scope.config.series.length === 1) {
                            // Only single series, stick it in the first one.
                            $scope.config.series[0].data = utilizationData;

                            //Highcharts-ng's config doesn't track the visible state, but that's the only config object we can access.
                            //We need to track it manually.
                            $scope.config.series[0].visible = true;
                        } else {
                            // Insert the data into the right series
                            for (var x = 0; x < $scope.config.series.length; x++) {
                                // series have ID's when it is a multi-series chart.  Find it's match.
                                if ($scope.config.series[x].id === seriesData[seriesIndex].key) {
                                    $scope.config.series[x].data = utilizationData;
                                    //Highcharts-ng's config doesn't track the visible state, but that's the only config object we can access.
                                    //We need to track it manually.

                                    $scope.config.series[x].visible = true;

                                }
                            }
                        }
                    }

                    if (vm.doAutoScale) {
                        $scope.config.yAxis.max = maxValue * 1.1;
                        chart.options.scales.yAxes[0].ticks.suggestedMax = maxValue * 1.1; //Sujoy
                    } else {
                        var multiplier = 1;
                        if (maxValue >= 100) {
                            // If the max value is at 100 the labels overlap, so add some space.
                            multiplier = 1.1;
                        }
                        $scope.config.yAxis.max = 100 * multiplier;
                        chart.options.scales.yAxes[0].ticks.suggestedMax = 100 * multiplier; //Sujoy
                    }

                    //Point-based hiding only applies to Utilization charts
                    var enableLeftButton = false;
                    var firstPoint;
                    var start = moment($scope.filter.timestamp.between[0]);
                    if (result.data !== undefined) {
                        if (result.data.dates && result.data.dates.length > 0) {
                            firstPoint = moment(result.data.dates[0].key);
                        } else {
                            var lst;
                            if (result.data.groups) {
                                lst = result.data.groups;
                            } else if (result.data.devices) {
                                lst = result.data.devices;
                            }
                            if (lst) {
                                for (var k = 0; k < lst.length; k++) {
                                    if (lst[k].value && lst[k].value.length > 0) {
                                        //Results from the backend are always ordered by date, so check the first entry in each list
                                        var tmpDate = moment(lst[k].value[0].key);
                                        if (!firstPoint || tmpDate.isBefore(firstPoint)) {
                                            firstPoint = tmpDate;
                                        }
                                    }
                                }
                            }
                        }

                        //Buckets are always floored, so we want to show the pan button if the start of the series is equal to or comes after the first bucket
                        if (firstPoint) {
                            // Need to subtract the interval amount from the firstPoint since rounding can place it after the start
                            // which will cause the left arrow to not display.
                            if ($scope.filter && $scope.filter.timestamp && $scope.filter.timestamp.interval) {
                                var num = $scope.filter.timestamp.interval.substr(0, $scope.filter.timestamp.interval.length - 1);
                                var unit = $scope.filter.timestamp.interval.charAt($scope.filter.timestamp.interval.length - 1);
                                if (num && unit) {
                                    firstPoint.subtract(num, unit);
                                }
                            }
                            enableLeftButton = !start.isBefore(firstPoint);
                        }
                        checkPanButtons(enableLeftButton);
                    }

                    addMaxChartline("on update");
                    updateLineChartLegend();
                }
                vm.chartLoading = false;
            }

            function getDataERROR(data) {
                //alert( "Failed to get chart data" );
                //                console.log("*** Failed to get Load Chart data ***");
                //                console.log( $scope.filter );
                //                console.log(data);
                clearSeriesData();
            }
        };
        function onClickMaxLine() {
            var span = ($scope.filter.timestamp.between[1] - $scope.filter.timestamp.between[0]);
            if (span === (1000 * 60 * 5)) {
                // We're already drilled down to max resolution, do nothing.
                return;
            }
            span = span / 4; // This is the zoom factor for drill down.
            if (span < (1000 * 60 * 5)) {
                // The minimum window to show on drill down will be 5 minutes wide.
                span = (1000 * 60 * 5);
            }
            var from = vm.maxPoint.time - (span / 2);
            var to = from + span;

            vm.timeRangeSelected = "custom";
            vm.timeFrom = from;
            vm.timeTo = to;
            //onCustomIntervalPeriodChanged();
            vm.customInterval.value = 0;
            vm.customInterval.period = false;
            vm.calculateCustomIntervals();
            $scope.selectedRangeObj.between = [DateFormatService.getLocalToUtcTime(from), DateFormatService.getLocalToUtcTime(to)];
            vm.saveChartInfo(true); // With the true flag added, it will reload the chart after saving.
        }
        function getSeriesInfoByName(name) {
            for (var i = 0; i < $scope.seriesInfo.length; i++) {
                if ($scope.seriesInfo[i].name === name) {
                    return $scope.seriesInfo[i];
                }
            }
            return null;
        }
        function addMaxChartline(source) {
            var max_val = -1;
            var max_name = "";
            var max_id = "";
            var max_time = "";

            if (!$scope.config.yAxis.plotLines) {
                $scope.config.yAxis.plotLines = [];
            }
            if (!$scope.config.xAxis.plotLines) {
                $scope.config.xAxis.plotLines = [];
            }
            if (vm.visibleSeries.max_red_line === true) {
                for (var s = 0; s < $scope.config.series.length; s++) {
                    //Only check series that are currently being drawn.
                    if (getSeriesInfoByName($scope.config.series[s].name) !== null &&
                        vm.visibleSeries[$scope.config.series[s].name]) {
                        for (var p = 0; p < $scope.config.series[s].data.length; p++) {
                            if ($scope.config.series[s].data[p].max && $scope.config.series[s].data[p].max > max_val) {
                                max_val = $scope.config.series[s].data[p].max;
                                max_time = $scope.config.series[s].data[p].x;
                                max_name = $scope.config.series[s].name;
                                max_id = $scope.config.series[s].id;
                            }
                        }
                    }
                }
            }
            vm.maxPoint = { value: max_val, groupName: max_name, groupId: max_id, time: max_time };
            if (max_val > 0) {

                var redLineVertical = {
                    value: max_time,
                    width: 2,
                    color: 'red',
                    //dashStyle: 'shortdash',
                    events: {
                        mouseover: function () {
                            // On mouse over of the max line, make it fat so it's easier to click.
                            this.svgElem["stroke-widthSetter"](8, "stroke-width", this.svgElem.element);
                            this.svgElem.element.style.cursor = "pointer";
                        },
                        mouseout: function () {
                            // On mouse out of the max line, make it normal thickness.
                            this.svgElem["stroke-widthSetter"](2, "stroke-width", this.svgElem.element);
                            this.svgElem.element.style.cursor = "none";
                        },
                        click: function () {
                            onClickMaxLine();
                        }
                    }
                };
                //Sujoy start

                // chart.data.datasets[1].data.push({x:max_time,y:0},{x:max_time,y:100})

                // chart.data.datasets[2].data.push({x:0,y:max_val},{x:(new Date(max_time)).getTime(),y:max_val})

                //sujoy end
                var redLine = {
                    value: max_val > 100 ? 100 : max_val, // Peg the line to top of the chart, even if it's bigger than 100 percent.
                    width: 2,
                    color: "red",
                    id: max_id,
                    name: max_name,
                    label: {
                        //text: max_val + " @ " + moment(max_time).utcOffset(0).format("MM/DD/YYYY HH:mm:ss [UTC]") + " (" + max_name + ")",
                        text: max_val + " @ " + DateFormatService.formatDate(max_time) + " (" + max_name + ")",
                        y: -10
                    },

                    events: {
                        mouseover: function () {
                            // On mouse over of the max line, make it fat so it's easier to click.
                            this.svgElem["stroke-widthSetter"](8, "stroke-width", this.svgElem.element);
                            this.svgElem.element.style.cursor = "pointer";
                        },
                        mouseout: function () {
                            // On mouse out of the max line, make it normal thickness.
                            this.svgElem["stroke-widthSetter"](2, "stroke-width", this.svgElem.element);
                            this.svgElem.element.style.cursor = "none";
                        },
                        click: function () {
                            onClickMaxLine();
                        }
                    }
                };
                //Sujoy test
                chart.options.annotation.annotations[0].value = redLine.value;
                chart.options.annotation.annotations[1].value = redLineVertical.value;
                // chart.update();
                //test
                if ($scope.config.yAxis.plotLines.length === 0) {
                    // New red lines
                    $scope.config.yAxis.plotLines.push(redLine);
                    $scope.config.xAxis.plotLines.push(redLineVertical);
                } else {
                    // Updated red line
                    $scope.config.yAxis.plotLines[0].name = redLine.name;
                    $scope.config.yAxis.plotLines[0].value = redLine.value > 100 ? 100 : redLine.value;
                    $scope.config.yAxis.plotLines[0].id = redLine.id;
                    $scope.config.yAxis.plotLines[0].label.text = redLine.label.text;
                    $scope.config.xAxis.plotLines[0].value = redLineVertical.value;
                }
                //console.log( "@@@6A Red line should be visible. " + redLine.label.text );
            } else {
                // Hide the red line
                $scope.config.yAxis.plotLines = [];
                $scope.config.xAxis.plotLines = [];
                //console.log( "@@@6B Red line should be hidden." );
            }
        }

        $scope.$on('$destroy', function () {
            vm.stopRefreshTimer();
        });

        vm.startRefreshTimer = function () {
            vm.stopRefreshTimer();
            if (vm.refreshInterval !== 0) {
                vm.refreshTimer = $timeout(function () {
                    //console.log( "Chart refresh timer fired, interval: " + vm.refreshInterval );
                    if ($scope.refreshCallback) {
                        // The refresh callback is used primarily for the top 10 chart in group-details, where the owning controller
                        // needs to know when it's time to go get a new list of the top 10 devices.
                        $scope.refreshCallback().then(vm.refreshChart);
                    } else {
                        vm.refreshChart();
                    }
                }, vm.refreshInterval);
            }
        };

        vm.stopRefreshTimer = function () {
            if (vm.refreshTimer) {
                $timeout.cancel(vm.refreshTimer);
                vm.refreshTimer = undefined;
            }
        };

        vm.getDrilldownInfo = function () {
            var obj = { timeRangeSelected: vm.timeRangeSelected, sliderValue: vm.sliderValue };
            if (vm.timeRangeSelected === "custom") {
                if ($scope.selectedRangeObj.between && $scope.selectedRangeObj.between.length > 1) {
                    obj.from = $scope.selectedRangeObj.between[0]; // HERE IS THE RANGE
                    obj.to = $scope.selectedRangeObj.between[1];
                }
            }
            return obj;
        };
        vm.setDrilldownInfo = function () {
            var tmp = $scope.drilldown;
            // Set the slider to where it was
            if (tmp.sliderValue) {
                vm.sliderValue = tmp.sliderValue;
            }
            // If there is anything, we apply it here.
            // Check for valid data though, so undefined's aren't stuffed into places they shouldn't go.
            if (tmp.timeRangeSelected) {
                vm.timeRangeSelected = tmp.timeRangeSelected;
                if (vm.timeRangeSelected === "custom") {
                    vm.dateFrom = new Date(tmp.from);
                    vm.dateTo = new Date(tmp.to);
                    vm.timeRangeOptions[4].between[0] = tmp.from;
                    vm.timeRangeOptions[4].between[1] = tmp.to;
                    vm.timeRangeOptions[4].name = dateFormat(vm.dateFrom) + ' - ' + dateFormat(vm.dateTo);
                    vm.customInterval.period = false;
                    vm.customInterval.value = 0;
                    vm.calculateCustomIntervals();
                    // Make the interval as small as allowed for this time span.
                }
            }
        };
        function saveDrilldownInfo() {
            $scope.drilldown = {};
            $scope.drilldown.sliderValue = vm.sliderValue;
            $scope.drilldown.timeRangeSelected = vm.timeRangeSelected;
            if (vm.timeRangeSelected === "custom") {
                $scope.drilldown.from = vm.dateFrom;
                $scope.drilldown.to = vm.dateTo;
            }
        };

        // Kick off the listener, if appropriate.
        vm.startRefreshTimer();

        // Initialize the chart
        if ($scope.unlock) {
            //console.log( "Loading chart deferred..." );
            $scope.unlock.deferred.promise.then(function () {
                vm.initializeChart();
                vm.onTimeRangeChanged();
            });
        } else {
            // Immediate load, don't wait.
            vm.initializeChart();
            vm.onTimeRangeChanged();
        }

        vm.exportCSV = function () {
            var csv = "";
            var series = 0;
            var point = 0;

            var now = DateFormatService.formatDate4Events(CurrentTimeService.getCurrentTime());

            csv += "Data Type,Date Requested,Interval,Date From,Date To\n";
            csv += "Utilization,\"" + now + "\"," + $scope.filter.timestamp.interval + ",\"" + DateFormatService.formatDate4Events($scope.filter.timestamp.between[0]) + "\",\"" + DateFormatService.formatDate4Events($scope.filter.timestamp.between[1]) + "\"\n\n";
            for (series = 0; series < $scope.config.series.length; series++) {
                csv += $scope.config.series[series].name + "\n";
                for (point = 0; point < $scope.config.series[series].data.length; point++) {
                    csv += "\"" + DateFormatService.formatDate4Events($scope.config.series[series].data[point].x) + "\"," + $scope.config.series[series].data[point].y + "\n";
                }
                csv += "\n\n";
            }
            var file = new Blob([csv], { type: 'text/csv' });
            saveAs(file, "chart_export.csv");
        };

        //You can't just add a new entry, doing so overrides the default list.
        //So you need to grab the default list, then add the new one.
        //But for some reason the push is applied to all instances of Highcharts across all pages, not just the one you are working on.
        //After a few pages you end up with multiple instances pointing to the vm.exportCSV function in different controllers. Assuming this is a prototyping issue.
        //The ugly fix is to slice out everything that isn't the default set before adding the new one.
        $scope.config.options.exporting = Highcharts.getOptions().exporting;
        $scope.config.options.exporting.buttons.contextButton.menuItems = $scope.config.options.exporting.buttons.contextButton.menuItems.slice(0, 1);
        $scope.config.options.exporting.buttons.contextButton.menuItems.push({ text: "Download CSV", onclick: vm.exportCSV });


        // For the panning feature, there are different options that can be encoded in the template as the "pan" attribute.
        // When pan="true" on a line chart, the amount of pan will be the entire amount shown (whole page).
        // When pan="true" or pan="interval" on a bar chart, the amount of pan will be the number of bars shown (whole page).
        // When pan="interval" on a line chart, the amount of pan will be one data point.
        // When pan="n", where 0 < n <= 100, on a line chart, the amount of pan will be n% of the screen shown.
        // When pan="n", where 0 < n <= 100, on a bar chart, the amount of pan is the n number of bars, where n < interval max.
        //
        // Panning button support
        vm.panOffset = 0;
        vm.panLeft = false;
        vm.panRight = false;
        var panSetting = $attrs.pan;
        if (panSetting === undefined || panSetting === null || panSetting === false) {
            vm.showPanning = false;
        } else {
            vm.showPanning = true;
        }
        $scope.$watch("vm.panOffset", function () {
            // This watcher handles the showing/hiding of the panning buttons.
            checkPanButtons(true);
        });
        function checkPanButtons(panLeftEnabled) {
            if (panSetting) {
                if ($scope.selectedRangeObj.id === "custom") {
                    // For custom time spans, we have to see if they are up against the "now" limit.
                    var zonedNow = CurrentTimeService.getCurrentDate();
                    if ((zonedNow.getTime() - (vm.timeTo + vm.panOffset)) < 60000) {
                        vm.panRight = false;
                    } else {
                        vm.panRight = true;
                    }
                    vm.panLeft = panLeftEnabled;
                } else {
                    // Last Hour, Last Day, etc.
                    vm.panRight = (vm.panOffset < 0);
                    vm.panLeft = panLeftEnabled;
                }
            }
        }
        vm.onPanLeft = function () {
            if (panSetting) {
                panForUsage(-1);
            }
        };
        vm.onPanRight = function () {
            if (panSetting) {
                panForUsage(1);
            }
        };
        function panForUsage(direction) {
            //$scope.filter.timestamp.between = [from, to];
            var span = parseInt($scope.filter.timestamp.between[1], 10) - parseInt($scope.filter.timestamp.between[0], 10);
            if (panSetting === "interval") {
                var factors = { 'm': 1000 * 60, 'h': 1000 * 60 * 60, 'd': 1000 * 60 * 60 * 24, 'w': 1000 * 60 * 60 * 24 * 7 };
                var value, interval;
                if (vm.timeRangeSelected === 'custom') {
                    // When the time range is custom, the slider is not used.
                    value = vm.customInterval.value;
                    interval = vm.customInterval.period.suffix;
                } else {
                    var temp = vm.sliderValue;
                    value = parseInt(temp.substring(0, temp.length - 1), 10);
                    interval = temp.charAt(temp.length - 1);
                }
                vm.panOffset += ((value * factors[interval]) * direction);
            } else if (panSetting === "true") {
                vm.panOffset += (span * direction);
            } else {
                // Use the percentage from the pan setting.
                if (panSetting < 1 || panSetting > 100) {
                    panSetting = 100;
                }
                var panFactor = (panSetting * 0.01);
                if (panFactor > 1 || panFactor <= 0) {
                    panFactor = 1;
                }
                vm.panOffset += ((span * panFactor) * direction);
            }
            vm.updateChart();
        }
        if ($scope.query !== "loadAvgGroupDevices") {
            // The loadAvgGroupDevices query dynamically loads its own series', so the series watcher will initialize it.
            // Everything else, call this to initialize the series.
            updateChartSeries();
        }
        if ($scope.repaint) {
            $scope.$watch('repaint', function () {
                // DIRECTIVE WAS TOLD TO REPAINT...
                vm.updateChart();
            });
        }
        if ($scope.config.options && $scope.config.options.chart) {
            $scope.config.options.chart.events = {
                redraw: function () {
                    $timeout(function () {
                        $scope.config.getHighcharts().reflow();
                    }, 1000)
                }
            };
        }


    }

})();
