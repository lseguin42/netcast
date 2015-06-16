'use strict';

angular.module('netcast')
  .config(function ($stateProvider) {
    $stateProvider
      .state({
      	name: 'signup',
      	url: '/signup',
        templateUrl: 'views/signup/signup.html',
        controller: 'SignupCtrl',
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
