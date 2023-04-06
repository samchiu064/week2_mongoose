const headers = require("./headers");

function handleSuccess({ req, res, postData }) {
  res.writeHead(200, headers);
  res.write(
    JSON.stringify({
      status: true,
      data: postData,
    })
  );
  res.end();
}

module.exports = handleSuccess;
