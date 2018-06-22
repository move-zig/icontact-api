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
var HTTPStatus = __importStar(require("http-status"));
var https = __importStar(require("https"));
var request_1 = __importDefault(require("request"));
var IContactAPI = /** @class */ (function () {
    function IContactAPI(appId, apiUsername, apiPassword) {
        this.host = 'https://api.icpro.co';
        this.timeout = 5000;
        this.maxSockets = 40;
        this.agent = new https.Agent({ maxSockets: this.maxSockets, keepAlive: true, keepAliveMsecs: 8000 });
        this.baseRequest = request_1.default.defaults({ agent: this.agent });
        this.accountId = null;
        this.clientFolderId = null;
        this.appId = appId;
        this.apiUsername = apiUsername;
        this.apiPassword = apiPassword;
    }
    IContactAPI.prototype.setTimeout = function (timeout) { this.timeout = timeout; };
    IContactAPI.prototype.getTimeout = function () { return this.timeout; };
    IContactAPI.prototype.setAccountId = function (accountId) { this.accountId = accountId; };
    IContactAPI.prototype.getAccountId = function () { return this.accountId; };
    IContactAPI.prototype.setClientFolderId = function (clientFolderId) { this.clientFolderId = clientFolderId; };
    IContactAPI.prototype.getClientFolderId = function () { return this.clientFolderId; };
    IContactAPI.prototype.getContacts = function (searchParameters) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            try {
                var uri = _this.getBaseURI() + "/contacts";
                var options = {
                    headers: _this.getHeaders(),
                    json: true,
                    method: 'GET',
                    qs: searchParameters,
                    timeout: _this.timeout,
                };
                _this.baseRequest(uri, options, function (err, response, body) {
                    if (err) {
                        reject(err);
                        return;
                    }
                    if (response.statusCode !== HTTPStatus.OK) {
                        reject(new Error("Got status code " + response.statusCode + " (expecting 200)\n\n" + JSON.stringify(body)));
                        return;
                    }
                    if (typeof body.contacts !== 'undefined' && Array.isArray(body.contacts)) {
                        for (var _i = 0, _a = body.contacts; _i < _a.length; _i++) {
                            var c = _a[_i];
                            if (typeof c.contactId === 'string') {
                                c.contactId = parseInt(c.contactId, 10);
                            }
                        }
                    }
                    if (typeof body.contacts !== 'undefined' && Array.isArray(body.contacts)) {
                        for (var _b = 0, _c = body.contacts; _b < _c.length; _b++) {
                            var c = _c[_b];
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
    };
    /** adds new contacts--remember to subscribe them to a list */
    IContactAPI.prototype.addContacts = function (contacts) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            for (var _i = 0, contacts_1 = contacts; _i < contacts_1.length; _i++) {
                var contact = contacts_1[_i];
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
                var uri = _this.getBaseURI() + "/contacts";
                var options = {
                    body: contacts,
                    headers: _this.getHeaders(),
                    json: true,
                    method: 'POST',
                    timeout: _this.timeout,
                };
                _this.baseRequest(uri, options, function (err, response, body) {
                    if (err) {
                        reject(err);
                        return;
                    }
                    if (response.statusCode !== HTTPStatus.OK) { // note: not 201 CREATED
                        reject(new Error("Got status code " + response.statusCode + " (expecting 200)\n\n" + JSON.stringify(body)));
                        return;
                    }
                    if (typeof body.contacts !== 'undefined' && Array.isArray(body.contacts)) {
                        for (var _i = 0, _a = body.contacts; _i < _a.length; _i++) {
                            var c = _a[_i];
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
    };
    /** updates a contact, replacing only the fields supplied */
    IContactAPI.prototype.updateContact = function (id, contact) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            try {
                var uri = _this.getBaseURI() + "/contacts/" + id;
                var options = {
                    body: contact,
                    headers: _this.getHeaders(),
                    json: true,
                    method: 'POST',
                    timeout: _this.timeout,
                };
                _this.baseRequest(uri, options, function (err, response, body) {
                    if (err) {
                        reject(err);
                        return;
                    }
                    if (response.statusCode !== HTTPStatus.OK) {
                        reject(new Error("Got status code " + response.statusCode + " (expecting 200)\n\n" + JSON.stringify(body)));
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
    };
    /** completely replaces a contact, must include email */
    IContactAPI.prototype.replaceContact = function (id, contact) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            if (typeof contact.email === 'undefined') {
                reject(new Error('`listId` is a required field for all creation requests'));
                return;
            }
            try {
                var uri = _this.getBaseURI() + "/contacts/" + id;
                var options = {
                    body: contact,
                    headers: _this.getHeaders(),
                    json: true,
                    method: 'PUT',
                    timeout: _this.timeout,
                };
                _this.baseRequest(uri, options, function (err, response, body) {
                    if (err) {
                        reject(err);
                        return;
                    }
                    if (response.statusCode !== HTTPStatus.OK) {
                        reject(new Error("Got status code " + response.statusCode + " (expecting 200)\n\n" + JSON.stringify(body)));
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
    };
    /** completely replaces a contact, must include email */
    IContactAPI.prototype.deleteContact = function (id) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            try {
                var uri = _this.getBaseURI() + "/contacts/" + id;
                var options = {
                    headers: _this.getHeaders(),
                    json: true,
                    method: 'DELETE',
                    timeout: _this.timeout,
                };
                _this.baseRequest(uri, options, function (err, response, body) {
                    if (err) {
                        reject(err);
                        return;
                    }
                    if (response.statusCode !== HTTPStatus.OK) {
                        reject(new Error("Got status code " + response.statusCode + " (expecting 200)\n\n" + JSON.stringify(body)));
                        return;
                    }
                    resolve(body);
                });
            }
            catch (err) {
                reject(err);
            }
        });
    };
    IContactAPI.prototype.getLists = function (searchParameters) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            try {
                var uri = _this.getBaseURI() + "/lists";
                var options = {
                    headers: _this.getHeaders(),
                    json: true,
                    method: 'GET',
                    qs: searchParameters,
                    timeout: _this.timeout,
                };
                _this.baseRequest(uri, options, function (err, response, body) {
                    if (err) {
                        reject(err);
                        return;
                    }
                    if (response.statusCode !== HTTPStatus.OK) {
                        reject(new Error("Got status code " + response.statusCode + " (expecting 200)\n\n" + JSON.stringify(body)));
                        return;
                    }
                    if (typeof body.lists !== 'undefined' && Array.isArray(body.lists)) {
                        for (var _i = 0, _a = body.lists; _i < _a.length; _i++) {
                            var l = _a[_i];
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
    };
    IContactAPI.prototype.createLists = function (lists) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            for (var _i = 0, lists_1 = lists; _i < lists_1.length; _i++) {
                var list = lists_1[_i];
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
                var uri = _this.getBaseURI() + "/lists";
                var options = {
                    body: lists,
                    headers: _this.getHeaders(),
                    json: true,
                    method: 'POST',
                    timeout: _this.timeout,
                };
                _this.baseRequest(uri, options, function (err, response, body) {
                    if (err) {
                        reject(err);
                        return;
                    }
                    if (response.statusCode !== HTTPStatus.OK) {
                        reject(new Error("Got status code " + response.statusCode + " (expecting 200)\n\n" + JSON.stringify(body)));
                        return;
                    }
                    if (typeof body.lists !== 'undefined' && Array.isArray(body.lists)) {
                        for (var _i = 0, _a = body.lists; _i < _a.length; _i++) {
                            var l = _a[_i];
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
    };
    IContactAPI.prototype.subscribeContactToList = function (contactId, listId, status) {
        var _this = this;
        if (typeof status === 'undefined') {
            status = 'normal';
        }
        return new Promise(function (resolve, reject) {
            try {
                var uri = _this.getBaseURI() + "/subscriptions";
                var options = {
                    body: [{
                            contactId: contactId,
                            listId: listId,
                            status: status,
                        }],
                    headers: _this.getHeaders(),
                    json: true,
                    method: 'POST',
                    timeout: _this.timeout,
                };
                _this.baseRequest(uri, options, function (err, response, body) {
                    if (err) {
                        reject(err);
                        return;
                    }
                    if (response.statusCode !== HTTPStatus.OK) {
                        reject(new Error("Got status code " + response.statusCode + " (expecting 200)\n\n" + JSON.stringify(body)));
                        return;
                    }
                    if (typeof body.subscriptions !== 'undefined' && Array.isArray(body.subscriptions)) {
                        for (var _i = 0, _a = body.subscriptions; _i < _a.length; _i++) {
                            var s = _a[_i];
                            if (typeof s.contactId === 'string') {
                                s.contactId = parseInt(s.contactId, 10);
                            }
                            if (typeof s.listId === 'string') {
                                s.listId = parseInt(s.listId, 10);
                            }
                            if (typeof s.confirmationMessageId === 'string') {
                                s.confirmationMessageId = parseInt(s.confirmationMessageId, 10);
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
    };
    IContactAPI.prototype.getBaseURI = function () {
        if (this.accountId === null) {
            throw new Error('accountId not supplied. use iContact.setAccountId() first.');
        }
        if (this.clientFolderId === null) {
            throw new Error('accountId not supplied. use iContact.setAccountId() first.');
        }
        return this.host + "/icp/a/" + this.accountId + "/c/" + this.clientFolderId;
    };
    IContactAPI.prototype.getHeaders = function () {
        return {
            'Accept': 'application/json',
            'Api-AppId': this.appId,
            'Api-Password': this.apiPassword,
            'Api-Username': this.apiUsername,
            'Api-Version': '2.3',
            'Except': '',
        };
    };
    return IContactAPI;
}());
exports.default = IContactAPI;
