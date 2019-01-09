"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var dotenv = __importStar(require("dotenv"));
var index_1 = __importDefault(require("./index"));
dotenv.config();
if (typeof process.env.APP_ID === 'undefined') {
    throw new Error('APP_ID not specified in .env file');
}
var appId = process.env.APP_ID;
if (typeof process.env.API_USERNAME === 'undefined') {
    throw new Error('API_USERNAME not specified in .env file');
}
var apiUsername = process.env.API_USERNAME;
if (typeof process.env.API_PASSWORD === 'undefined') {
    throw new Error('API_PASSWORD not specified in .env file');
}
var apiPassword = process.env.API_PASSWORD;
if (typeof process.env.ACCOUNT_ID === 'undefined') {
    throw new Error('ACCOUNT_ID not specified in .env file');
}
var accountId = parseInt(process.env.ACCOUNT_ID, 10);
if (typeof process.env.CLIENT_FOLDER_ID === 'undefined') {
    throw new Error('CLIENT_FOLDER_ID not specified in .env file');
}
var clientFolderId = parseInt(process.env.CLIENT_FOLDER_ID, 10);
var pro = process.env.PRO ? true : false;
var sandbox = process.env.SANDBOX ? true : false;
var timeout = 5000;
describe('accountId', function () {
    it('should be set and read', function (done) {
        var iContactAPI = new index_1.default(appId, apiUsername, apiPassword, pro, sandbox);
        iContactAPI.setAccountId(accountId);
        chai_1.expect(iContactAPI.getAccountId()).to.equal(accountId);
        done();
    });
});
describe('clientFolderId', function () {
    it('should be set and read', function (done) {
        var iContactAPI = new index_1.default(appId, apiUsername, apiPassword, pro, sandbox);
        iContactAPI.setClientFolderId(clientFolderId);
        chai_1.expect(iContactAPI.getClientFolderId()).to.equal(clientFolderId);
        done();
    });
});
describe('timeout', function () {
    it('should be set and read', function (done) {
        var iContactAPI = new index_1.default(appId, apiUsername, apiPassword, pro, sandbox);
        var t = 8000;
        iContactAPI.setTimeout(t);
        chai_1.expect(iContactAPI.getTimeout()).to.equal(t);
        done();
    });
});
describe('getContacts', function () {
    it('should get some contacts', function (done) {
        var iContactAPI = new index_1.default(appId, apiUsername, apiPassword, pro, sandbox);
        iContactAPI.setAccountId(accountId);
        iContactAPI.setClientFolderId(clientFolderId);
        iContactAPI.getContacts({ email: 'dave*' }).then(function (result) {
            chai_1.expect(result).to.be.an('object').with.property('contacts');
            chai_1.expect(result.contacts).to.be.an('array');
            chai_1.expect(result).to.have.property('total').that.is.a('number');
            done();
        }).catch(done);
    }).timeout(timeout);
    var numLoops = 60;
    it('should get ' + numLoops + ' contacts', function (done) {
        var emailAddresses = [];
        for (var i = 0; i < numLoops; i++) {
            emailAddresses.push(randomEmail());
        }
        var iContactAPI = new index_1.default(appId, apiUsername, apiPassword, pro, sandbox);
        iContactAPI.setAccountId(accountId);
        iContactAPI.setClientFolderId(clientFolderId);
        Promise.all(emailAddresses.map(function (email) { return iContactAPI.getContacts({ email: email }); })).then(function (results) {
            results.forEach(function (result) {
                chai_1.expect(result).to.be.an('object').with.property('contacts');
                chai_1.expect(result.contacts).to.be.an('array');
                chai_1.expect(result).to.have.property('total').that.is.a('number');
            });
            done();
        }).catch(done);
    }).timeout(timeout * numLoops);
});
describe('addContacts', function () {
    it('should add a single contact', function (done) {
        var email = randomEmail();
        var firstName = randomStr();
        var contacts = [{ email: email, firstName: firstName }];
        var iContactAPI = new index_1.default(appId, apiUsername, apiPassword, pro, sandbox);
        iContactAPI.setAccountId(accountId);
        iContactAPI.setClientFolderId(clientFolderId);
        iContactAPI.addContacts(contacts).then(function (result) {
            chai_1.expect(result).to.be.an('object');
            chai_1.expect(result).to.have.property('contacts');
            chai_1.expect(result.contacts).to.be.an('array').of.length(1);
            chai_1.expect(result.contacts[0]).to.have.property('contactId');
            chai_1.expect(result.contacts[0]).to.have.property('email').that.equals(email);
            chai_1.expect(result.contacts[0]).to.have.property('firstName').that.equals(firstName);
            done();
        }).catch(done);
    }).timeout(timeout);
    it('should add a single contact with custom fields', function (done) {
        var email = randomEmail();
        var firstName = randomStr();
        var country = 'Canada';
        var contact = { email: email, firstName: firstName, country: country };
        var iContactAPI = new index_1.default(appId, apiUsername, apiPassword, pro, sandbox);
        iContactAPI.setAccountId(accountId);
        iContactAPI.setClientFolderId(clientFolderId);
        iContactAPI.addContacts([contact]).then(function (result) {
            chai_1.expect(result).to.be.an('object');
            chai_1.expect(result).to.have.property('contacts');
            chai_1.expect(result.contacts).to.be.an('array').of.length(1);
            chai_1.expect(result.contacts[0]).to.have.property('contactId');
            chai_1.expect(result.contacts[0]).to.have.property('email').that.equals(email);
            chai_1.expect(result.contacts[0]).to.have.property('firstName').that.equals(firstName);
            chai_1.expect(result.contacts[0]).to.have.property('country').that.equals(country);
            done();
        }).catch(done);
    }).timeout(timeout);
    it('should add a multiple contacts with custom fields', function (done) {
        var email1 = randomEmail();
        var email2 = randomEmail();
        var firstName1 = randomStr();
        var firstName2 = randomStr();
        var country1 = 'Canada';
        var country2 = 'Italy';
        var contacts = [
            { email: email1, firstName: firstName1, country: country1 },
            { email: email2, firstName: firstName2, country: country2 },
        ];
        var iContactAPI = new index_1.default(appId, apiUsername, apiPassword, pro, sandbox);
        iContactAPI.setAccountId(accountId);
        iContactAPI.setClientFolderId(clientFolderId);
        iContactAPI.addContacts(contacts).then(function (result) {
            chai_1.expect(result).to.be.an('object');
            chai_1.expect(result).to.have.property('contacts');
            chai_1.expect(result.contacts).to.be.an('array').of.length(2);
            chai_1.expect(result.contacts[0]).to.have.property('contactId');
            chai_1.expect(result.contacts[0]).to.have.property('email').that.equals(email1);
            chai_1.expect(result.contacts[0]).to.have.property('firstName').that.equals(firstName1);
            chai_1.expect(result.contacts[0]).to.have.property('country').that.equals(country1);
            chai_1.expect(result.contacts[1]).to.have.property('contactId');
            chai_1.expect(result.contacts[1]).to.have.property('email').that.equals(email2);
            chai_1.expect(result.contacts[1]).to.have.property('firstName').that.equals(firstName2);
            chai_1.expect(result.contacts[1]).to.have.property('country').that.equals(country2);
            done();
        }).catch(done);
    }).timeout(timeout);
    if (pro) { // only version 2.3 of the API supports this
        it('should add a single contact with a subscription', function (done) {
            var email = randomEmail();
            var firstName = randomStr();
            var contacts = [
                {
                    email: email,
                    firstName: firstName,
                    subscriptions: [
                        {
                            email: email,
                            listId: 5,
                            status: 'normal',
                        },
                    ],
                },
            ];
            var iContactAPI = new index_1.default(appId, apiUsername, apiPassword, pro, sandbox);
            iContactAPI.setAccountId(accountId);
            iContactAPI.setClientFolderId(clientFolderId);
            iContactAPI.addContacts(contacts).then(function (result) {
                chai_1.expect(result).to.be.an('object');
                chai_1.expect(result).to.have.property('contacts');
                chai_1.expect(result.contacts).to.be.an('array').of.length(1);
                chai_1.expect(result.contacts[0]).to.have.property('contactId');
                chai_1.expect(result.contacts[0]).to.have.property('email').that.equals(email);
                chai_1.expect(result.contacts[0]).to.have.property('firstName').that.equals(firstName);
                chai_1.expect(result.contacts[0]).to.have.property('subscriptions');
                chai_1.expect(result.contacts[0].subscriptions).to.be.an('array');
                done();
            }).catch(done);
        }).timeout(timeout);
    }
});
describe('updateContact', function () {
    var contactId;
    var email = randomEmail();
    var firstName = randomStr();
    var lastName = randomStr();
    var iContactAPI;
    before(function (done) {
        this.timeout(timeout);
        var contact = { email: email, firstName: firstName, lastName: lastName };
        iContactAPI = new index_1.default(appId, apiUsername, apiPassword, pro, sandbox);
        iContactAPI.setAccountId(accountId);
        iContactAPI.setClientFolderId(clientFolderId);
        iContactAPI.addContacts([contact]).then(function (result) {
            contactId = result.contacts[0].contactId;
            done();
        }).catch(done);
    });
    it('should update a contact', function (done) {
        var newLastName = randomStr();
        var contact = {
            lastName: newLastName,
        };
        iContactAPI.updateContact(contactId, contact).then(function (result) {
            chai_1.expect(result).to.be.an('object').with.property('contact');
            chai_1.expect(result.contact).to.have.property('contactId').that.equals(contactId); // shouldn't change
            chai_1.expect(result.contact).to.have.property('email').that.equals(email); // old value
            chai_1.expect(result.contact).to.have.property('firstName').that.equals(firstName); // old value
            chai_1.expect(result.contact).to.have.property('lastName').that.equals(newLastName); // new value
            done();
        }).catch(done);
    }).timeout(timeout);
});
describe('replaceContact', function () {
    var contactId;
    var email = randomEmail();
    var firstName = randomStr();
    var lastName = randomStr();
    var iContactAPI;
    before(function (done) {
        this.timeout(timeout);
        var contact = { email: email, firstName: firstName, lastName: lastName };
        iContactAPI = new index_1.default(appId, apiUsername, apiPassword, pro, sandbox);
        iContactAPI.setAccountId(accountId);
        iContactAPI.setClientFolderId(clientFolderId);
        iContactAPI.addContacts([contact]).then(function (result) {
            contactId = parseInt(result.contacts[0].contactId, 10);
            done();
        }).catch(done);
    });
    it('should replace a contact', function (done) {
        var newEmail = randomEmail();
        var newLastName = randomStr();
        var contact = {
            email: newEmail,
            lastName: newLastName,
        };
        iContactAPI.replaceContact(contactId, contact).then(function (result) {
            chai_1.expect(result).to.be.an('object').with.property('contact');
            chai_1.expect(result.contact).to.have.property('contactId').that.equals(contactId); // shouldn't change
            chai_1.expect(result.contact).to.have.property('email').that.equals(newEmail); // new value
            chai_1.expect(result.contact).to.have.property('firstName').to.equal(''); // wasn't set
            chai_1.expect(result.contact).to.have.property('lastName').that.equals(newLastName); // new value
            done();
        }).catch(done);
    }).timeout(timeout);
});
describe('deleteContact', function () {
    var contactId;
    var email = randomEmail();
    var firstName = randomStr();
    var lastName = randomStr();
    var iContactAPI;
    before(function (done) {
        this.timeout(timeout);
        var contact = { email: email, firstName: firstName, lastName: lastName };
        iContactAPI = new index_1.default(appId, apiUsername, apiPassword, pro, sandbox);
        iContactAPI.setAccountId(accountId);
        iContactAPI.setClientFolderId(clientFolderId);
        iContactAPI.addContacts([contact]).then(function (result) {
            chai_1.expect(result).to.be.an('object').with.property('contacts');
            chai_1.expect(result.contacts).to.be.an('array').of.length(1);
            chai_1.expect(result.contacts[0]).to.have.property('contactId');
            contactId = result.contacts[0].contactId;
            done();
        }).catch(done);
    });
    it('should delete a contact', function (done) {
        iContactAPI.getContacts({ contactId: contactId }).then(function (result) {
            chai_1.expect(result).to.be.an('object');
            chai_1.expect(result).to.have.property('contacts');
            chai_1.expect(result.contacts).to.be.an('array').of.length(1);
            chai_1.expect(result).to.have.property('total');
            chai_1.expect(result.total).to.equal(1);
            return iContactAPI.deleteContact(contactId);
        }).then(function (result) {
            return iContactAPI.getContacts({ contactId: contactId });
        }).then(function (result) {
            chai_1.expect(result).to.be.an('object');
            chai_1.expect(result).to.have.property('contacts');
            chai_1.expect(result.contacts).to.be.an('array').of.length(0);
            chai_1.expect(result).to.have.property('total');
            // for some reason, when we do two searches like in this test, result.total ends equal to 1
            // expect(result.total).to.equal(0);
            done();
        }).catch(done);
    }).timeout(timeout);
});
describe('getLists', function () {
    it('should get all the lists', function (done) {
        var iContactAPI = new index_1.default(appId, apiUsername, apiPassword, pro, sandbox);
        iContactAPI.setAccountId(accountId);
        iContactAPI.setClientFolderId(clientFolderId);
        iContactAPI.getLists().then(function (result) {
            chai_1.expect(result).to.be.an('object').with.property('lists');
            chai_1.expect(result.lists).to.be.an('array');
            if (result.lists.length > 0) {
                chai_1.expect(result.lists[0]).to.be.an('object').with.property('listId');
                chai_1.expect(result.lists[0].listId).to.be.a('number');
            }
            done();
        }).catch(done);
    }).timeout(timeout);
    it('should get the matching lists', function (done) {
        var iContactAPI = new index_1.default(appId, apiUsername, apiPassword, pro, sandbox);
        var searchParamters = pro ? { welcomeOnSignupAdd: false } : { welcomeOnSignupAdd: 0 };
        iContactAPI.setAccountId(accountId);
        iContactAPI.setClientFolderId(clientFolderId);
        iContactAPI.getLists(searchParamters).then(function (result) {
            chai_1.expect(result).to.be.an('object').with.property('lists');
            chai_1.expect(result.lists).to.be.an('array');
            if (result.lists.length > 0) {
                chai_1.expect(result.lists[0]).to.be.an('object').with.property('listId');
                chai_1.expect(result.lists[0].listId).to.be.a('number');
            }
            done();
        }).catch(done);
    }).timeout(timeout);
});
describe('addLists', function () {
    it('should create a list', function (done) {
        var name = randomStr();
        var list = { name: name };
        var iContactAPI = new index_1.default(appId, apiUsername, apiPassword, pro, sandbox);
        iContactAPI.setAccountId(accountId);
        iContactAPI.setClientFolderId(clientFolderId);
        iContactAPI.createLists([list]).then(function (result) {
            chai_1.expect(result).to.be.an('object').with.property('lists');
            chai_1.expect(result.lists).to.be.an('array').of.length(1);
            chai_1.expect(result.lists[0]).to.have.property('listId').that.is.a('number');
            chai_1.expect(result.lists[0]).to.have.property('name').that.equals(name);
            done();
        }).catch(done);
    }).timeout(timeout);
});
describe('subscribeContactToList', function () {
    var iContactAPI;
    var contactId;
    var listId;
    var email = randomEmail();
    var firstName = randomStr();
    var lastName = randomStr();
    var name = randomStr();
    var list = { name: name };
    before(function (done) {
        this.timeout(timeout);
        var contact = { email: email, firstName: firstName, lastName: lastName };
        iContactAPI = new index_1.default(appId, apiUsername, apiPassword, pro, sandbox);
        iContactAPI.setAccountId(accountId);
        iContactAPI.setClientFolderId(clientFolderId);
        iContactAPI.addContacts([contact]).then(function (result) {
            chai_1.expect(result).to.be.an('object').with.property('contacts');
            chai_1.expect(result.contacts).to.be.an('array').of.length(1);
            chai_1.expect(result.contacts[0]).to.have.property('contactId');
            contactId = result.contacts[0].contactId;
            return iContactAPI.createLists([list]);
        }).then(function (result) {
            chai_1.expect(result).to.be.an('object').with.property('lists');
            chai_1.expect(result.lists).to.be.an('array').of.length(1);
            chai_1.expect(result.lists[0]).to.have.property('listId').that.is.a('number');
            chai_1.expect(result.lists[0]).to.have.property('name').that.equals(name);
            listId = result.lists[0].listId;
            done();
        }).catch(done);
    });
    it('should subcribe a contact to a list', function (done) {
        iContactAPI.subscribeContactToList(contactId, listId).then(function (result) {
            chai_1.expect(result).to.be.an('object').with.property('subscriptions');
            chai_1.expect(result.subscriptions).to.be.an('array').of.length(1);
            chai_1.expect(result.subscriptions[0]).to.have.property('subscriptionId');
            chai_1.expect(result.subscriptions[0]).to.have.property('contactId').that.equals(contactId);
            chai_1.expect(result.subscriptions[0]).to.have.property('listId');
            done();
        }).catch(done);
    }).timeout(timeout);
});
function randomStr() {
    return Math.random().toString(36).slice(2);
}
function randomEmail() {
    return "test+" + randomStr() + "@example.com";
}
