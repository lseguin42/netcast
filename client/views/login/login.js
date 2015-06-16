'use strict';

angular.module('netcast')
  .config(function ($stateProvider) {
    $stateProvider
      .state({
      	name: 'login',
      	url: '/login',
        templateUrl: 'views/login/login.html',
        controller: 'LoginCtrl',
        controllerAs: 'vm',
        resolve: {
          authenticated: function(Auth, $q) {
            var defer = $q.defer();
            Auth.isReadyLogged().then(function () {
              defer.reject();
            }).catch(function () {
              defer.resolve();
            });
            return defer.promise;
          }
        }
      });
  });
