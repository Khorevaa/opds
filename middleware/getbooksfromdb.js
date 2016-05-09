var Book = require('.././models/books');

module.exports = function (callback) {
    Book.find({}, function (err, books) {
        callback(books);
    });
};