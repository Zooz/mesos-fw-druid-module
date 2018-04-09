"use strict";


var druidApi = {
    "startTranquilityTask": function (req, res) {
        if (req.body && req.body.metrics) {
            var configUrl = req.body.metrics;
            req.druidTaskHelper.addTask(req.scheduler, "tranquility", req.params.uniqueSuffix, {"METRICS_CONFIG": configUrl});
            res.json({"OK.": "Task added successfully"});
        } else {
            res.status(400).json({"Error": "Tranquility task was not added, problem with body params"});
        }
    }
};

module.exports = druidApi;
