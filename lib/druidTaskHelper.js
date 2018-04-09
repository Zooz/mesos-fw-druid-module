/*jslint bitwise: true this node*/
"use strict";

var requireEnv = require("require-environment-variables");

var populateTasks = require("../../framework-core").populateTasks;
var helpers = require("../../framework-core").helpers;
var Mesos = require("../../framework-core").Mesos.getMesos();

function buildTask(taskType, uniqueSuffix, env) {
    var index = "_" + taskType.toUpperCase();

    process.env["TASK" + index + "_NUM_INSTANCES"] = 1;

    var task = populateTasks.createTaskInfo(index);
    for (var envvar in env) {
        task.commandInfo.environment.variables.push(new Mesos.Environment.Variable(envvar, env[envvar]));
    }
    task.name = process.env["TASK" + index + "_NAME"] + "." + uniqueSuffix;
    task.allowScaling = true;
    return task;
}

function addTask(scheduler, taskType, uniqueSuffix, env) {
    var task  = buildTask(taskType, uniqueSuffix, env);

    var tasks = [];
    tasks[0] = task;

    scheduler.logger.debug("Task added: " + JSON.stringify(tasks));

    scheduler.pendingTasks = scheduler.pendingTasks.concat(tasks);
    scheduler.tasks = scheduler.tasks.concat(helpers.cloneDeep(tasks)); // Task definition is needed to support restarts
}

module.exports = {"buildTask": buildTask, "addTask": addTask};
