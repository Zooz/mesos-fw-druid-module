"use strict";

var http = require("http");


/**
 * Represents a auditHelper object
 * @constructor
 * @param {object} scheduler - The scheduler object.
 * @param {object} options - The option map object.
 */
function auditHelper(scheduler) {
    if (!(this instanceof auditHelper)) {
        return new auditHelper(scheduler);
    }

    var self = this;

    self.scheduler = scheduler;
    self.logger = scheduler.logger;

    self.data = {
        type: 'syslog',
        options: {
            tag: "druid",
            "facility": "AUTH"
        }
    };

    self.auditRequestCreate = function (host, port, data) {
        return {
            "host": host,
            "port": port,
            "path": "/v1/sys/audit/syslog",
            "method": "PUT",
            headers: {'Content-Type': 'application/json', "Content-Length": Buffer.byteLength(data)}
        };
    };
}

auditHelper.prototype.enableAudit = function () {

    var self = this;
    var data = JSON.stringify(self.data);

    var tasks = self.scheduler.launchedTasks;

    tasks.forEach(function (task) {
        if (task.runtimeInfo && task.runtimeInfo.state === "TASK_RUNNING") {
            if (task.runtimeInfo.network && task.runtimeInfo.network.hostname && task.runtimeInfo.network.ports && task.runtimeInfo.network.ports[0]) {
                self.logger.debug("Enabling audit");
                var req = http.request(self.auditRequestCreate(task.runtimeInfo.network.hostname, task.runtimeInfo.network.ports[0], data), function (res) {

                    if (res) {
                        self.logger.debug("Response code: " + res.statusCode.toString());
                        if (res.statusCode === 204) {
                            self.logger.info("Audit enabled");
                        } else {
                            self.logger.error("HTTP error " + res.statusCode.toString());
                        }
                        res.resume();
                    }
                });

                req.on("error", function (error) {
                    self.logger.error("Error when enabling audit:" + JSON.stringify(error));
                });
                req.write(data);
                req.end();
            }
        }
    });

};

module.exports = auditHelper;
