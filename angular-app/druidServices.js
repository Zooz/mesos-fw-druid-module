"use strict";
var services = angular.module('mesos-framework-ui.services');

var baseURL = window.location.protocol + '//' + window.location.host + window.location.pathname;

services.factory('DruidTranquilityTasks', function ($resource, config) {
    var URL = baseURL + config.application.apiPrefix + '/druid/tasks/tranquility/:uniqueSuffix';
    return $resource(URL, {}, {
        addTranquility: {
            method: 'PUT',
            transformResponse: function (data, headersGetter, status) {
                return angular.fromJson(data);
            }
        }
    });
});
