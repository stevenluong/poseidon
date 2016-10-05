'use strict';

/* Controllers */

var mainControllers = angular.module('mainControllers', []);
mainControllers.controller('mainCtrl', ['$scope','Rates',
        function($scope, Rates) {
// CHART
            //$scope.labels = ["January", "February", "March", "April", "May", "June", "July"];
            $scope.series = ['25 ans','20 ans','15 ans'];
            $scope.labels = []
            $scope.data = [[],[],[]]
            $scope.datasetOverride = [{ fill : false },{ fill : false },{ fill : false }];
            Rates.getRates().success(function(response){
                response.forEach(function(rate){
                    if(rate.years==25){
                        console.log(rate);
                        $scope.labels.push(rate.date);
                        $scope.data[0].push(rate.rate);
                    }
                    if(rate.years==20){
                        console.log(rate);
                        $scope.data[1].push(rate.rate);
                    }

                    if(rate.years==15){
                        console.log(rate);
                        $scope.data[2].push(rate.rate);
                    }

                })
            });
            $scope.onClick = function (points, evt) {
                console.log(points, evt);
            };

            //Sources.getSources().success(function(response){
            //    console.log(response);
            //});
        }]);
