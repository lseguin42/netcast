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
    $httpProvider.interceptors.push('versionInterceptor');

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

  .factory('versionInterceptor',
  function ($q, $cookieStore) {

    return {

      request: function (config) {
        config.headers = config.headers || {};
        var version = $cookieStore.get('version');
        if (version) {
          config.headers.version = version;
        }
        return config;
      },

      response: function (response) {
        var version = response.headers('update-version');
        if (version)
          $cookieStore.put('version', version);
        return response;
      },

      responseError: function (response) {
        if (response.status === 409)
          console.log('require update contacts (version out of date)');
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
