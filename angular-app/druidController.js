"use strict";
var controllers = angular.module('mesos-framework-ui.controllers');

controllers.controller('druid', function ($scope, $http, $window, DruidTranquilityTasks, config) {

    $scope.dnsName = null;

    $scope.launchTranquility = function() {
        DruidTranquilityTasks.addTranquility({uniqueSuffix:$scope.uniqueSuffix},{metrics: $scope.configUrl});
        $scope.dnsName = "tranquility-" + $scope.uniqueSuffix + "." + $scope.$parent.name + ".mesos";
    };
});
