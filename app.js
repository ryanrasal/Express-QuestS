const express = require("express");
const port = process.env.APP_PORT ?? 5000;
const movieHandlers = require("./movieHandlers");
const userHandlers = require("./userHandlers");
const app = express();
app.use(express.json());
const jwt = require("jsonwebtoken");

const { hashPassword, verifyPassword, verifyToken } = require("./auth.js");

const welcome = (req, res) => {
  res.send("Welcome to my favourite movie list");
};
app.get("/", welcome);

/* routes publiques */

app.get("/api/movies", movieHandlers.getMovies);
app.get("/api/movies/:id", movieHandlers.getMovieById);
app.get("/api/users", userHandlers.getUsers);
app.get("/api/users/:id", userHandlers.getUserById);
app.post(
"/api/login",
  userHandlers.getUserByEmailWithPasswordAndPassToNext,
  verifyPassword
);
app.post("/api/users", hashPassword, userHandlers.postUser);

/* routes sécurisées */

app.post("/api/movies",verifyToken, movieHandlers.postMovie);
app.put("/api/movies/:id",verifyToken, movieHandlers.updateMovie);
app.delete("/api/movies/:id",verifyToken, movieHandlers.deleteMovie);
app.put("/api/users/:id",verifyToken, userHandlers.updateUser);
app.delete("/api/users/:id",verifyToken, userHandlers.deleteUser);


app.listen(port, (err) => {
  if (err) {
    console.error("Something bad happened");
  } else {
    console.log(`Server is listening on ${port}`);
  }
});
