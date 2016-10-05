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
      when('/', {
        templateUrl: 'partials/main.html',
        controller: 'mainCtrl'
      }).
      otherwise({
        redirectTo: '/'
      });
  }]);
