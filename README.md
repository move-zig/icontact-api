# iContact API

icontact-api provides a pomisified interface for iContact and iContact Pro's REST APIs.

To install icontact-api, use npm:

```
$ npm install icontact-api
```

## Examples

### Instantiating an IContactAPI Object

```javascript
import IContactAPI from 'icontact-api';

const iContactAPI = new IContactAPI('my app id', 'my username', 'my password');
iContactAPI.setAccountId(9999999);
iContactAPI.setClientFolderId(9999);
```

### iContact and iContact Pro

By default, the IContactAPI object will attempt to connect to the iContact Pro REST API. To instantiate an object that will connect to regular iContact, pass `false` for the optional fourth constructor parameter:

```javascript
const iContactAPI = new IContactAPI('my app id', 'my username', 'my password', false);
```

### Sandbox Account

To connect to an iContact Sandbox account, pass `true` for the optional fifth constructor parameter.

```javascript
const iContactAPI = new IContactAPI('my app id', 'my username', 'my password', false, true);
```

Note that iContact Pro doesn't have a sandbox and the fifth parameter will be ignored.

### Searching for a Contact

```javascript
// search by contactId
iContactAPI.getContacts({ contactId: 23 }).then((results) => {
  console.log(results);
});

// search by state and firstName with pattern matching
iContactAPI.getContacts({ state: 'MD', firstName: 'John*' }).then((results) => {
  console.log(results);
});
```

### Add or Update a Contact and Subscribe It to a List

If you issue a contact creation request when a contact already exists (same email address), the old contact will be overwritten and any fields you don't provide will be blank on the resulting contact. To avoid this, see if a contact exists first and then issue either a create contacts request or an update contact request.

Note: Subscribing a contact to a list at the time of contact creation is a feature of version 2.3 of iContact's REST API. At the time of writing, only iContact Pro supports this version. If connecting to iContact, rather than iContact Pro, create a contact first and then subscribe it to a list using [IContact.subscribeContactToList](#subscribecontacttolist).

```javascript
const contact = {
  email: 'john@example.com',
  firstName: 'John',
  lastName: 'Doe',
  subscriptions: [
    {
      email: 'john@example.com',
      listId: 5,
      status: 'normal'
    },
  ],
};

iContactAPI.getContacts({ email: contact.email }).then((results) => {
  if (results.total === 0) {
    return iContactAPI.addContacts([contact]);
  } else {
    return iContactAPI.updateContact(results.contacts[0].contactId, contact);
  }
}).then((results) => {
  console.log(results);
});
```

## Reference

* [IContact.setTimeout](#settimeout)
* [IContact.getTimeout](#gettimeout)
* [IContact.setAccountId](#setaccountid)
* [IContact.getAccountId](#getaccountid)
* [IContact.setClientFolderId](#setclientfolderid)
* [IContact.getClientFolderId](#getclientfolderid)
* [IContact.getContacts](#getcontacts)
* [IContact.addContacts](#addcontacts)
* [IContact.updateContact](#updatecontact)
* [IContact.replaceContact](#replacecontact)
* [IContact.deleteContact](#deletecontact)
* [IContact.getLists](#getlists)
* [IContact.createLists](#createlists)
* [IContact.subscribeContactToList](#subscribecontacttolist)

### setTimeout

```typescript
IContact.setTimeout(timeout: number): void;
```
Sets the request timeout in miliseconds

### getTimeout

```typescript
IContact.getTimeout(): number;
```
Returns the current request timeout in miliseconds

### setAccountId
```typescript
IContact.setAccountId(accountId: number): void;
```
Sets the iContact account ID

### getAccountId
```typescript
IContact.getAccountId(): number | null;
```
Returns the current iContact account ID

### setClientFolderId

```typescript
IContact.setClientFolderId(clientFolderId: number): void;
```
Returns the current iContact client folder ID

### getClientFolderId

```typescript
IContact.getClientFolderId(): number | null;
```
Returns the current iContact client folder ID

### getContacts

```typescript
IContact.getContacts(searchParameters: IContact): Promise<IContactSearchResult>;
```
Retrieves the contacts matching the search parameters

### addContacts

```typescript
IContact.addContacts(contacts: IContact[]): Promise<any>;
```
Adds new contacts--remember to subscribe them to a list

### updateContact

```typescript
IContact.updateContact(id: number, contact: IContact): Promise<any>;
```
Updates a contact, replacing only the fields supplied

### replaceContact

```typescript
IContact.replaceContact(id: number, contact: IContact): Promise<any>;
```
Completely replaces a contact--must include email

### deleteContact

```typescript
IContact.deleteContact(id: number): Promise<any>;
```
Deletes a contact

### getLists

```typescript
IContact.getLists(searchParameters?: IList): Promise<IListSearchResult>;
```
Retrieves the lists matching the search parameters

### createLists

```typescript
IContact.createLists(lists: IList[]): Promise<any>;
```
Adds new lists

### subscribeContactToList

```typescript
IContact.subscribeContactToList(contactId: number, listId: number, status?: IListStatus): Promise<any>;
```
Subscribes a contact to a list

## Testing

Tests were written with [mocha](https://www.npmjs.com/package/mocha) and [chai](https://www.npmjs.com/package/chai).

Run them with

```
$ npm test
```

Testing will require an iContact or iContact Pro account. Provide the credentials in an `.env` file, following the example in `.env.example`.
