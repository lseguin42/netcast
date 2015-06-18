'use strict';

angular.module('netcast')
  .service('SingleFileList', function () {
    var files = [];
    
    this.getFiles = function() {
      return files;
    };
    
    this.add = function(file) {
      files.push(file);
    };
    
    this.importList = function(list) {
      files.push.apply(files, list);
    };
    
    this.remove = function(index) {
      files.splice(index, 1);
    };
    
    this.flush = function() {
      files = [];
    };
  });
