"use strict";
var controllers = angular.module('mesos-framework-ui.controllers');

controllers.controller('UnsealController', function ($scope, $route, $interval, config, ModuleInfo) {
    $scope.unsealShard = "";
    var localModuleInfo = ModuleInfo.moduleInfo;

    var hash = window.location.hash.split("/");
    if (hash.length > 1) {
        $route.current.activeTab = hash[hash.length - 1];
    }

    // Registering task restart hook
    function druidRestartHook(taskId) {
    }

    if (!localModuleInfo.restartHooks) {
        localModuleInfo.restartHooks = [druidRestartHook];
    }

    var index;
    var found = false;
    for (index = 0; !found && index < localModuleInfo.restartHooks.length; index += 1) {
        if (localModuleInfo.restartHooks[index].name === "druidRestartHook") {
            found = true;
        }
    }
    if (!found) {
        localModuleInfo.restartHooks.push(druidRestartHook);
    }

    // Registering tasks rolling restart hook
    function druidRollingRestartHook(taskId) {
    };

    if (!localModuleInfo.rollingRestartHooks) {
        localModuleInfo.rollingRestartHooks = [druidRollingRestartHook];
    }

    found = false;
    for (index = 0; !found && index < localModuleInfo.rollingRestartHooks.length; index += 1) {
        if (localModuleInfo.rollingRestartHooks[index].name === "druidRollingRestartHook") {
            found = true;
        }
    }
    if (!found) {
        localModuleInfo.rollingRestartHooks.push(druidRollingRestartHook);
    }

    // Registering killall hook
    function druidKillAllHook() {
    };

    if (!localModuleInfo.killAllHooks) {
        localModuleInfo.killAllHooks = [druidKillAllHook];
    }

    found = false;
    for (index = 0; !found && index < localModuleInfo.killAllHooks.length; index += 1) {
        if (localModuleInfo.killAllHooks[index].name === "druidKillAllHook") {
            found = true;
        }
    }
    if (!found) {
        localModuleInfo.killAllHooks.push(druidKillAllHook);
    }

    // Registering killall type hook
    function druidKillAllTypeHook(type) {
    };

    if (!localModuleInfo.killAllTypeHooks) {
        localModuleInfo.killAllTypeHooks = [druidKillAllTypeHook];
    }

    found = false;
    for (index = 0; !found && index < localModuleInfo.killAllTypeHooks.length; index += 1) {
        if (localModuleInfo.killAllTypeHooks[index].name === "druidKillAllTypeHook") {
            found = true;
        }
    }
    if (!found) {
        localModuleInfo.killAllTypeHooks.push(druidKillAllTypeHook);
    }
});
