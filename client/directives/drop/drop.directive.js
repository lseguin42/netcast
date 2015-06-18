'use strict';

angular.module('netcast')
  .directive('drop', function (SingleFileList) {
    return {
      restrict: 'A',
      link: function (scope, element) {
        element.bind('dragenter', function() {
          element.addClass('over');
        }).bind('dragleave', function() {
          element.removeClass('over');
        }).bind('dragover', function(event) {
          event.stopPropagation();
          event.preventDefault();
          event.dataTransfer.dropEffect = 'copy';
        }).bind('drop', function(event) {
          event.stopPropagation();
          event.preventDefault();
          element.removeClass('over');
          SingleFileList.importList(event.dataTransfer.files);
        });
      }
    };
  });
