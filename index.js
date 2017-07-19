"use strict";

module.exports = require("./druidSetup");


// Check if we got the necessary info from the environment, otherwise fail directly!
require("require-environment-variables")([
    "HOST", "PORT",
    "FRAMEWORK_NAME"
]);
