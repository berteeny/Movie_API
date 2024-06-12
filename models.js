const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

let movieSchema = mongoose.Schema({
  title: { type: String, required: true },
  release: Number,
  director: {
    name: String,
    bio: String,
    birth: String,
    death: String,
  },
  length: String,
  genre: {
    name: String,
    description: String,
  },
  description: { type: String, required: true },
  imagePath: String,
});

let userSchema = mongoose.Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
  email: { type: String, required: true },
  birthday: String,
  favMovies: [{ type: mongoose.Schema.Types.ObjectId, ref: "movie" }],
});

userSchema.statics.hashPassword = (password) => {
  return bcrypt.hashSync(password, 10);
};

userSchema.methods.validatePassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};

let movie = mongoose.model("movie", movieSchema);
let user = mongoose.model("user", userSchema);

module.exports.movie = movie;
module.exports.user = user;
