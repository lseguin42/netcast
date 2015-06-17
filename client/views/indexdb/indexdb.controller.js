'use strict';

angular.module('netcast')
  .controller('IndexdbCtrl', function ($http) {

    var vm = this;
    var storeReady = false;
    var contactsLoaded = false; 
    var contactsDB = new IDBStore ({
        dbVersion: 1,
        storeName: 'contact-index',
        keyPath: 'id',
        autoIncrement: true,
        onStoreReady: function () {
            storeReady = true;
            console.log('store ready');
        },
    });

    angular.extend(vm, {
      name: 'IndexdbCtrl',
      contacts: [],
      addContacts: function () {
        for (var i=0; i < 20; i++) {
            var contact = { email: 'vincent' + i + '@42.fr', nickname: 'vincent' + i };
            $http.put('/api/users/me/contacts/', contact)
            .success(function () {
                console.log('New contact added:');
            })
            .error(function () {
                console.log('Cannot add new contact');
            }); 
        }

      },
      getContacts: function() {
        $http.get('/api/users/me/contacts/')
          .success( function (contacts) {
            console.log('Contact retreived from server:', contacts);
            vm.contacts = contacts;
            contactsLoaded = true;
          })
          .error(function () {
            console.log('Cannot retreive contact from server');
          }); 
      },
      insertContacts: function () {
        if (storeReady && contactsLoaded) {
            vm.clearBase();
            for (var i=0; i < vm.contacts.length; i++) {
                var contact = {
                    nickname: vm.contacts[i]['nickname'],
                    email: vm.contacts[i]['email'],
                };
                var onSuccess = function (id) {
                    console.log('Contact', id, 'inserted in Base');
                };
                var onError = function (error) {
                    console.log('Cannot insert contact in Base:', error);
                };
                contactsDB.put(contact, onSuccess, onError);
            }
        } else {
            console.log('Not Ready to insert contact');
        }
      },
      clearBase: function() {
        var onSuccess = function () {
            console.log('Base cleared');
        };
        var onError = function () {
            console.log('Cannot clear the Base');
        };
        contactsDB.clear(onSuccess, onError);
      },

    });

  });
