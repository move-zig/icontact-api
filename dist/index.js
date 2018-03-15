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
const HTTPStatus = __importStar(require("http-status"));
const request_1 = __importDefault(require("request"));
class IContactAPI {
    constructor(appId, apiUsername, apiPassword) {
        this.host = 'https://api.icpro.co';
        this.timeout = 5000;
        this.accountId = null;
        this.clientFolderId = null;
        this.appId = appId;
        this.apiUsername = apiUsername;
        this.apiPassword = apiPassword;
    }
    setTimeout(timeout) { this.timeout = timeout; }
    getTimeout() { return this.timeout; }
    setAccountId(accountId) { this.accountId = accountId; }
    getAccountId() { return this.accountId; }
    setClientFolderId(clientFolderId) { this.clientFolderId = clientFolderId; }
    getClientFolderId() { return this.clientFolderId; }
    getContacts(searchParameters) {
        return new Promise((resolve, reject) => {
            try {
                const uri = `${this.getBaseURI()}/contacts`;
                const options = {
                    headers: this.getHeaders(),
                    json: true,
                    method: 'GET',
                    qs: searchParameters,
                    timeout: this.timeout,
                };
                request_1.default(uri, options, (err, response, body) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    if (response.statusCode !== HTTPStatus.OK) {
                        reject(new Error(`Got status code ${response.statusCode} (expecting 200)\n\n${JSON.stringify(body)}`));
                        return;
                    }
                    if (typeof body.contacts !== 'undefined' && Array.isArray(body.contacts)) {
                        for (const c of body.contacts) {
                            if (typeof c.contactId === 'string') {
                                c.contactId = parseInt(c.contactId, 10);
                            }
                        }
                    }
                    if (typeof body.contacts !== 'undefined' && Array.isArray(body.contacts)) {
                        for (const c of body.contacts) {
                            if (typeof c.contactId === 'string') {
                                c.contactId = parseInt(c.contactId, 10);
                            }
                        }
                    }
                    resolve(body);
                });
            }
            catch (err) {
                reject(err);
            }
        });
    }
    /** adds new contacts--remember to subscribe them to a list */
    addContacts(contacts) {
        return new Promise((resolve, reject) => {
            for (const contact of contacts) {
                if (typeof contact.contactId !== 'undefined') {
                    reject(new Error('`contactId` cannot be included in creation requests'));
                    return;
                }
                if (typeof contact.email === 'undefined') {
                    reject(new Error('`email` is a required field for all creation requests'));
                    return;
                }
            }
            try {
                const uri = `${this.getBaseURI()}/contacts`;
                const options = {
                    body: contacts,
                    headers: this.getHeaders(),
                    json: true,
                    method: 'POST',
                    timeout: this.timeout,
                };
                request_1.default(uri, options, (err, response, body) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    if (response.statusCode !== HTTPStatus.OK) {
                        reject(new Error(`Got status code ${response.statusCode} (expecting 200)\n\n${JSON.stringify(body)}`));
                        return;
                    }
                    if (typeof body.contacts !== 'undefined' && Array.isArray(body.contacts)) {
                        for (const c of body.contacts) {
                            if (typeof c.contactId === 'string') {
                                c.contactId = parseInt(c.contactId, 10);
                            }
                        }
                    }
                    resolve(body);
                });
            }
            catch (err) {
                reject(err);
            }
        });
    }
    /** updates a contact, replacing only the fields supplied */
    updateContact(id, contact) {
        return new Promise((resolve, reject) => {
            try {
                const uri = `${this.getBaseURI()}/contacts/${id}`;
                const options = {
                    body: contact,
                    headers: this.getHeaders(),
                    json: true,
                    method: 'POST',
                    timeout: this.timeout,
                };
                request_1.default(uri, options, (err, response, body) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    if (response.statusCode !== HTTPStatus.OK) {
                        reject(new Error(`Got status code ${response.statusCode} (expecting 200)\n\n${JSON.stringify(body)}`));
                        return;
                    }
                    if (typeof body.contact !== 'undefined' && typeof body.contact.contactId === 'string') {
                        body.contact.contactId = parseInt(body.contact.contactId, 10);
                    }
                    resolve(body);
                });
            }
            catch (err) {
                reject(err);
            }
        });
    }
    /** completely replaces a contact, must include email */
    replaceContact(id, contact) {
        return new Promise((resolve, reject) => {
            if (typeof contact.email === 'undefined') {
                reject(new Error('`listId` is a required field for all creation requests'));
                return;
            }
            try {
                const uri = `${this.getBaseURI()}/contacts/${id}`;
                const options = {
                    body: contact,
                    headers: this.getHeaders(),
                    json: true,
                    method: 'PUT',
                    timeout: this.timeout,
                };
                request_1.default(uri, options, (err, response, body) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    if (response.statusCode !== HTTPStatus.OK) {
                        reject(new Error(`Got status code ${response.statusCode} (expecting 200)\n\n${JSON.stringify(body)}`));
                        return;
                    }
                    if (typeof body.contact !== 'undefined' && typeof body.contact.contactId === 'string') {
                        body.contact.contactId = parseInt(body.contact.contactId, 10);
                    }
                    resolve(body);
                });
            }
            catch (err) {
                reject(err);
            }
        });
    }
    /** completely replaces a contact, must include email */
    deleteContact(id) {
        return new Promise((resolve, reject) => {
            try {
                const uri = `${this.getBaseURI()}/contacts/${id}`;
                const options = {
                    headers: this.getHeaders(),
                    json: true,
                    method: 'DELETE',
                    timeout: this.timeout,
                };
                request_1.default(uri, options, (err, response, body) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    if (response.statusCode !== HTTPStatus.OK) {
                        reject(new Error(`Got status code ${response.statusCode} (expecting 200)\n\n${JSON.stringify(body)}`));
                        return;
                    }
                    resolve(body);
                });
            }
            catch (err) {
                reject(err);
            }
        });
    }
    getLists(searchParameters) {
        return new Promise((resolve, reject) => {
            try {
                const uri = `${this.getBaseURI()}/lists`;
                const options = {
                    headers: this.getHeaders(),
                    json: true,
                    method: 'GET',
                    qs: searchParameters,
                    timeout: this.timeout,
                };
                request_1.default(uri, options, (err, response, body) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    if (response.statusCode !== HTTPStatus.OK) {
                        reject(new Error(`Got status code ${response.statusCode} (expecting 200)\n\n${JSON.stringify(body)}`));
                        return;
                    }
                    if (typeof body.lists !== 'undefined' && Array.isArray(body.lists)) {
                        for (const l of body.lists) {
                            if (typeof l.listId === 'string') {
                                l.listId = parseInt(l.listId, 10);
                            }
                            if (typeof l.welcomeMessageId === 'string') {
                                if (l.welcomeMessageId === '') {
                                    l.welcomeMessageId = null;
                                }
                                else {
                                    l.welcomeMessageId = parseInt(l.welcomeMessageId, 10);
                                }
                            }
                            if (typeof l.emailOwnerOnChange === 'string') {
                                l.emailOwnerOnChange = !!parseInt(l.emailOwnerOnChange, 10);
                            }
                            if (typeof l.welcomeOnManualAdd === 'string') {
                                l.welcomeOnManualAdd = !!parseInt(l.welcomeOnManualAdd, 10);
                            }
                            if (typeof l.welcomeOnSignupAdd === 'string') {
                                l.welcomeOnSignupAdd = !!parseInt(l.welcomeOnSignupAdd, 10);
                            }
                        }
                    }
                    resolve(body);
                });
            }
            catch (err) {
                reject(err);
            }
        });
    }
    createLists(lists) {
        return new Promise((resolve, reject) => {
            for (const list of lists) {
                if (typeof list.name === 'undefined') {
                    reject(new Error('`name` is a required field for all creation requests'));
                    return;
                }
                if (typeof list.listId !== 'undefined') {
                    reject(new Error('`listId` cannot be included in creation requests'));
                    return;
                }
            }
            try {
                const uri = `${this.getBaseURI()}/lists`;
                const options = {
                    body: lists,
                    headers: this.getHeaders(),
                    json: true,
                    method: 'POST',
                    timeout: this.timeout,
                };
                request_1.default(uri, options, (err, response, body) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    if (response.statusCode !== HTTPStatus.OK) {
                        reject(new Error(`Got status code ${response.statusCode} (expecting 200)\n\n${JSON.stringify(body)}`));
                        return;
                    }
                    if (typeof body.lists !== 'undefined' && Array.isArray(body.lists)) {
                        for (const l of body.lists) {
                            if (typeof l.listId === 'string') {
                                l.listId = parseInt(l.listId, 10);
                            }
                            if (typeof l.welcomeMessageId === 'string') {
                                if (l.welcomeMessageId === '') {
                                    l.welcomeMessageId = null;
                                }
                                else {
                                    l.welcomeMessageId = parseInt(l.welcomeMessageId, 10);
                                }
                            }
                            if (typeof l.emailOwnerOnChange === 'string') {
                                l.emailOwnerOnChange = Boolean(parseInt(l.emailOwnerOnChange, 10));
                            }
                            if (typeof l.welcomeOnManualAdd === 'string') {
                                l.welcomeOnManualAdd = Boolean(parseInt(l.welcomeOnManualAdd, 10));
                            }
                            if (typeof l.welcomeOnSignupAdd === 'string') {
                                l.welcomeOnSignupAdd = Boolean(parseInt(l.welcomeOnSignupAdd, 10));
                            }
                        }
                    }
                    resolve(body);
                });
            }
            catch (err) {
                reject(err);
            }
        });
    }
    subscribeContactToList(contactId, listId, status) {
        if (typeof status === 'undefined') {
            status = 'normal';
        }
        return new Promise((resolve, reject) => {
            try {
                const uri = `${this.getBaseURI()}/subscriptions`;
                const options = {
                    body: [{
                            contactId,
                            listId,
                            status,
                        }],
                    headers: this.getHeaders(),
                    json: true,
                    method: 'POST',
                    timeout: this.timeout,
                };
                request_1.default(uri, options, (err, response, body) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    if (response.statusCode !== HTTPStatus.OK) {
                        reject(new Error(`Got status code ${response.statusCode} (expecting 200)\n\n${JSON.stringify(body)}`));
                        return;
                    }
                    if (typeof body.subscriptions !== 'undefined' && Array.isArray(body.subscriptions)) {
                        for (const s of body.subscriptions) {
                            if (typeof s.contactId === 'string') {
                                s.contactId = parseInt(s.contactId, 10);
                            }
                            if (typeof s.listId === 'string') {
                                s.listId = parseInt(s.listId, 10);
                            }
                        }
                    }
                    resolve(body);
                });
            }
            catch (err) {
                reject(err);
            }
        });
    }
    getBaseURI() {
        if (this.accountId === null) {
            throw new Error('accountId not supplied. use iContact.setAccountId() first.');
        }
        if (this.clientFolderId === null) {
            throw new Error('accountId not supplied. use iContact.setAccountId() first.');
        }
        return `${this.host}/icp/a/${this.accountId}/c/${this.clientFolderId}`;
    }
    getHeaders() {
        return {
            'Accept': 'application/json',
            'Api-AppId': this.appId,
            'Api-Password': this.apiPassword,
            'Api-Username': this.apiUsername,
            'Api-Version': '2.3',
            'Except': '',
        };
    }
}
exports.default = IContactAPI;
