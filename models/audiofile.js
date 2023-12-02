const mongoose = require("mongoose");

const audioSchema = mongoose.Schema({
  audioFile: {
    type: String,
  },
  bookId: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Audio", audioSchema);
