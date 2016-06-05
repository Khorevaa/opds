var http = require('http');
var fs = require('fs');
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

module.exports = function (url, dest, cb) {

    var xhr = new XMLHttpRequest();
    xhr.withCredentials = true;
    xhr.open('GET', url, false);
    xhr.send();

    if (xhr.status != 200 && xhr.status != 302) {
        console.log('Status ' + xhr.status + ': ' + xhr.statusText);
    } else if (xhr.status == 302) {
        var newURL = xhr.getResponseHeader("Location");
        var filename = newURL.substring(newURL.lastIndexOf('/') + 1);
        var fullFilePath = dest + filename;
        var file = fs.createWriteStream(fullFilePath);
        var request = http.get(newURL, function (response) {
            response.pipe(file);
            file.on('finish', function () {
                file.close(cb(fullFilePath));
            });
        }).on('error', function (err) {
            fs.unlink(dest);
            if (cb) cb(err.message);
        });
    } else {
        console.log('Status ' + xhr.status + ': ' + xhr.statusText);
        cb();
    }
};
