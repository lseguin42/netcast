'use strict';

angular.module('netcast')
  .config(function ($stateProvider) {
    $stateProvider
      .state({
      	name: 'contacts',
      	url: '/contacts',
        templateUrl: 'views/contacts/contacts.html',
        controller: 'ContactsCtrl',
        controllerAs: 'vm',
        resolve: {
          auth: function(Auth) {
            return Auth.isReadyLogged();
          },
        }
      });
  });
