var angularApp = angular.module('angularApp', ['ngSanitize', 'angular-loading-bar', 'pascalprecht.translate', 'ngCookies']);

angularApp.config(function run($translateProvider) {
    $translateProvider.translations('en', {
            BUTTON_LANG_RU: "Русский",
            BUTTON_LANG_EN: "English",
            Language: "Language",
            Welcome_to: "Welcome to",
            Welcome: "Welcome",
            Search_in_DataBase: "Search in DataBase",
            Find: "Find",
            Get_newest_100: "Get newest 100 books from DB",
            Search: "Search",
            Today: "Today",
            Book_filter_by_category: "Book filter by category (russian letters)",
            Book_filter_by_author: "Book filter by author (russian letters)",
            Count_books: "Count books in the table",
            Filter: "Filter",
            Main: "Home",
            Cabinet: "Cabinet",
            Log_in: "Log in",
            Log_out: "Log out",
            Date: "Date",
            Title: "Title",
            Author: "Author",
            Category: "Category",
            Description: "Description",
            OR: "OR",
            Welcome_to_OPDS_Builder: "Welcome to OPDS Builder",
            Log_in_or_Sign_in: "Log in or Sign in",
            First_login_message: "If you don't have account it'll be created",
            Email: "Email",
            Password: "Password",
            Your_cabinet: "Your cabinet",
            Login_in_with: "Login in with"
        })
        .translations('ru', {
            BUTTON_LANG_RU: "Русский",
            BUTTON_LANG_EN: "English",
            Language: "Язык",
            Welcome_to: "Добро пожаловать в",
            Welcome: "Добро пожаловать",
            Search_in_DataBase: "Поиск книг в базе",
            Find: "Искать",
            Get_newest_100: "Получить новейшие 100 книг из базы",
            Search: "Поиск",
            Today: "Сегодня",
            Book_filter_by_category: "Фильтр книг по категориям",
            Book_filter_by_author: "Фильтр книг по авторам",
            Count_books: "Количество книг в таблице",
            Filter: "Фильтр",
            Main: "Главная",
            Cabinet: "Кабинет",
            Log_in: "Войти",
            Log_out: "Выйти",
            Date: "Дата",
            Title: "Название",
            Author: "Автор",
            Category: "Категория",
            Description: "Описание",
            OR: "ИЛИ",
            Welcome_to_OPDS_Builder: "Добро пожаловать в OPDS Builder",
            Log_in_or_Sign_in: "Войдите или зарегистрируйтесь!",
            First_login_message: "Если вы еще не регистрировались логин (email) и пароль будут созданы впервые.",
            Email: "Электронный адрес",
            Password: "Пароль",
            Your_cabinet: "Ваш кабинет",
            Login_in_with: "Войти через"
        });
    var $cookies;
    angular.injector(['ngCookies']).invoke(['$cookies', function(_$cookies_) {
        $cookies = _$cookies_;
    }]);
    var lang = $cookies.get('selected');
    console.log('cookie val = ' + lang);
    $(document).ready(function() {
        $('#langToRemember').find('[data-class="' + lang + '"]').attr('selected', 'selected');
    });
    $translateProvider.preferredLanguage(lang || 'ru');
});


angularApp.controller('angCtrl', function ($scope, $http, $window, $translate, $cookies) {
    var ctrl = this;

    ctrl.language = ctrl.language;
    ctrl.languages = ['en', 'ru'];

    ctrl.updateLanguage = function() {
        $cookies.put('selected', ctrl.language);
        //$('#langToRemember').find('[data-class="' + ctrl.language + '"]').attr('selected', 'selected');
        $translate.use(ctrl.language);
    };

    $scope.getNewBooks = function () {
        $scope.newBooksHead = {
            title: "Title", author: "Author", description: "Description", updated: "Date",
            language: "Language", format: "Format", category: "Category", bookid: "ID"
        };

        var newBooks = [];
        var url = '/getBooksFromDB';
        $http.get(url)
            .success(function (data) {

                data.forEach(function (item, i, data) {
                    newBooks.push(item);
                });

                $scope.newBooks = newBooks;
                $scope.summary = newBooks.length;

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
    }

    $scope.downloadBook = function (link) {

        var userDirectory = prompt('Enter local path to folder for file saving', '');
        if (!userDirectory) {
            alert('Saving cancelled or empty path');
            return;
        }

        var destination = userDirectory + '\\';

        var url = '/downloadBook';
        var inputData = {
            link: 'http://flibusta.is/b/' + link + '/txt',
            destination: destination
        };
        var config = {
            params: inputData,
            headers: {'Accept': 'application/json'}
        };
        $http.get(url, config)
            .success(function (data) {
                if (data != '') {
                    alert('Книга загружена! \nВы можете найти файл по адресу: ' + data);
                }

            }).error(function () {
            alert('error!');
        });
    }

    $scope.redirectToFlibusta = function (link) {
        $window.open('http://flibusta.is/b/' + link);
    }

    $scope.fields = [
        {name: 'Author', value: 'author'},
        {name: 'Title', value: 'title'},
        {name: 'Category', value: 'category'}
    ];


    var date = new Date();
    $scope.today = date;
});