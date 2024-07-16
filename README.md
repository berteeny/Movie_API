# Marvel Movie API

The Marvel Movie API is a RESTful API that communicates with a database of Marvel Movies, created with and hosted online by MongoDB. The [documentation](https://movie-api-v2dh.onrender.com/documentation.html) and logic for the API is hosted on Render. 

## Installation

The code can be pulled from this repository and run in a browser preview with 

`http://127.0.0.1:3000/documentation.html` to see the documentation. All `CRUD` operations can be run Postman.

## Features

The API allows users to:

- create a profile to store their information
- edit their profile details
- delete their profile
- get a full list of movies from the MongoDB database
- access information about each movie such as release, length, director and genre
- add and remove movies from their favourite movies list

## Authorization & Authentication
The app requires users to have an account with a password to use the API. It makes use of Bcrypt, CORS, Passport and UUID as dependencies, as well as JWT tokens and HTTPS for authorization and authentication. 

## Dependancies

- Node.js
- Express.js
- Bcrypt
- bodyParser
- CORS
- Mongoose
- Morgan
- Passport
- UUID
- MongoBD

## API Endpoints

Create new user: `/users` - Method: `POST`

Log in: `/login` - Method: `POST`

Update user profile: `/users/:username` - Method: `PUT`

Delete user profile: `/users/:username` - Method: `DELETE`

Return a list of all movies: `/movies` - Method: `GET`

Return data about a single movie: `/movies/:title` - Method: `GET`

Return data about a single genre: `/movies/genre/:genreName` - Method: `GET`

Return data about a single director: `/movies/director/:directorName` - Method: `GET`

Add a movie to user's favourites list: `/users/:username/movies/:movieID` - Method: `POST`

Remove a movie from user's favourites list: `/users/:username/movies/:movieID` - Method: `DELETE`

## Contributing

Pull requests are welcome. For major changes, please open an issue first
to discuss what you would like to change about the app.
