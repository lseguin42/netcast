'use strict';

angular.module('netcast')
  .factory('User', function ($rootScope) {
    
    var service = {
      contacts: [],
      
      offAuthFunc: null,
      
      onLogin: function(event, args) {
        service.contacts = args.contacts;
        
        service.offAuthFunc();
        service.offAuthFunc = $rootScope.$on('userDidLogout', service.onLogout);
      },
      
      onLogout: function(event) {
        service.contacts = [];
        
        service.offAuthFunc();
        service.offAuthFunc = $rootScope.$on('userDidLogin', service.onLogin);
      }
    };
    
    service.offAuthFunc = $rootScope.$on('userDidLogin', service.onLogin);
    
    return service;

  });
