var angularApp = angular.module('angularApp', []);
angularApp.controller('angCtrl', function ($scope, $http) {

    $scope.getNewBooks = function () {
        $scope.newBooksHead = {title: "Название", author: "Автор", description: "Описание"};

        var newBooks = [];
        var url = 'res.xml';
        $http.get(url)
            .success(function (data, status, headers, config) {
                redirect('/getNew');
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

            }).error(function () {
            alert('error!');
        });
        ;
        $scope.newBooks = newBooks;
        $scope.summary = 'Общее количество новых книг: ' + newBooks.length;
    };

    var date = new Date();
    $scope.today = date;
});