'use strict';

angular.module('netcast')
  .controller('HomeCtrl', function ($scope, SingleFileList) {

    var vm = this;

    angular.extend(vm, {
      
      name: 'HomeCtrl',
      
    });

    $scope.files = SingleFileList.getFiles();
  });
