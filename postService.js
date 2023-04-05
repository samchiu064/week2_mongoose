const http = require("http");
const dotenv = require("dotenv").config({ path: "./config.env" });
const mongoose = require("mongoose");
const Post = require("./models/post");
const errHandle = require("./errorHandle");

const DB = process.env.DATABASE.replace(
  "<password>",
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB)
  .then(() => {
    console.log("connect success");
  })
  .catch((err) => console.log(err));

const requestListener = async (req, res) => {
  let body = "";
  req.on("data", (chunk) => (body += chunk));
  const headers = {
    "Access-Control-Allow-Headers":
      "Content-Type, Authorization, Content-Length, X-Requested-With",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "PATCH, POST, GET,OPTIONS,DELETE",
    "Content-Type": "application/json",
  };

  if (req.url === "/posts" && req.method === "GET") {
    const postData = await Post.find();
    res.writeHead(200, headers);
    res.write(
      JSON.stringify({
        status: true,
        data: postData,
      })
    );
    res.end();
  } else if (req.url === "/posts" && req.method === "POST") {
    req.on("end", async () => {
      try {
        const data = JSON.parse(body);
        const postData = await Post.create({
          ...data,
        });
        res.writeHead(200, headers);
        res.write(
          JSON.stringify({
            status: true,
            data: postData,
          })
        );
        res.end();
      } catch (err) {
        errHandle(res, err);
      }
    });
  } else if (req.url === "/posts" && req.method === "DELETE") {
    const postData = await Post.deleteMany({});
    res.writeHead(200, headers);
    res.write(
      JSON.stringify({
        status: true,
        data: postData,
      })
    );
    res.end();
  } else if (req.url.startsWith("/posts/") && req.method === "DELETE") {
    try {
      const id = req.url.split("/").pop();
      const postData = await Post.findByIdAndDelete(id);

      if (postData !== null) {
        res.writeHead(200, headers);
        res.write(
          JSON.stringify({
            status: true,
            data: postData,
          })
        );
      } else {
        res.writeHead(404, headers);
        res.write(
          JSON.stringify({
            status: false,
            message: "查無此 id",
          })
        );
      }
      res.end();
    } catch (err) {
      errHandle(res, err);
    }
  } else if (req.url.startsWith("/posts/") && req.method === "PATCH") {
    req.on("end", async () => {
      try {
        const id = req.url.split("/").pop();
        const data = JSON.parse(body);
        const postData = await Post.findByIdAndUpdate(id, {
          ...data,
        });

        let response = {
          status: false,
          data: "",
        };

        if (Object.keys(data).length === 0) {
          response.data = "資料不得為空";
          res.writeHead(400, headers);
        } else {
          response.status = true;
          response.data = postData;
          res.writeHead(200, headers);
        }

        res.end(JSON.stringify(response));
      } catch (err) {
        errHandle(res, err);
      }
    });
  }
};

const server = http.createServer(requestListener).listen(3005);
