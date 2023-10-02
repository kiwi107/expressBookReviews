const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
  let validusers = users.filter((user) => {
    return user.username === username
  });
  if (validusers.length > 0) {
    return true;
  } else {
    return false;
  }
}

const authenticatedUser = (username,password)=>{ //returns boolean
  let validusers = users.filter((user) => {
    return (user.username === username && user.password === password)
  });
  if (validusers.length > 0) {
    return true;
  } else {
    return false;
  }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;


  if (!username || !password) {
    return res.status(404).json({ message: "Error logging in" });
  }

  if (authenticatedUser(username, password)) {
    let accessToken = jwt.sign({
      data: password
    }, 'access', { expiresIn: 60 * 60 });

    req.session.authorization = {
      accessToken, username
    }
    return res.status(200).send("User successfully logged in");
  } else {
    return res.status(208).json({ message: "Invalid Login. Check username and password" });
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const review = req.query.review;
  
  const loggedInUser = req.session.authorization.username;

  if (isbn && review && loggedInUser) {
    let book = books[isbn];
    if (book) {

      book.reviews[loggedInUser]=review;

      return res.status(200).json({ message: `Review added successfully on book ${book.title} by ${loggedInUser}` });
    } else {
      return res.status(404).json({ message: "Book not found" });
    }
  } else {
    return res.status(400).json({ message: "Invalid ISBN number, review, or user" });
  }
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
 
  const loggedInUser = req.session.authorization.username;

  if (isbn && loggedInUser) {
    let book = books[isbn];
    if (book) {

      delete book.reviews[loggedInUser];

      return res.status(200).json({ message: `Review deleted successfully on book ${book.title} by ${loggedInUser}` });
    } else {
      return res.status(404).json({ message: "Book not found" });
    }
  } else {
    return res.status(400).json({ message: "Invalid ISBN number or user" });
  }
});


module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
