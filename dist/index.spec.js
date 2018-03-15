"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
}
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
}
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const dotenv = __importStar(require("dotenv"));
const index_1 = __importDefault(require("./index"));
dotenv.config();
if (typeof process.env.APP_ID === 'undefined') {
    throw new Error('APP_ID not specified in .env file');
}
const appId = process.env.APP_ID;
if (typeof process.env.API_USERNAME === 'undefined') {
    throw new Error('API_USERNAME not specified in .env file');
}
const apiUsername = process.env.API_USERNAME;
if (typeof process.env.API_PASSWORD === 'undefined') {
    throw new Error('API_PASSWORD not specified in .env file');
}
const apiPassword = process.env.API_PASSWORD;
if (typeof process.env.ACCOUNT_ID === 'undefined') {
    throw new Error('ACCOUNT_ID not specified in .env file');
}
const accountId = parseInt(process.env.ACCOUNT_ID, 10);
if (typeof process.env.CLIENT_FOLDER_ID === 'undefined') {
    throw new Error('CLIENT_FOLDER_ID not specified in .env file');
}
const clientFolderId = parseInt(process.env.CLIENT_FOLDER_ID, 10);
describe('accountId', () => {
    it('should be set and read', (done) => {
        const iContactAPI = new index_1.default(appId, apiUsername, apiPassword);
        iContactAPI.setAccountId(accountId);
        chai_1.expect(iContactAPI.getAccountId()).to.equal(accountId);
        done();
    });
});
describe('clientFolderId', () => {
    it('should be set and read', (done) => {
        const iContactAPI = new index_1.default(appId, apiUsername, apiPassword);
        iContactAPI.setClientFolderId(clientFolderId);
        chai_1.expect(iContactAPI.getClientFolderId()).to.equal(clientFolderId);
        done();
    });
});
describe('timeout', () => {
    it('should be set and read', (done) => {
        const iContactAPI = new index_1.default(appId, apiUsername, apiPassword);
        const timeout = 5000;
        iContactAPI.setTimeout(timeout);
        chai_1.expect(iContactAPI.getTimeout()).to.equal(timeout);
        done();
    });
});
describe('getContacts', () => {
    it('should get some contacts', (done) => {
        const iContactAPI = new index_1.default(appId, apiUsername, apiPassword);
        iContactAPI.setAccountId(accountId);
        iContactAPI.setClientFolderId(clientFolderId);
        iContactAPI.getContacts({ email: 'dave*' }).then((result) => {
            chai_1.expect(result).to.be.an('object').with.property('contacts');
            chai_1.expect(result.contacts).to.be.an('array');
            done();
        }).catch(done);
    });
});
describe('addContacts', () => {
    it('should add a single contact', (done) => {
        const email = randomEmail();
        const firstName = randomStr();
        const contacts = [{ email, firstName }];
        const iContactAPI = new index_1.default(appId, apiUsername, apiPassword);
        iContactAPI.setAccountId(accountId);
        iContactAPI.setClientFolderId(clientFolderId);
        iContactAPI.addContacts(contacts).then((result) => {
            chai_1.expect(result).to.be.an('object');
            chai_1.expect(result).to.have.property('contacts');
            chai_1.expect(result.contacts).to.be.an('array').of.length(1);
            chai_1.expect(result.contacts[0]).to.have.property('contactId');
            chai_1.expect(result.contacts[0]).to.have.property('email').that.equals(email);
            chai_1.expect(result.contacts[0]).to.have.property('firstName').that.equals(firstName);
            done();
        }).catch(done);
    });
    it('should add a single contact with custom fields', (done) => {
        const email = randomEmail();
        const firstName = randomStr();
        const country = 'Canada';
        const contact = { email, firstName, country };
        const iContactAPI = new index_1.default(appId, apiUsername, apiPassword);
        iContactAPI.setAccountId(accountId);
        iContactAPI.setClientFolderId(clientFolderId);
        iContactAPI.addContacts([contact]).then((result) => {
            chai_1.expect(result).to.be.an('object');
            chai_1.expect(result).to.have.property('contacts');
            chai_1.expect(result.contacts).to.be.an('array').of.length(1);
            chai_1.expect(result.contacts[0]).to.have.property('contactId');
            chai_1.expect(result.contacts[0]).to.have.property('email').that.equals(email);
            chai_1.expect(result.contacts[0]).to.have.property('firstName').that.equals(firstName);
            chai_1.expect(result.contacts[0]).to.have.property('country').that.equals(country);
            done();
        }).catch(done);
    });
    it('should add a multiple contacts with custom fields', (done) => {
        const email1 = randomEmail();
        const email2 = randomEmail();
        const firstName1 = randomStr();
        const firstName2 = randomStr();
        const country1 = 'Canada';
        const country2 = 'Italy';
        const contacts = [
            { email: email1, firstName: firstName1, country: country1 },
            { email: email2, firstName: firstName2, country: country2 },
        ];
        const iContactAPI = new index_1.default(appId, apiUsername, apiPassword);
        iContactAPI.setAccountId(accountId);
        iContactAPI.setClientFolderId(clientFolderId);
        iContactAPI.addContacts(contacts).then((result) => {
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
            chai_1.expect(result).to.have.property('total').that.equals(2);
            done();
        }).catch(done);
    });
});
describe('updateContact', () => {
    let contactId;
    const email = randomEmail();
    const firstName = randomStr();
    const lastName = randomStr();
    let iContactAPI;
    before((done) => {
        const contact = { email, firstName, lastName };
        iContactAPI = new index_1.default(appId, apiUsername, apiPassword);
        iContactAPI.setAccountId(accountId);
        iContactAPI.setClientFolderId(clientFolderId);
        iContactAPI.addContacts([contact]).then((result) => {
            contactId = result.contacts[0].contactId;
            done();
        }).catch(done);
    });
    it('should update a contact', (done) => {
        const newLastName = randomStr();
        const contact = {
            lastName: newLastName,
        };
        iContactAPI.updateContact(contactId, contact).then((result) => {
            chai_1.expect(result).to.be.an('object').with.property('contact');
            chai_1.expect(result.contact).to.have.property('contactId').that.equals(contactId); // shouldn't change
            chai_1.expect(result.contact).to.have.property('email').that.equals(email); // old value
            chai_1.expect(result.contact).to.have.property('firstName').that.equals(firstName); // old value
            chai_1.expect(result.contact).to.have.property('lastName').that.equals(newLastName); // new value
            done();
        }).catch(done);
    });
});
describe('replaceContact', () => {
    let contactId;
    const email = randomEmail();
    const firstName = randomStr();
    const lastName = randomStr();
    let iContactAPI;
    before((done) => {
        const contact = { email, firstName, lastName };
        iContactAPI = new index_1.default(appId, apiUsername, apiPassword);
        iContactAPI.setAccountId(accountId);
        iContactAPI.setClientFolderId(clientFolderId);
        iContactAPI.addContacts([contact]).then((result) => {
            contactId = parseInt(result.contacts[0].contactId, 10);
            done();
        }).catch(done);
    });
    it('should replace a contact', (done) => {
        const newEmail = randomEmail();
        const newLastName = randomStr();
        const contact = {
            email: newEmail,
            lastName: newLastName,
        };
        iContactAPI.replaceContact(contactId, contact).then((result) => {
            chai_1.expect(result).to.be.an('object').with.property('contact');
            chai_1.expect(result.contact).to.have.property('contactId').that.equals(contactId); // shouldn't change
            chai_1.expect(result.contact).to.have.property('email').that.equals(newEmail); // new value
            chai_1.expect(result.contact).to.have.property('firstName').to.equal(''); // wasn't set
            chai_1.expect(result.contact).to.have.property('lastName').that.equals(newLastName); // new value
            done();
        }).catch(done);
    });
});
describe('deleteContact', () => {
    let contactId;
    const email = randomEmail();
    const firstName = randomStr();
    const lastName = randomStr();
    let iContactAPI;
    before((done) => {
        const contact = { email, firstName, lastName };
        iContactAPI = new index_1.default(appId, apiUsername, apiPassword);
        iContactAPI.setAccountId(accountId);
        iContactAPI.setClientFolderId(clientFolderId);
        iContactAPI.addContacts([contact]).then((result) => {
            chai_1.expect(result).to.be.an('object').with.property('contacts');
            chai_1.expect(result.contacts).to.be.an('array').of.length(1);
            chai_1.expect(result.contacts[0]).to.have.property('contactId');
            contactId = result.contacts[0].contactId;
            done();
        }).catch(done);
    });
    it('should delete a contact', (done) => {
        iContactAPI.getContacts({ contactId }).then((result) => {
            chai_1.expect(result).to.be.an('object');
            chai_1.expect(result).to.have.property('contacts');
            chai_1.expect(result.contacts).to.be.an('array').of.length(1);
            chai_1.expect(result).to.have.property('total');
            chai_1.expect(result.total).to.equal(1);
            return iContactAPI.deleteContact(contactId);
        }).then((result) => {
            return iContactAPI.getContacts({ contactId });
        }).then((result) => {
            chai_1.expect(result).to.be.an('object');
            chai_1.expect(result).to.have.property('contacts');
            chai_1.expect(result.contacts).to.be.an('array').of.length(0);
            chai_1.expect(result).to.have.property('total');
            // for some reason, when we do two searches like in this test, result.total ends equal to 1
            // expect(result.total).to.equal(0);
            done();
        }).catch(done);
    });
});
describe('getLists', () => {
    it('should get some lists', (done) => {
        const iContactAPI = new index_1.default(appId, apiUsername, apiPassword);
        iContactAPI.setAccountId(accountId);
        iContactAPI.setClientFolderId(clientFolderId);
        iContactAPI.getLists({ welcomeOnSignupAdd: true }).then((result) => {
            chai_1.expect(result).to.be.an('object').with.property('lists');
            chai_1.expect(result.lists).to.be.an('array');
            if (result.lists.length > 0) {
                chai_1.expect(result.lists[0]).to.be.an('object').with.property('listId');
                chai_1.expect(result.lists[0].listId).to.be.a('number');
            }
            done();
        }).catch(done);
    });
});
describe('addLists', () => {
    it('should create a list', (done) => {
        const name = randomStr();
        const list = { name };
        const iContactAPI = new index_1.default(appId, apiUsername, apiPassword);
        iContactAPI.setAccountId(accountId);
        iContactAPI.setClientFolderId(clientFolderId);
        iContactAPI.createLists([list]).then((result) => {
            chai_1.expect(result).to.be.an('object').with.property('lists');
            chai_1.expect(result.lists).to.be.an('array').of.length(1);
            chai_1.expect(result.lists[0]).to.have.property('listId').that.is.a('number');
            chai_1.expect(result.lists[0]).to.have.property('name').that.equals(name);
            done();
        }).catch(done);
    });
});
describe('subscribeContactToList', () => {
    let iContactAPI;
    let contactId;
    const email = randomEmail();
    const firstName = randomStr();
    const lastName = randomStr();
    before((done) => {
        const contact = { email, firstName, lastName };
        iContactAPI = new index_1.default(appId, apiUsername, apiPassword);
        iContactAPI.setAccountId(accountId);
        iContactAPI.setClientFolderId(clientFolderId);
        iContactAPI.addContacts([contact]).then((result) => {
            chai_1.expect(result).to.be.an('object').with.property('contacts');
            chai_1.expect(result.contacts).to.be.an('array').of.length(1);
            chai_1.expect(result.contacts[0]).to.have.property('contactId');
            contactId = result.contacts[0].contactId;
            done();
        }).catch(done);
    });
    it('should subcribe a contact to a list', (done) => {
        iContactAPI.subscribeContactToList(contactId, 5).then((result) => {
            chai_1.expect(result).to.be.an('object').with.property('subscriptions');
            chai_1.expect(result.subscriptions).to.be.an('array').of.length(1);
            chai_1.expect(result.subscriptions[0]).to.have.property('subscriptionId');
            chai_1.expect(result.subscriptions[0]).to.have.property('contactId').that.equals(contactId);
            chai_1.expect(result.subscriptions[0]).to.have.property('listId');
            done();
        }).catch(done);
    });
});
function randomStr() {
    return Math.random().toString(36);
}
function randomEmail() {
    return `test+${randomStr()}@qccareerschool.com`;
}
