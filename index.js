"use strict";
exports.__esModule = true;
var index_1 = require("./src/http_server/index");
var HTTP_PORT = 8181;
console.log("Start static http server on the ".concat(HTTP_PORT, " port!"));
index_1.httpServer.listen(HTTP_PORT);
