const express = require("express"),
  morgan = require("morgan");
const app = express();

let movies = [
  {
    Title: "Iron Man",
    Release: "2008",
    Director: "Jon Favreau",
    Length: "2h 6m",
  },

  {
    Title: "The Incredible Hulk",
    Release: "2008",
    Director: "Louis Leterrier",
    Length: "1h 52m",
  },

  {
    Title: "Iron Man 2",
    Release: "2010",
    Director: "Jon Favreau",
    Length: "2h 4m",
  },

  {
    Title: "Thor",
    Release: "2011",
    Director: "Kenneth Branagh",
    Length: "1h 55m",
  },

  {
    Title: "Captain America: The First Avenger",
    Release: "2011",
    Director: "Joe Johnston",
    Length: "2h 4m",
  },

  {
    Title: "The Avengers",
    Release: "2012",
    Director: "Joss Whedon",
    Length: "2h 23m",
  },

  {
    Title: "Iron Man 3",
    Release: "2013",
    Director: "Shane Black",
    Length: "2h 10m",
  },

  {
    Title: "Thor: The Dark World",
    Release: "2013",
    Director: "Alan Taylor",
    Length: "1h 52m",
  },

  {
    Title: "Captain America: The Winter Soldier",
    Release: "2014",
    Director: "Anthony & Joe Russo",
    Length: "2h 16m",
  },

  {
    Title: "Gaurdians of the Galaxy",
    Release: "2014",
    Director: "James Gunn",
    Length: "2h 1m",
  },
];

//GET requests
app.get("/movies", (req, res) => {
  res.json(movies);
});

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
