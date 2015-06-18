'use strict';

angular.module('netcast', [
  'ui.router',
  'ngCookies',
  'btford.socket-io'
])
  .config(function ($urlRouterProvider, $locationProvider, $httpProvider) {

    $urlRouterProvider.otherwise('/');

    $locationProvider.html5Mode(true);
    $httpProvider.interceptors.push('authInterceptor');
    $httpProvider.interceptors.push('checksumInterceptor');

  })

  .factory('authInterceptor',
  function ($rootScope, $q, $cookieStore, $location) {
    return {

      request: function (config) {
        config.headers = config.headers || {};
        if ($cookieStore.get('token')) {
          config.headers.Authorization = 'Bearer ' + $cookieStore.get('token');
        }
        return config;
      },

      responseError: function (response) {
        if (response.status === 401) {
          $location.path('/login');
          $cookieStore.remove('token');
          return $q.reject(response);
        }
        else {
          return $q.reject(response);
        }
      }

    };
  })

  .factory('checksumInterceptor',
  function ($q, $cookieStore) {

    return {

      request: function (config) {
        config.headers = config.headers || {};
        var checksum = $cookieStore.get('checksum');
        if (checksum) {
          config.headers.checksum = checksum;
        }
        return config;
      },

      response: function (response) {
        var checksum = response.headers('update-checksum');
        if (checksum)
          $cookieStore.put('checksum', checksum);
        return response;
      },

      responseError: function (response) {
        if (response.status === 409)
          console.log('require update contacts (checksum is invalid)');
        return $q.reject(response);
      }

    };
  })

  .run(function ($rootScope, $state, Auth) {

    $rootScope.Auth = Auth;

    $rootScope.$on('$stateChangeStart', function (event, next) {

    });
    
    $rootScope.$on('$stateChangeError', function (event, toState, toParams, fromState, fromParams, error) {
      console.log(error);
      return $state.go('home');
    });

  });
