'use strict';

angular.module('netcast')
  .config(function ($stateProvider) {
    $stateProvider
      .state({
        name: 'indexdb',
        url: '/indexdb',
        templateUrl: 'views/indexdb/indexdb.html',
        controller: 'IndexdbCtrl',
        controllerAs: 'vm',
        resolve: {
          auth: function(Auth) {
            return Auth.isReadyLogged();
          },
        }
      });
  });