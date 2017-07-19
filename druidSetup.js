/*jslint bitwise: true this node es6*/
"use strict";
// Internal modules
const fs = require("fs");

var AuditHelper = require("./lib/auditHelper");

// NPM modules
var express = require("express");
var TaskHealthHelper;
// Instantiate the mesos-framework module related objects
if (fs.existsSync("./mesos-framework")) {
    TaskHealthHelper = require("../mesos-framework").TaskHealthHelper;
} else {
    TaskHealthHelper = require("mesos-framework").TaskHealthHelper;
}

module.exports = function (scheduler, frameworkConfiguration, route, app, restartHelper) {
    var healthCheck;
    var TASK_NAME_FILTER = "^vault-[0-9]+$";

    if (Boolean(process.env.AUDIT)) {
        var auditHelper;
        auditHelper = new AuditHelper(scheduler);
        scheduler.logger.info("Enabling audit");
        auditHelper.enableAudit();
    }

    healthCheck = new TaskHealthHelper(scheduler, {
        "taskNameFilter": TASK_NAME_FILTER,
        url: "/v1/sys/health?standbyok"
    });

    frameworkConfiguration.healthCheck = true;

    if (restartHelper) {
        restartHelper.setUseHealthcheck(true);
    }

    scheduler.on("task_unhealthy", function (task) {

    });

    app.use("/partials/placeholder.html", express.static("./druid-module/partials/placeholder.html"));
    app.use("/app/vaultController.js", express.static("./druid-module/angular-app/druidController.js"));
    app.use("/app/vaultServices.js", express.static("./druid-module/angular-app/druidServices.js"));

    app.use("/", function (req, res, next) {
        if (!req.modules) {
            req.modules = {"menus": [], "files": []};
        }
        if (!req.modules.menus) {
            req.modules.menus = [];
        }
        if (!req.modules.files) {
            req.modules.files = [];
        }

        req.modules.files.push("app/vaultController.js");
        req.modules.files.push("app/vaultServices.js");
        next();
    });

    require("./druidRoutes")(route);

    function task_start_handle(task) {
    }

    scheduler.on("task_launched", task_start_handle);

    healthCheck.setupHealthCheck();
};
