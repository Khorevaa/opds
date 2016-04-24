var angularApp = angular.module('angularApp', []);
angularApp.controller('angCtrl', function ($scope, $http) {

    $scope.getNewBooks = function () {
        $scope.newBooksHead = {title: "Название", author: "Автор", description: "Описание"};

        var newBooks = [];
        $http.get('http://flibusta.is/opds/new/0/new').success(function (data) {
            var parser = new DOMParser();
            var xmlDoc = parser.parseFromString(data, 'text/xml');
            var entries = xmlDoc.getElementsByTagName('entry');

            var nameNode;
            var description;
            var author;

            for (var i = 0, max = entries.length; i < max; i++) {
                try {
                    nameNode = entries[i].getElementsByTagName("title")[0].childNodes[0].nodeValue;
                    author = entries[i].getElementsByTagName("name")[0].childNodes[0].nodeValue;
                    description = entries[i].getElementsByTagName("content")[0].childNodes[0].nodeValue;
                }
                catch (e) {
                }
                newBooks[i] = {title: nameNode || '', author: author || '', description: description || ''};
            }

        });
        $scope.newBooks = newBooks;
        $scope.summary = 'Общее количество новых книг: ' + newBooks.length;
    };

    var date = new Date();
    $scope.today = date;
});