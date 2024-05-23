const express = require("express"),
  morgan = require("morgan"),
  bodyParser = require("body-parser"),
  uuid = require("uuid");
const app = express();

app.use(bodyParser.json());

let users = [
  {
    id: 2,
    name: "joeseph",
    favMovies: ["Thor"],
    email: "joey@joetown.ca",
  },
  {},
  {},
];

let movies = [
  {
    title: "Iron Man",
    release: "2008",
    director: { name: "Jon Favreau" },
    length: "2h 6m",
    genre: {
      name: "superhero movie",
      description: "words",
    },
  },

  {
    title: "The Incredible Hulk",
    release: "2008",
    director: { name: "Louis Leterrier" },
    length: "1h 52m",
    genre: {
      name: "superhero movie",
      description: "words",
    },
  },

  {
    title: "Iron Man 2",
    release: "2010",
    director: { name: "Jon Favreau" },
    length: "2h 4m",
    genre: {
      name: "superhero movie",
      description: "words",
    },
  },

  {
    title: "Thor",
    release: "2011",
    director: { name: "Kenneth Branagh" },
    length: "1h 55m",
    genre: {
      name: "superhero movie",
      description: "words",
    },
  },

  {
    title: "Captain America: The First Avenger",
    release: "2011",
    director: { name: "Joe Johnston" },
    length: "2h 4m",
    genre: {
      name: "superhero movie",
      description: "words",
    },
  },

  {
    title: "The Avengers",
    release: "2012",
    director: { name: "Joss Whedon" },
    length: "2h 23m",
    genre: {
      name: "superhero movie",
      description: "words",
    },
  },

  {
    title: "Iron Man 3",
    release: "2013",
    director: { name: "Shane Black" },
    length: "2h 10m",
    genre: {
      name: "superhero movie",
      description: "words",
    },
  },

  {
    title: "Thor: The Dark World",
    release: "2013",
    director: { name: "Alan Taylor" },
    length: "1h 52m",
    genre: {
      name: "superhero movie",
      description: "words",
    },
  },

  {
    title: "Captain America: The Winter Soldier",
    release: "2014",
    director: { name: "Anthony & Joe Russo" },
    length: "2h 16m",
    genre: {
      name: "superhero movie",
      description: "words",
    },
  },

  {
    title: "Gaurdians of the Galaxy",
    release: "2014",
    director: { name: "James Gunn" },
    length: "2h 1m",
    genre: {
      name: "superhero movie",
      description: "words",
    },
  },
];

//create new user
app.post("/users", (req, res) => {
  const newUser = req.body;

  if (newUser.name) {
    newUser.id = uuid.v4();
    users.push(newUser);
    res.status(201).json(newUser);
  } else {
    res.status(400).send("user must include a name");
  }
});

//Update user info
app.put("/users/:id", (req, res) => {
  const { id } = req.params;
  const updatedUser = req.body;

  let user = users.find((user) => user.id == id);
  if (user) {
    user.name = updatedUser.name;
    res.status(200).json(user);
  } else {
    res.status(400).send("this user does not exist");
  }
});

//post new movie to favMovies array
app.post("/users/:id/movies/:movieTitle", (req, res) => {
  const { id, movieTitle } = req.params;

  let user = users.find((user) => user.id == id);
  if (user) {
    user.favMovies.push(movieTitle);
    res
      .status(200)
      .send(`${movieTitle} has been added to user ${id}'s list of fav's`);
  } else {
    res.status(400).send("this user does not exist");
  }
});

//delete a movie from favMovies array
app.delete("/users/:id/movies/:movieTitle", (req, res) => {
  const { id, movieTitle } = req.params;

  let user = users.find((user) => user.id == id);
  if (user) {
    user.favMovies = user.favMovies.filter((title) => title !== movieTitle);
    res
      .status(200)
      .send(`${movieTitle} has been removed from user ${id}'s list of fav's`);
  } else {
    res.status(400).send("this user does not exist");
  }
});

//delete user profile
app.delete("/users/:id", (req, res) => {
  const { id } = req.params;

  let user = users.find((user) => user.id == id);
  if (user) {
    users = users.filter((user) => user.id != id);
    res.status(200).send(`User ${id} has been deleted.`);
  } else {
    res.status(400).send("this user does not exist");
  }
});

//get all movies
app.get("/movies", (req, res) => {
  res.status(200).json(movies);
});

//get single movie data by name
app.get("/movies/:title", (req, res) => {
  const { title } = req.params;
  const movie = movies.find((movie) => movie.title === title);
  if (movie) {
    res.status(200).json(movie);
  } else {
    res.status(400).send("movie does not exist");
  }
});

//get genre by title
app.get("/movies/genre/:genreName", (req, res) => {
  const { genreName } = req.params;
  const genre = movies.find((movie) => movie.genre.name === genreName).genre;
  if (genre) {
    res.status(200).json(genre);
  } else {
    res.status(400).send("genre does not exist");
  }
});

//get director by name
app.get("/movies/directors/:directorName", (req, res) => {
  const { directorName } = req.params;
  const director = movies.find(
    (movie) => movie.director.name === directorName
  ).director;
  if (director) {
    res.status(200).json(director);
  } else {
    res.status(400).send("genre does not exist");
  }
});
////////

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
