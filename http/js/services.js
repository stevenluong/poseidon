'use strict';

/* Services */

var mainServices = angular.module('mainServices', ['ngResource']);
mainServices.factory('Visit',function($resource){
    return $resource("http://slapps.fr:3001/visits.json/:id");
});

