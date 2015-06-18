'use strict';

angular.module('netcast')
  .directive('fileList', function () {
    return {
      restrict: 'E',
      scope: {
        files: '='
      },
      templateUrl: 'directives/file-list/file-list.html'
    };
  });
