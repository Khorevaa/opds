var angularApp = angular.module('angularApp', []);

angularApp.controller('angCtrl', function ($scope, $http) {

    $scope.getNewBooks = function () {
        $scope.newBooksHead = {
            title: "Название", author: "Автор", description: "Описание", updated: "Дата",
            language: "Язык", format: "Формат", category: "Категория", bookid: "ID"
        };

        var newBooks = [];
        var url = '/getBooksFromDB';
        $http.get(url)
            .success(function (data, status, headers, config) {

                data.forEach(function (item, i, data) {
                    newBooks.push(item);
                });

                $scope.newBooks = newBooks;
                $scope.summary = 'Общее количество книг в базе: ' + newBooks.length;

            }).error(function () {
            alert('error!');
        });
        ;

    };

    var date = new Date();
    $scope.today = date;
});