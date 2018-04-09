// NPM modules
var proxyModule = require("express-http-proxy");
var express = require("express");
var replaceall = require("replaceall");
var druidApi = require("./lib/druidApi");
var druidTaskHelper = require("./lib/druidTaskHelper");

module.exports = function (routes) {

  var taskHostname;

  routes.use("/druid/proxy/:module", function (req, res, next) {
    var index;
    var task;
    var matchFound = false;
    function matchEmail(user) {
      if (req.user.emails[index].value.match(user)) {
        matchFound = true;
      }
    }
    if (process.env.PROXY_USERS) {
      var users = process.env.PROXY_USERS.split(",");

      for (index = 0; req.user.emails && index < req.user.emails.length; index += 1) {
        if (req.user.emails[index].type === "account") {
          users.forEach(matchEmail);
        }
      }
      if (!matchFound) {
        res.status(401).end();
        return;
      }
    }
    for (index = 0; index < req.scheduler.launchedTasks.length; index += 1) {
      task = req.scheduler.launchedTasks[index];

      if (task.name.indexOf(req.params.module) > -1) {
        taskHostname = task.runtimeInfo.network.hostname + ":" + task.runtimeInfo.network.ports[0];
        next();
        return;
      }
    }
    req.scheduler.logger.error("Could not find appropriate task in " + req.scheduler.launchedTasks.length + " launched tasks");
    res.status(503).write("Could not find appropriate task:" + req.params.module + " in " + req.scheduler.launchedTasks.length + " launched tasks").end();
  });

  function getHostname() {
    return taskHostname;
  }

  routes.use("/druid/proxy/:module", proxyModule(getHostname, {
    parseReqBody: false,
    intercept: function (rsp, data, req, res, callback) {
      if (req.method === "GET" && req.params.module.indexOf("coordinator") > -1) {
        var temp = replaceall("href=\"/", "href=\"./coordinator/", data.toString());
        temp = replaceall("/druid/coordinator/","./coordinator/druid/coordinator/", temp);
        temp = replaceall("/druid/indexer/","./coordinator/druid/indexer/", temp);
        temp = replaceall("/pages","./coordinator/pages", temp);
        temp = replaceall("/coordinator/false","./coordinator/false", temp);
        var dataMod = replaceall("src=\"/", "src=\"./coordinator/", temp);
        callback(null, dataMod);
      } else if (req.method === "GET" && req.params.module.indexOf("overlord") > -1) {
        var dataMod = replaceall("/druid/indexer/", "./druid/indexer/", data.toString());
        callback(null, dataMod);
      } else {
        callback(null, data, res.headersSent); // This changes in future proxy versions
      }
    },
    memoizeHost: false
  }));

  routes.use("/druid/tasks", function(req, res, next) {
      req.druidTaskHelper = druidTaskHelper;
      next();
  });

  routes.put("/druid/tasks/tranquility/:uniqueSuffix", druidApi.startTranquilityTask);
  //routes.put("/druid/tasks/broker", druidApi.startBrokerTask);

};
