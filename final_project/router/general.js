const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');





public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!isValid(username)) {
      users.push({ "username": username, "password": password });
      return res.status(200).json({ message: "User successfully registred. Now you can login" });
    } else {
      return res.status(404).json({ message: "User already exists!" });
    }
  }
  return res.status(404).json({ message: "Unable to register user." });
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
  res.send(JSON.stringify(books, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  if (isbn) {
    let book = books[isbn];
    if (book) {
      return res.status(200).json(book);
    } else {
      return res.status(404).json({ message: "Book not found" });
    }
  } else {
    return res.status(400).json({ message: "Invalid ISBN number" });
  }
});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
  let matchingBooks = [];
  const author = req.params.author;
  let keys = Object.keys(books);
  for (let i = 0; i < keys.length; i++) {
    let book = books[keys[i]];
    if (book.author === author) {
      matchingBooks.push(book);
    }
  }
  if (matchingBooks.length > 0) {
    return res.status(200).json(matchingBooks);
  }
  else {
    return res.status(404).json({ message: "Book not found" });
  }


});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
  let matchingBooks = [];
  const title = req.params.title;
  let keys = Object.keys(books);
  for (let i = 0; i < keys.length; i++) {
    let book = books[keys[i]];
    if (book.title === title) {
      matchingBooks.push(book);
    }
  }
  if (matchingBooks.length > 0) {
    return res.status(200).json(matchingBooks);
  }
  else {
    return res.status(404).json({ message: "Book not found" });
  }
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  if (isbn) {
    let book = books[isbn];
    if (book) {
      return res.status(200).json(book.reviews);
    } else {
      return res.status(404).json({ message: "Book not found" });
    }
  } else {
    return res.status(400).json({ message: "Invalid ISBN number" });
  }

});

//task 10
public_users.get('/with-Promises', function (req, res) {
  new Promise((resolve, reject) => {
    resolve({"books" : books});
  })
    .then((allBooks) => {
      res.send(allBooks);
    })
    .catch((error) => {
      res.status(500).send('Error fetching books');
      reject(error);
    });
});



//task 11
public_users.get('/isbn-with-promises/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  if (isbn) {
    let book = books[isbn];
    if (book) {
      new Promise((resolve, reject) => {
        resolve({"book" : book});
      })
        .then((book) => {
          res.send(book);
        })
        .catch((error) => {
          res.status(500).send('Error fetching book');
          reject(error);
        });
    } else {
      return res.status(404).json({ message: "Book not found" });
    }
  } else {
    return res.status(400).json({ message: "Invalid ISBN number" });
  }
});

//task 12
public_users.get('/author-with-promises/:author', function (req, res) {
  let matchingBooks = [];
  const author = req.params.author;
  let keys = Object.keys(books);
  for (let i = 0; i < keys.length; i++) {
    let book = books[keys[i]];
    if (book.author === author) {
      matchingBooks.push(book);
    }
  }
  if (matchingBooks.length > 0) {
    new Promise((resolve, reject) => {
      resolve({"books" : matchingBooks});
    })
      .then((books) => {
        res.send(books);
      })
      .catch((error) => {
        res.status(500).send('Error fetching books');
        reject(error);
      });
  }
  else {
    return res.status(404).json({ message: "Book not found" });
  }
});

//task 13
public_users.get('/title-with-promises/:title', function (req, res) {
  let matchingBooks = [];
  const title = req.params.title;
  let keys = Object.keys(books);
  for (let i = 0; i < keys.length; i++) {
    let book = books[keys[i]];
    if (book.title === title) {
      matchingBooks.push(book);
    }
  }
  if (matchingBooks.length > 0) {
    new Promise((resolve, reject) => {
      resolve({"books" : matchingBooks});
    })
      .then((books) => {
        res.send(books);
      })
      .catch((error) => {
        res.status(500).send('Error fetching books');
        reject(error);
      });
  }
  else {
    return res.status(404).json({ message: "Book not found" });
  }
});



module.exports.general = public_users;
