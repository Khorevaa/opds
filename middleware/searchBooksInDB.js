var Book = require('.././models/books');

module.exports = function (searchText, searchField, callback) {

    if (searchField == 'author') {
        var config = {
            author: new RegExp(searchText)
        }
    } else if (searchField == 'title') {
        var config = {
            title: new RegExp(searchText)
        }
    } else {
        var config = {
            category: new RegExp(searchText)
        }
    }

    Book.find(config, function (err, books) {
        callback(books);
    }).sort({"updated": -1});
};