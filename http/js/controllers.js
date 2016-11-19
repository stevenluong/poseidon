'use strict';

/* Controllers */

var mainControllers = angular.module('mainControllers', []);
mainControllers.controller('logsCtrl', ['$scope','$http','Visit',
        function($scope,$http,Visit) {
            Visit.query(function(visits){
                $scope.visits = visits;
                console.log(visits.length);
            });
        }]);
mainControllers.controller('mainCtrl', ['$scope',
        function($scope) {
            var socket = io("http://slapps.fr:8090");
            $scope.cpuSeries = ['CPU'];
            $scope.cpuLabels = ["","","","","","","","","","","","","","",""];
            $scope.cpuData = [[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]]
            $scope.cpuDatasetOverride = [{ fill : true }];
            $scope.cpuOptions ={
                scales: {
                    yAxes: [
                    {
                        ticks: {
                            max: 200,
                            min: 0,
                            stepSize: 10
                        }
                    }
                    ]
                }
            };
            socket.on("loadavg",function(data){
                console.log(data);
                data.forEach(function(value){
                    $scope.cpuData[0].shift();
                    $scope.cpuData[0].push(value*50);
                    $scope.cpuLabels.shift();
                    $scope.cpuLabels.push("");

                });
                //console.log($scope.cpuData[0])
            });
            socket.on("loadavgi",function(data){
                //console.log(data);
                $scope.cpuData[0].shift();
                $scope.cpuData[0].push(data*50);
                $scope.cpuLabels.shift();
                $scope.cpuLabels.push("");
                $scope.$apply();
                //console.log($scope.cpuData[0]);
            });
            $scope.ramSeries = ['RAM'];
            $scope.ramLabels = ["","","","","","","","","","","","","","",""];
            $scope.ramData = [[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]]
            $scope.ramDatasetOverride = [{ fill : true}];
            $scope.ramOptions ={
                scales: {
                    yAxes: [
                    {
                        ticks: {
                            max: 100,
                            min: 0,
                            stepSize: 10
                        }
                    }
                    ]
                }
            };

            socket.on("memi",function(data){
                $scope.ramData[0].shift();
                $scope.ramData[0].push(data);
                $scope.ramLabels.shift();
                $scope.ramLabels.push("");
                $scope.$apply();
                //console.log($scope.cpuData[0]);
            });


            // CHART
            //$scope.labels = ["January", "February", "March", "April", "May", "June", "July"];
            /*
               $scope.series = ['25 ans','20 ans','15 ans'];
               $scope.labels = []
               $scope.data = [[],[],[]]
               $scope.datasetOverride = [{ fill : false },{ fill : false },{ fill : false }];
               Rates.getRates().success(function(response){
               response.forEach(function(rate){
               if(rate.years==25){
            //console.log(rate);
            $scope.labels.push(rate.date);
            $scope.data[0].push(rate.rate);
            }
            if(rate.years==20){
            //console.log(rate);
            $scope.data[1].push(rate.rate);
            }

            if(rate.years==15){
            //console.log(rate);
            $scope.data[2].push(rate.rate);
            }

            })
            });
            */
            $scope.onClick = function (points, evt) {
                console.log(points, evt);
            };

            //Sources.getSources().success(function(response){
            //    console.log(response);
            //});
        }]);
