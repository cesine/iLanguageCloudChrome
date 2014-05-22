/*global todomvc, angular */
'use strict';

/**
 * The main controller for the app. The controller:
 * - retrieves and persists the model via the todoStorage service
 * - exposes the model to the template and provides event handlers
 */
todomvc.controller('TodoCtrl', function TodoCtrl($scope, $location, $filter, todoStorage) {
  var todos = $scope.todos = [];

  // If there is saved data in storage, use it.
  // https://developer.chrome.com/apps/app_codelab5_data
  $scope.load = function(value) {
    if (value) {
      todos = $scope.todos = value;
      $scope.remainingCount = $filter('filter')(todos, {
        completed: false
      }).length;
    }
  }

  todoStorage.get(function(todos) {
    console.log("Got some todos", todos);
    $scope.$apply(function() {
      $scope.load(todos);
    });
  });

  $scope.newTodo = '';
  $scope.remainingCount = 0;
  $scope.editedTodo = null;

  if ($location.path() === '') {
    $location.path('/');
  }

  $scope.location = $location;

  $scope.$watch('location.path()', function(path) {
    $scope.statusFilter = {
      '/active': {
        completed: false
      },
      '/completed': {
        completed: true
      }
    }[path];
  });

  $scope.$watch('remainingCount == 0', function(val) {
    $scope.allChecked = val;
  });

  $scope.addTodo = function() {
    var newTodo = $scope.newTodo.trim();
    if (newTodo.length === 0) {
      return;
    }

    todos.push({
      title: newTodo,
      completed: false
    });
    todoStorage.put(todos);

    $scope.newTodo = '';
    $scope.remainingCount++;
  };

  $scope.editTodo = function(todo) {
    $scope.editedTodo = todo;
    // Clone the original todo to restore it on demand.
    $scope.originalTodo = angular.extend({}, todo);
  };

  $scope.doneEditing = function(todo) {
    $scope.editedTodo = null;
    todo.title = todo.title.trim();

    if (!todo.title) {
      $scope.removeTodo(todo);
    }

    todoStorage.put(todos);
  };

  $scope.revertEditing = function(todo) {
    todos[todos.indexOf(todo)] = $scope.originalTodo;
    $scope.doneEditing($scope.originalTodo);
  };

  $scope.removeTodo = function(todo) {
    $scope.remainingCount -= todo.completed ? 0 : 1;
    todos.splice(todos.indexOf(todo), 1);
    todoStorage.put(todos);
  };

  $scope.todoCompleted = function(todo) {
    $scope.remainingCount += todo.completed ? -1 : 1;
    todoStorage.put(todos);
  };

  $scope.clearCompletedTodos = function() {
    $scope.todos = todos = todos.filter(function(val) {
      return !val.completed;
    });
    todoStorage.put(todos);
  };

  $scope.markAll = function(completed) {
    todos.forEach(function(todo) {
      todo.completed = !completed;
    });
    $scope.remainingCount = completed ? todos.length : 0;
    todoStorage.put(todos);
  };
});
