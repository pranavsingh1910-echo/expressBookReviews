const express = require('express');
const axios = require('axios');

let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;

let public_users = express.Router();

// Register a new user
public_users.post("/register", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (!username || !password) {
        return res.status(400).send("Username and password are required");
    }

    if (isValid(username)) {
        return res.status(400).send("User already exists");
    }

    users.push({
        username: username,
        password: password
    });

    res.send("User successfully registered. Now you can login");
});

// Get all books
public_users.get("/", function (req, res) {
    res.send(JSON.stringify(books));
});

// Get book by ISBN
public_users.get("/isbn/:isbn", function (req, res) {
    const isbn = req.params.isbn;

    if (books[isbn]) {
        res.send(JSON.stringify(books[isbn]));
    } else {
        res.status(404).send("Book not found");
    }
});

// Get books by author
public_users.get("/author/:author", function (req, res) {
    const author = req.params.author;
    let result = {};

    for (let isbn in books) {
        if (books[isbn].author === author) {
            result[isbn] = books[isbn];
        }
    }

    res.send(JSON.stringify(result));
});

// Get books by title
public_users.get("/title/:title", function (req, res) {
    const title = req.params.title;
    let result = {};

    for (let isbn in books) {
        if (books[isbn].title === title) {
            result[isbn] = books[isbn];
        }
    }

    res.send(JSON.stringify(result));
});

// Get reviews for a book
public_users.get("/review/:isbn", function (req, res) {
    const isbn = req.params.isbn;

    if (books[isbn]) {
        res.send(JSON.stringify({
            reviews: books[isbn].reviews
        }));
    } else {
        res.status(404).send("Book not found");
    }
});

// Add or update a review
public_users.put("/review/:isbn", function (req, res) {
    const isbn = req.params.isbn;
    const username = req.body.username;
    const review = req.body.review;

    if (!books[isbn]) {
        return res.status(404).send("Book not found");
    }

    books[isbn].reviews[username] = review;

    res.send({
        message: "Review added/updated successfully",
        reviews: books[isbn].reviews
    });
});

// Delete a review
public_users.delete("/review/:isbn", function (req, res) {
    const isbn = req.params.isbn;

    if (!books[isbn]) {
        return res.status(404).send("Book not found");
    }

    books[isbn].reviews = {};

    res.send({
        message: "Review for ISBN " + isbn + " deleted"
    });
});


// =====================================================
// ASYNC/AWAIT + AXIOS IMPLEMENTATION
// =====================================================

// Task 10 - Get all books using Axios
async function getAllBooks() {
    try {
        const response = await axios.get("http://localhost:5000/");
        return response.data;
    } catch (error) {
        console.log(error.message);
    }
}

// Task 11 - Get book by ISBN using Axios
async function getBookByISBN(isbn) {
    try {
        const response = await axios.get(
            `http://localhost:5000/isbn/${isbn}`
        );
        return response.data;
    } catch (error) {
        console.log(error.message);
    }
}

// Task 12 - Get books by author using Axios
async function getBooksByAuthor(author) {
    try {
        const response = await axios.get(
            `http://localhost:5000/author/${encodeURIComponent(author)}`
        );
        return response.data;
    } catch (error) {
        console.log(error.message);
    }
}

// Task 13 - Get books by title using Axios
async function getBooksByTitle(title) {
    try {
        const response = await axios.get(
            `http://localhost:5000/title/${encodeURIComponent(title)}`
        );
        return response.data;
    } catch (error) {
        console.log(error.message);
    }
}


// Export router
module.exports.general = public_users;