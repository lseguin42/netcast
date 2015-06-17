'use strict';

angular.module('netcast')
  .controller('SignupCtrl', function ($location, Auth) {

    var vm = this;

    angular.extend(vm, {

      name: 'SignupCtrl',

      /**
       * User credentials
       */
      user: { email: 'test@test.com', password: 'test' },

      /**
       * Signup
       */
      signup: function () {
        console.log('signup');
        Auth.signup(vm.user)
          .then(function () {
            console.log('location');
            $location.path('/');
          })
          .catch(function (err) {
            console.log('ERROR');
            vm.error = err;
          });
      },

    });

  });
