const headers = require("./headers");

function handleError(res, err) {
  res.writeHead(400, headers);
  res.write(
    JSON.stringify({
      status: "fail",
      error: err.errors,
      message: err.message,
    })
  );
  res.end();
}

module.exports = handleError;
