const authorRouter = require('express').Router();
const authorController = require('../controllers/author');

authorRouter.param('id', authorController.params);

authorRouter.route('/authors')
  .get(authorController.get)
  .post(authorController.post);

authorRouter.route('/authors/:id')
  .get(authorController.getOne)
  .put(authorController.update)
  .delete(authorController.delete);

module.exports = authorRouter;
