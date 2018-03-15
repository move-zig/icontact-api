#iContact API#

icontact-api provides a pomisified interface with iContact Pro's REST API.

To install icontact-api, use npm:

```
$ npm install icontact-api
```

##Examples##

###Instantiating an IContactAPI Object###

####TypeScript####
```
import IContactAPI from 'icontact-api';
import { IContact } from 'icontact-api';

const iContactAPI = new IContactAPI('my app id', 'my username', 'my password');
iContactAPI.setAccountId(9999999);
iContactAPI.setClientFolderId(9999);
```

####JavaScript####
```
var IContactAPI = require('icontact-api').default;

var iContactAPI = new IContactAPI('my app id', 'my username', 'my password');
iContactAPI.setAccountId(9999999);
iContactAPI.setClientFolderId(9999);
```

###Searching for a Contact###

####TypeScript####

```
// search by contactId
iContactAPI.getContacts({ contactId: 23 }).then((results => {
  console.log(results);
}).catch((err) => {
  console.log(err);
});

// search by state and firstName with pattern matching
iContactAPI.getContacts({ state: 'MD', firstName: 'John*' }).then((results => {
  console.log(results);
}).catch((err) => {
  console.log(err);
});
```

####JavaScript####

```
// search by contactId
iContactAPI.getContacts({ contactId: 23 }).then(function (results) {
  console.log(results);
}).catch(function (err) {
  console.log(err);
});

// search by state and firstName with pattern matching
iContactAPI.getContacts({ state: 'MD', firstName: 'John*' }).then(function (results) {
  console.log(results);
}).catch(function (err) {
  console.log(err);
});
```

###Add or Update a Contact and Subscribe It to a List###

####TypeScript####
```
const listId = 5;
const contact: IContact = {
  email: 'john@example.com',
  firstName: 'John',
  lastName: 'Doe',
};
iContactAPI.getContacts({ email: contact.email }).then((results) => {
  if (results.total === 0) {
    return iContactAPI.addContacts([contact]);
  } else {
    return iContactAPI.updateContact(results.contacts[0].contactId, contact);
  }
}).then((results) => {
  return iContactAPI.subscribeContactToList(results.contact.contactId, listId);
}).then((results) => {
  console.log(results);
}).catch((err) => {
  console.log(err);
});
```

####JavaScript####
```
var listId = 5;
var contact = {
  email: 'john@example.com',
  firstName: 'John',
  lastName: 'Doe',
};
iContactAPI.getContacts({ email: contact.email }).then(function (results) {
  if (results.total === 0) {
    return iContactAPI.addContacts([contact]);
  } else {
    return iContactAPI.updateContact(results.contacts[0].contactId, contact);
  }
}).then(function (results) {
  return iContactAPI.subscribeContactToList(results.contact.contactId, listId);
}).then(function (results) {
  console.log(results);
}).catch(function (err) {
  console.log(err);
});
```

##Testing##

Tests were written with [mocha](https://www.npmjs.com/package/mocha) and [chai](https://www.npmjs.com/package/chai).

Run them with `npm test`.