"use strict";
var services = angular.module('mesos-framework-ui.services');

var baseURL = window.location.protocol + '//' + window.location.host + window.location.pathname;

services.factory('Shards', function($resource, config) {
    var URL = baseURL + config.application.apiPrefix + '/placeholder';
    // return $resource(URL, {}, {
    //     add: {
    //         method: 'PUT',
    //         transformResponse: function (data, headersGetter, status) {
    //             return angular.fromJson(data);
    //         }
    //     }
    // });
});
