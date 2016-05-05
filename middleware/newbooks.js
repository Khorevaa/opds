var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
var parseString = require('xml2js').parseString;
var Book = require('.././models/books');
var saveBooks = require('.././middleware/savebooks');

module.exports = function () {
    var entries = [];
    var feed;
    var currentPage;

    function asyncLoop(page, callback) {
        if (currentPage != undefined || page == 0) {
            process.nextTick(function () {
                var xhr = new XMLHttpRequest();
                var link = 'http://flibusta.is/opds/new/' + page + '/new';
                xhr.withCredentials = true;
                xhr.open('GET', link, false);
                xhr.send();

                if (xhr.status != 200) {
                    console.log(xhr.status + ': ' + xhr.statusText);
                } else {
                    var xmlDoc;
                    parseString(xhr.responseText, function (err, xmlDoc) {
                        try {
                            feed = xmlDoc['feed'];
                            currentPage = feed['entry'];
                            entries = entries.concat(Array.from(currentPage));
                        } catch (e) {

                        }
                    });
                    asyncLoop(page + 1, callback);
                }
            })
        } else {
            callback();
        }
    }

    asyncLoop(0, function () {
        saveBooks(entries);
    });


};