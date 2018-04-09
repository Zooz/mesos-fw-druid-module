/*jslint bitwise: true this node es6*/
"use strict";
// Internal modules
var path = require("path");

// NPM modules
var express = require("express");
var TaskHealthHelper = require("../framework-core").TaskHealthHelper;

module.exports = function (scheduler, frameworkConfiguration, route, app, restartHelper) {

    var healthCheck;
    var TASK_NAME_FILTER = "^.*$";

    healthCheck = new TaskHealthHelper(scheduler, {
        "taskNameFilter": TASK_NAME_FILTER,
        url: "/status",
        interval: parseInt(process.env.TASK_HEALTH_INTERVAL),
        "logging": {
            "path": process.env.MESOS_SANDBOX + "/logs/",
            "fileName": process.env.FRAMEWORK_NAME + ".log",
            "level": app.get("logLevel")
        }
    });

    frameworkConfiguration.healthCheck = true;

    if (restartHelper) {
        restartHelper.setHealthCheck({filter: "^overlord-[0-9]+$", name: "healthy"});
        restartHelper.setHealthCheck({filter: "^historical-[0-9]+$", name: "healthy"});
        restartHelper.setHealthCheck({filter: "^coordinator-[0-9]+$", name: "healthy"});
        restartHelper.setHealthCheck({filter: "^broker-[0-9]+$", name: "healthy"});
        restartHelper.setHealthCheck({filter: "^middle-manager-[0-9]+$", name: "healthy"});
        restartHelper.setHealthCheck({filter: "^tranquility.+$", name: "healthy"});
    }

    frameworkConfiguration.druidHelper = true;
    frameworkConfiguration.moduleList.push("druid");

    app.use("/partials/druid.html", express.static(path.join(__dirname, "partials/druid.html")));
    app.use("/app/druidController.js", express.static(path.join(__dirname, "angular-app/druidController.js")));
    app.use("/app/druidServices.js", express.static(path.join(__dirname, "angular-app/druidServices.js")));

    app.use("/", function (req, ignore, next) {
        if (!req.modules) {
            req.modules = {"menus": [], "files": []};
        }
        if (!req.modules.menus) {
            req.modules.menus = [];
        }
        if (!req.modules.files) {
            req.modules.files = [];
        }

        req.staticOverviewCells = [{"name": "DEEP STORAGE", "value": "S3"}, {"name": "MYSQL", "value": "52.29.170.53:3306"}];

        req.modules.menus.push("<li class=\"sidebar-list\" ng-show=\"configuration.druidHelper\"><a href=\"#/module/druid\" ng-class=\"{active: $route.current.activeTab == 'druid'}\">Druid<span class=\"menu-icon fa fa-cubes\"></span></a></li>");
        req.modules.files.push("app/druidController.js");
        req.modules.files.push("app/druidServices.js");
        next();
    });

    app.use("/partials/tasks.html", function (req, ignore, next) {
        if (!req.modules) {
            req.modules = {"taskFields": [], "taskHeaders": [], "rollingRestartFields": [], "taskControllers": [], "killAllString": ""};
        }
        if (!req.modules.taskFields) {
            req.modules.taskFields = [];
        }
        if (!req.modules.taskHeaders) {
            req.modules.taskHeaders = [];
        }
        if (!req.modules.taskControllers) {
            req.modules.taskControllers = [];
        }
        if (!req.modules.rollingRestartFields) {
            req.modules.rollingRestartFields = [];
        }

        req.modules.rollingRestartFields.push("ng-disabled=\"true\"");
        next();
    });

    require("./druidRoutes")(route);

    var task_start_handle = function (task) {
        setTimeout(function () {
            healthCheck.checkInstance(task);
        }, 5000);
    };

    scheduler.on("task_launched", task_start_handle);

    healthCheck.setupHealthCheck();
};
