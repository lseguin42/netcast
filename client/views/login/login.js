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
          notAuth: function(Auth) {
            return Auth.isReadyNotLogged();
          }
        }
      });
  });
