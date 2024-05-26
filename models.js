const mongoose = require("mongoose");

let movieSchema = mongoose.Schema({
  title: { type: String, required: true },
  release: Number,
  description: { type: String, required: true },
  director: {
    name: String,
    bio: String,
    birth: Date,
    death: Date,
  },
  length: String,
  genre: {
    name: String,
    description: String,
  },

  imagePath: String,
});

let userSchema = mongoose.Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
  email: { type: String, required: true },
  birthday: Date,
  favMovies: [{ type: mongoose.Schema.Types.ObjectId, ref: "movie" }],
});


let movie = mongoose.model("movie", movieSchema);
let user = mongoose.model("user", userSchema);

module.exports.movie = movie;
module.exports.user = user;
