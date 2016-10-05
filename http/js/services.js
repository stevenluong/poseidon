'use strict';

/* Services */

var mainServices = angular.module('mainServices', ['ngResource']);

mainServices.factory('Rates',function($http){
    var rates = {};
    rates.getRates = function(){
        return $http.get("http://slapps.fr/hephaistos/ror/rates.json")
    };	
    return rates;
});
var formatDateRorToJs = function(date){
    //return date.substring(8,10)+'/'+date.substring(5,7)+' '+date.substring(11,13)+':'+date.substring(14,16);
    return date.substring(11,13)+':'+date.substring(14,16);
};

var normaliseDate = function(date){
    var y = date.getFullYear();
    var m = ("0" + (date.getMonth() + 1)).slice(-2);
    var d = ("0" + date.getDate()).slice(-2);
    return y+m+d;
}
