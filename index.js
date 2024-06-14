const express = require("express"),
  morgan = require("morgan"),
  bodyParser = require("body-parser"),
  uuid = require("uuid");
const app = express();
const mongoose = require("mongoose");
const models = require("./models.js");
const { check, validationResult } = require("express-validator");

const movies = models.movie;
const users = models.user;

//connecting to lOCAL cfDB database
// mongoose.connect("mongodb://localhost:27017/cfDB", {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });

//connecting to mongoDB online database
mongoose.connect(process.env.CONNECTION_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(bodyParser.json());

const cors = require("cors");
app.use(cors());

let auth = require("./auth.js")(app);
const passport = require("passport");
require("./passport.js");

//create new user - tested - no auth for this endpoint, user not created yet
app.post(
  "/users",
  //validation checks
  [
    check("username", "Username is required - mimimum 5 characters").isLength({
      min: 5,
    }),
    check(
      "username",
      "Username contains non alphanumeric characters - not allowed."
    ).isAlphanumeric(),
    check("password", "Password is required").not().isEmpty(),
    check("email", "Email does not appear valid").isEmail(),
  ],
  async (req, res) => {
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    let hashedPassword = users.hashPassword(req.body.password);
    await users
      .findOne({ username: req.body.username })
      .then((user) => {
        if (user) {
          return res.status(400).send(req.body.username + "already exists");
        } else {
          users
            .create({
              username: req.body.username,
              password: hashedPassword,
              email: req.body.email,
              birthday: req.body.birthday,
            })
            .then((user) => {
              res.status(201).json(user);
            })
            .catch((error) => {
              console.error(error);
              res.status(500).send("Error: " + error);
            });
        }
      })
      .catch((error) => {
        console.error(error);
        res.status(500).send("Error: " + error);
      });
  }
);

//add movie to user's favMovies - tested + auth
app.post(
  "/users/:username/movies/:movieID",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    if (req.user.username !== req.params.username) {
      return res.status(400).send("Permission denied");
    }
    await users
      .findOneAndUpdate(
        { username: req.params.username },
        {
          $push: {
            favMovies: req.params.movieID,
          },
        },
        { new: true }
      )
      .then((updatedUser) => {
        res.json(updatedUser);
      })
      .catch((er) => {
        console.error(err);
        res.status(500).send("Error: " + err);
      });
  }
);

//update user info by username - tested + auth
app.put(
  "/users/:username",
  [
    check("username", "Username is required").isLength({
      min: 5,
    }),
    check(
      "username",
      "Username contains non alphanumeric characters - not allowed."
    ).isAlphanumeric(),
    check("password", "Password is required").not().isEmpty(),
    check("email", "Email does not appear valid").isEmail(),
  ],
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    let hashedPassword = users.hashPassword(req.body.password);

    if (req.user.username !== req.params.username) {
      return res.status(400).send("Permission denied");
    }
    await users
      .findOneAndUpdate(
        { username: req.params.username },
        {
          $set: {
            username: req.body.username,
            password: hashedPassword,
            email: req.body.email,
            birthday: req.body.birthday,
          },
        },
        {
          new: true,
        }
      )
      .then((updatedUser) => {
        res.json(updatedUser);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error: " + err);
      });
  }
);

//delete a movie from favMovies array - tested + auth
app.delete(
  "/users/:username/movies/:movieID",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    if (req.user.username !== req.params.username) {
      return res.status(400).send("Permission denied");
    }
    await users
      .findOneAndUpdate(
        { username: req.params.username },
        {
          $pull: {
            favMovies: req.params.movieID,
          },
        },
        { new: true }
      )
      .then((updatedUser) => {
        res.json(updatedUser);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error: " + err);
      });
  }
);

//delete user by username - tested + auth
app.delete(
  "/users/:username",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    if (req.user.username !== req.params.username) {
      return res.status(400).send("Permission denied");
    }
    await users
      .findOneAndDelete({ username: req.params.username })
      .then((user) => {
        if (!user) {
          res.status(400).send((req.params.username = " was not found"));
        } else {
          res.status(200).send((req.params.username = " was deleted."));
        }
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error: " + err);
      });
  }
);

//get all movies - tested + auth
app.get(
  "/movies",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    await movies
      .find()
      .then((movies) => {
        res.status(201).json(movies);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error: " + err);
      });
  }
);

//get all users - tested + auth (add extra if() authorization block pending response from JA at CF)
app.get(
  "/users",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    await users
      .find()
      .then((users) => {
        res.status(201).json(users);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error: " + err);
      });
  }
);

//get user by username - tested + auth (add extra if() authorization block pending response from JA at CF)
app.get(
  "/users/:username",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    await users
      .findOne({ username: req.params.username })
      .then((user) => {
        res.json(user);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error: " + err);
      });
  }
);

//get single movie data by name - tested + auth
app.get(
  "/movies/:title",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    movies
      .findOne({ title: req.params.title })
      .then((movie) => {
        res.json(movie);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error: " + err);
      });
  }
);

//get genre by name - tested + auth
app.get(
  "/movies/genre/:name",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const genreName = req.params.name;
      const movie = await movies.findOne({ "genre.name": genreName });

      if (movie) {
        res.status(200).json(movie.genre);
      } else {
        res.status(404).send("This genre does not exist");
      }
    } catch (err) {
      console.error(err);
      res.status(500).send("Error: " + err);
    }
  }
);

//get director by name - tested + auth
app.get(
  "/movies/director/:name",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const directorName = req.params.name;
      const movie = await movies.findOne({ "director.name": directorName });

      if (movie) {
        res.status(200).json(movie.director);
      } else {
        res.status(404).send("This director does not exist");
      }
    } catch (err) {
      console.error(err);
      res.status(500).send("Error: " + err);
    }
  }
);
////////

//main page - tested
app.get("/", (req, res) => {
  res.send("Welcome to the Marvel Movie API");
});

//request logger with morgan
app.use(morgan("common"));

//display all files in public folder when requested
app.use(express.static("public"));

//error handling
app.use((err, req, res, next) => {
  console.log(err);
});

const port = process.env.PORT || 8080;
app.listen(port, "0.0.0.0", () => {
  console.log("Listening on Port " + port);
});
