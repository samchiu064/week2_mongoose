const Post = require("../models/post");
const headers = require("../services/headers");
const handleError = require("../services/handleError");
const handleSuccess = require("../services/handleSuccess");

const posts = {
  async getPosts(req, res) {
    const postData = await Post.find();
    res.writeHead(200, headers);
    res.write(
      JSON.stringify({
        status: true,
        data: postData,
      })
    );
    res.end();
  },
  async addPost({ req, res, body }) {
    try {
      const data = JSON.parse(body);
      const postData = await Post.create({
        ...data,
      });
      handleSuccess({ req, res, postData });
    } catch (err) {
      handleError(res, err);
    }
  },
  async deletePost(req, res) {
    const postData = await Post.deleteMany({});
    handleSuccess({ req, res, postData });
  },
  async deletePostById(req, res) {
    try {
      const id = req.url.split("/").pop();
      const postData = await Post.findByIdAndDelete(id);
      handleSuccess({ req, res, postData });
    } catch (err) {
      handleError(res, err);
    }
  },
  async modifyPostById({ req, res, body }) {
    try {
      const id = req.url.split("/").pop();
      const data = JSON.parse(body);
      const postData = await Post.findByIdAndUpdate(id, {
        ...data,
      });
      handleSuccess({ req, res, postData });
    } catch (err) {
      handleError(res, err);
    }
  },
};

module.exports = posts;
