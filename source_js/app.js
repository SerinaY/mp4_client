var app = angular.module('mp4', ['ngRoute', 'mp4Controllers', 'mp4Services','720kb.datepicker']);

app.config(['$routeProvider', function($routeProvider) {
  $routeProvider.
    when('/profile/:UserId',{
    templateUrl: 'partials/profile.html',
    controller: 'ProfileController'
  }).
  when('/addtask', {
    templateUrl: 'partials/addtask.html',
    controller: 'AddTController'
  }).
  when('/settings', {
    templateUrl: 'partials/settings.html',
    controller: 'SettingsController'
  }).
  when('/userlist', {
    templateUrl: 'partials/userlist.html',
    controller: 'UserListController'
  }).
  when('/adduser', {
    templateUrl: 'partials/adduser.html',
    controller: 'AddUserController'
  }).
  when('/tasks', {
    templateUrl: 'partials/tasks.html',
    controller: 'TasksController'
  }).
  when('/editTask/', {
    templateUrl: 'partials/edittask.html',
    controller: 'EditTaskController'
  }).
  when('/editTask/:_id', {
    templateUrl: 'partials/edittask.html',
    controller: 'EditTaskController'
  }).

  otherwise({
    redirectTo: '/settings'
  });
}]);
