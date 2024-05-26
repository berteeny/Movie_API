const express = require("express"),
  morgan = require("morgan"),
  bodyParser = require("body-parser"),
  uuid = require("uuid");
const app = express();
const mongoose = require("mongoose");
const models = require("./models.js");

const movies = models.movie;
const users = models.user;

mongoose.connect("mongodb://localhost:27017/cfDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(bodyParser.json());

//create new user - tested
app.post("/users", async (req, res) => {
  await users
    .findOne({ Username: req.body.username })
    .then((user) => {
      if (user) {
        return res.status(400).send(req.body.username + "already exists");
      } else {
        users
          .create({
            username: req.body.username,
            password: req.body.password,
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
});

//add movie to user's favMovies - tested
app.post("/users/:username/movies/:movieID", async (req, res) => {
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
});

//update user info by username - tested
app.put("/users/:username", async (req, res) => {
  await users
    .findOneAndUpdate(
      { username: req.params.username },
      {
        $set: {
          username: req.body.username,
          password: req.body.password,
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
});

//delete a movie from favMovies array - tested
app.delete("/users/:username/movies/:movieID", async (req, res) => {
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
});

//delete user by username - tested
app.delete("/users/:username", async (req, res) => {
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
});

//get all movies - tested
app.get("/movies", async (req, res) => {
  await movies
    .find()
    .then((movies) => {
      res.status(201).json(movies);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
});

//get all users - tested
app.get("/users", async (req, res) => {
  await users
    .find()
    .then((users) => {
      res.status(201).json(users);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
});

//get user by username - tested
app.get("/users/:username", async (req, res) => {
  await users
    .findOne({ username: req.params.username })
    .then((user) => {
      res.json(user);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
});

//get single movie data by name - tested
app.get("/movies/:title", (req, res) => {
  movies
    .findOne({ title: req.params.title })
    .then((movie) => {
      res.json(movie);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
});

//get genre by name - tested
app.get("/movies/genre/:name", async (req, res) => {
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
});

//get director by name - tested
app.get("/movies/director/:name", async (req, res) => {
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
});
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

app.listen(8080, () => {
  console.log("Your app is listening on port 8080.");
});
