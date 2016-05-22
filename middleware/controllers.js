var angularApp = angular.module('angularApp', ['ngSanitize']);

angularApp.controller('angCtrl', function ($scope, $http) {

    $scope.getNewBooks = function () {
        $scope.newBooksHead = {
            title: "Название", author: "Автор", description: "Описание", updated: "Дата",
            language: "Язык", format: "Формат", category: "Категория", bookid: "ID"
        };

        var newBooks = [];
        var url = '/getBooksFromDB';
        $http.get(url)
            .success(function (data) {

                data.forEach(function (item, i, data) {
                    newBooks.push(item);
                });

                $scope.newBooks = newBooks;
                $scope.summary = 'Количество книг в таблице: ' + newBooks.length;

            }).error(function () {
            alert('error!');
        });
        ;

    };

    $scope.searchBooks = function (searchValue, selectedField) {

        $scope.newBooksHead = {
            title: "Название", author: "Автор", description: "Описание", updated: "Дата",
            language: "Язык", format: "Формат", category: "Категория", bookid: "ID"
        };

        var newBooks = [];
        var url = '/searchBooksInDB';

        var inputData = {
            searchValue: searchValue,
            selectedField: selectedField
        };

        var config = {
            params: inputData,
            headers: {'Accept': 'application/json'}
        };

        $http.get(url, config)
            .success(function (data) {

                data.forEach(function (item, i, data) {
                    newBooks.push(item);
                });

                $scope.newBooks = newBooks;
                $scope.summary = 'Количество книг в таблице: ' + newBooks.length;

            }).error(function () {
            alert('error!');
        });
        ;


    }

    $scope.fields = [
        {name: 'Автор', value: 'author'},
        {name: 'Название', value: 'title'},
        {name: 'Категория', value: 'category'}
    ];


    var date = new Date();
    $scope.today = date;
});