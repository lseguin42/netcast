'use strict';

angular.module('netcast')
  .service('SingleFileList', function () {
    var files = [];
    
    this.add = function(file) {
      files.push(file);
    };
    
    this.importList = function(list) {
      files.push.apply(files, list);
      console.log(files);
    };
    
    this.flush = function() {
      files = [];
    };
  });
