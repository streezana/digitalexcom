const mongoose = require("mongoose");

const bookSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  content: {
    type: String,
    required: true,
  },
  bookImage: {
    type: String,
  },
  userId: {
    type: String,
    required: true,
  },
  notes: {
    type: Boolean,
    required: true,
  },
});

module.exports = mongoose.model("Book", bookSchema);
