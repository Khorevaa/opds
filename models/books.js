var mongoose = require('mongoose');

var bookSchema = mongoose.Schema({
    bookid: String,
    updated: Date,
    title: String,
    author: String,
    language: String,
    format: String,
    category: String,
    description: String
});

module.exports = mongoose.model('Book', bookSchema);