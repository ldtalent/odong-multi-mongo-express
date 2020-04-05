const mongoose = require("mongoose"),

  { Schema } = mongoose;

const authorSchema = new Schema({
  "firstName": {
    "type": String,
    "min": 5,
    "required": true
  },
  "lastName": {
    "type": String,
    "min": 5,
    "required": true
  },
  "password": {
    "type": String,
    "min": 5,
    "required": true
  },
  "email": {
    "type": String,
    "min": 6,
    "required": true
  },
  "posts": [
    {
      "type": Schema.Types.ObjectId,
      "ref": "posts"
    }
  ]
}, {
  "usePushEach": true
});


module.exports = mongoose.model("authors", authorSchema);
