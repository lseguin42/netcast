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

  })
  .factory('authInterceptor',
  function ($rootScope, $q, $cookieStore, $location) {
    console.log('authInterceptor');
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

  .run(function ($rootScope, $state, Auth) {

    $rootScope.Auth = Auth;

    $rootScope.$on('$stateChangeStart', function (event, next) {
      Auth.isReadyLogged().catch(function () {
        if (next.authenticate)
          $state.go('home');
      });
    });

  });
