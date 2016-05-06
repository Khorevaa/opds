var parseString = require('xml2js').parseString;
var Book = require('.././models/books');

module.exports = function (entries) {

    var bookid;
    var title;
    var description;
    var author;
    var updated;
    var language;
    var format;
    var category;

    function asyncSave(i, callback) {
        if (i < entries.length) {
            try {
                bookid = entries[i]["id"][0].replace("tag:book:", "");
                title = entries[i]["title"][0];
                author = entries[i]["author"][0]["name"][0];
                description = entries[i]["content"][0]['_'];
                //updated = entries[i]["updated"][0];
                updated = new Date(Date.parse(entries[i]["updated"][0]));
                language = entries[i]["dc:language"][0];
                format = entries[i]["dc:format"][0];
                category = entries[i]["category"][0]['$']['term'];
            }
            catch (e) {

            }

            process.nextTick(function () {
                Book.findOne({'bookid': bookid}, function (err, book) {
                    if (err) throw err;
                    if (!book) {
                        var newBook = new Book();
                        newBook.bookid = bookid;
                        newBook.title = title || '';
                        newBook.author = author || '';
                        newBook.description = description || '';
                        newBook.updated = updated;
                        newBook.language = language || '';
                        newBook.format = format || '';
                        newBook.category = category || '';

                        newBook.save(function (err) {
                            if (err) throw err;
                        })
                    }
                    asyncSave(i + 1, callback);
                })
            })
        } else {
            callback();
        }
    }

    asyncSave(0, function () {

    });

};