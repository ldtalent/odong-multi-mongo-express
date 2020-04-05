
const express = require("express");
const postController = require("../controllers/post"),
  postRouter = express.Router();

postRouter.param("id", postController.params);


postRouter.route("/posts")
  .get(postController.get);

postRouter.route("/posts/:id")
  .delete(postController.delete)
  .get(postController.getOne);

postRouter.route("/author/:authorID/posts")
  .post(postController.post);

postRouter.route("/authors/:authorId/posts/:postId")
  .put(postController.update);


module.exports = postRouter;
