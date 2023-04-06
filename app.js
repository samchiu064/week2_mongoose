const route = require("./routes");

require("./connections");

const app = async (req, res) => route(req, res);

module.exports = app;
