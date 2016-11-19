'use strict';

/* App Module */

var mainApp = angular.module('mainApp', [
        'ngRoute',
        //'mainAnimations',
        'mainControllers',
        'mainFilters',
        'mainServices',
        'chart.js'
]);

mainApp.config(['$routeProvider',
        function($routeProvider) {
            $routeProvider.
                when('/logs', {
                    templateUrl: 'partials/logs.html',
                    controller: 'logsCtrl'
                }).

            when('/', {
                templateUrl: 'partials/main.html',
                controller: 'mainCtrl'
            }).
            otherwise({
                redirectTo: '/'
            });
        }]);
