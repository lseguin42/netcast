'use strict';

angular.module('netcast')
  .controller('ContactsCtrl', function (Auth, $http) {

  	var user = Auth.getUser();
    var vm = this;

    console.log(user);

    angular.extend(vm, {

      name: 'ContactsCtrl',

      contact: { email: '', nickname: '' },

      contacts: user.contacts, 

      addContact: function () {
      	var contact = { email: vm.contact.email, nickname: vm.contact.nickname };
      	$http.put('/api/users/me/contacts/', contact)
      		.success(function () {
      			console.log('new contact added');
      			vm.contacts.push(contact);
      		})
      		.error(function () {
      			console.log('fail add new contact');
      		});
      },

    });

  });
