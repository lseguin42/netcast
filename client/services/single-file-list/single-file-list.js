'use strict';

angular.module('netcast')
  .service('SingleFileList', function ($rootScope) {
    var files = [];
    
    this.getFiles = function() {
      return files;
    };
    
    this.add = function(file) {
      var reader = new FileReader();
      reader.onload = function() {
        files.push(file);
        $rootScope.$apply();
        
        reader.onerror = null;
        reader.abort();
      };
      reader.onerror = function() {
        alert('Unable to add "' + file.name + '".');
      };
      reader.readAsArrayBuffer(file);
    };
    
    this.importList = function(list) {
      var len = list.length;
      for (var i = 0; i < len; i++)
        this.add(list[i]);
    };
    
    this.remove = function(index) {
      files.splice(index, 1);
    };
    
    this.flush = function() {
      files = [];
    };
  });
