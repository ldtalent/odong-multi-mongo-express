
const _ = require('lodash');
const AuthorModel = require('../models/author');
const PostModel = require('../models/posts');

exports.params = async function (req, res, next, id) {
  console.log(id);
  await PostModel.findById(id)
    .populate('author')
    .exec()
    .then((post) => {
      if (!post) {
        return res.status(400).send(' post with that Particular id');
      }
      req.post = post;
      next();
    })
    .catch((err) => {
      res.send(err);
    });
};

exports.get = async function (req, res) {
  await PostModel.find({})
    .populate('author')
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
  await PostModel.remove((req.post), (err, removed) => {
    if (err) {
      res.status(400).send('post not deleted');
    } else {
      res.json(removed);
    }
  });
};


exports.post = async function (req, res) {
  const authorId = await req.params.authorID;
  const postObject = await req.body;
  const newPost = new PostModel(postObject);

  await AuthorModel.findOne({ _id: authorId }, async (err, foundAuthor) => {
    if (!foundAuthor) {
      return err;
    }
    foundAuthor.posts.push(newPost);
    newPost.author = foundAuthor;
    await newPost.save((error, savedPost) => {
      if (error) {
        return error;
      }
      return res.json(savedPost);
    });
    await foundAuthor.save((error, savedAuthor) => {
      if (error) {
        return error;
      }
      savedAuthor;
    });
    return foundAuthor;
  });
};

exports.update = function (req, res) {
  const newAuthorId = req.params.authorId;
  const { postId } = req.params;
  const newPost = req.body;

  PostModel.findOne({ _id: postId }, (err, post) => {
    if (!post) {
      return err;
    }

    const oldAuthorID = post.author._id;

    AuthorModel.findById(oldAuthorID)
      .then((oldAuthor) => {
        if (!oldAuthor) {
          return res.status(400).send('No Author with that Particular id');
        }

        const index = oldAuthor.posts.indexOf(postId);

        if (index > -1) {
          oldAuthor.posts.splice(index, 1);
        }

        oldAuthor.save((error, savedAuthor) => {
          if (error) {
            return error;
          }
          return savedAuthor;
        });
        return oldAuthor;
      });


    AuthorModel.findById(newAuthorId)
      .then((newAuthor) => {
        if (!newAuthor) {
          return err;
        }

        newAuthor.posts.push(post);

        newAuthor.save((error, savedAuthor) => {
          if (error) {
            return error;
          }
          return savedAuthor;
        });

        post.author = newAuthor;

        _.merge(post, newPost);
        post.save((error, saved) => {
          if (error) {
            return error;
          }
          return res.json(saved);
        });
        return newAuthor;
      });
    return post;
  });
};
