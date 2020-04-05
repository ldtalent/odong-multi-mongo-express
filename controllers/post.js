
const authorModel = require("../models/author");
const postModel = require("../models/posts");
const _ = require("lodash");

exports.params = async function (req, res, next, id) {
  console.log(id)
  await postModel.findById(id)
    .populate("author")
    .exec()
    .then((post) => {
      if (!post) {
        res.status(400).send(" post with that Particular id");
      } else {
        req.post = post;
        next();
      }
    }).catch(err => {
      res.send(err);
    });
};

exports.get = async function (req, res) {
  await postModel.find({})
    .populate("post")
    .exec()
    .then((posts) => {
      res.json(posts);
    }, (err) => {
      res.send(err);
    });
};

exports.getOne = async function (req, res) {
  const post = await req.post;

  res.json(post);
};

exports.delete = async function (req, res) {
  await postModel.remove((req.post), (err, removed) => {
    if (err) {
      res.status(400).send("post not deleted");
    } else {
      res.json(removed);
    }
  });
};

exports.post = async function (req, res) {

  const authorId = await req.params.authorID,
    postObject = await req.body,
    newPost = new postModel(postObject);

  await authorModel.findOne({ "_id": authorId }, async (err, foundAuthor) => {
    if (!foundAuthor) {
      return err;
    }
    foundAuthor.posts.push(newPost);
    newPost.author = foundAuthor;
    await newPost.save((err, savedPost) => {
      if (err) {
        return err;
      }
      res.json(savedPost);
    });
    await foundAuthor.save((err) => {
      if (err) {
        return err;
      }
    });
  });

};

exports.update = function (req, res) {

  const newAuthorId = req.params.authorId,
    postId = req.params.postId,
    newPost = req.body;

  postModel.findOne({ "_id": postId }, (err, post) => {
    if (!post) {
      return err;
    }

    const oldAuthorID = post.author._id;

    authorModel.findById(oldAuthorID)
      .then((oldAuthor) => {
        if (!oldAuthor) {
          return res.status(400).send("No Author with that Particular id");
        }

        let index = oldAuthor.posts.indexOf(postId);

        if (index > -1) {
          oldAuthor.posts.splice(index, 1);
        }

        oldAuthor.save((err) => {
          if (err) {
            return err;
          }
        });
      });


    authorModel.findById(newAuthorId)
      .then((newAuthor) => {
        if (!newAuthor) {
          return err;
        }

        newAuthor.posts.push(post);
        newAuthor.save(err => {
          if (err) {
            return err;
          }
        });

        post.author = newAuthor;

        _.merge(post, newPost);
        post.save((err, saved) => {
          if (err) {
            return err;
          }
          res.json(saved);
        });
      });
  });
};
