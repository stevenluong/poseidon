'use strict';

/* Controllers */

var mainControllers = angular.module('mainControllers', []);
/*
mainControllers.controller('logsCtrl', ['$scope','$http','Visit',
        function($scope,$http,Visit) {
            Visit.query(function(visits){
                $scope.visits = visits;
            });
        }]);
        */
mainControllers.controller('mainCtrl', ['$scope',
        function($scope) {
            /*
            //VISITS
            $scope.visitToday = 0;
            $scope.visitsSeries = ['Visits'];
            $scope.visitsLabels = ["","","","","","",""];
            $scope.visitsData = [[0,0,0,0,0,0,0]]
            $scope.visitsDatasetOverride = [{ fill : true }];
            $scope.visitsOptions ={
                scales: {
                    yAxes: [
                    {
                        ticks: {
                            //max: 200,
                            min: 0,
                            stepSize: 100
                        }
                    }
                    ]
                }
            };
            Visit.query(function(visits){
                var visitsByDay = {}
                visits.forEach(function(visit){
                    var date = new Date(visit.firstDate);
                    var nDate = normalizeDate(date);
                    if(visitsByDay[nDate]==null){
                        visitsByDay[nDate]=[];
                    }
                    visitsByDay[nDate].push(visit);
                });
                for(var i in visitsByDay){
                    $scope.visitsData[0].shift();
                    $scope.visitsData[0].push(visitsByDay[i].length);
                    $scope.visitsLabels.shift();
                    $scope.visitsLabels.push(i);
                };

            });
*/
            //CPU
            var socket = io("http://poseidon_node.slapps.fr");
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
                            stepSize: 50
                        }
                    }
                    ]
                }
            };
            socket.on("loadavg",function(data){
                data.forEach(function(value){
                    $scope.cpuData[0].shift();
                    $scope.cpuData[0].push(value*100);
                    $scope.$apply();
                });
            });
            socket.on("loadavgi",function(data){
                $scope.cpuData[0].shift();
                $scope.cpuData[0].push(data*100);
                $scope.$apply();
            });
            //RAM
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
                $scope.$apply();
            });
            $scope.onClick = function (points, evt) {
                //console.log(points, evt);
            };

        }]);
var normalizeDate = function(date){
    var day = date.getDate();
    var month = date.getMonth() + 1; //Months are zero based
    var year = date.getFullYear();
    return day + "/" + month + "/" + year;
}
