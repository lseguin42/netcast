'use strict';

angular.module('netcast')
  .config(function ($stateProvider) {
    $stateProvider
      .state({
      	name: 'signup',
      	url: '/signup',
        templateUrl: 'views/signup/signup.html',
        controller: 'SignupCtrl',
        controllerAs: 'vm'
      });
  });
