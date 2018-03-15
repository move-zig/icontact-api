import * as HTTPStatus from 'http-status';
import request from 'request';

export default class IContactAPI {

  public host = 'https://api.icpro.co';

  private appId: string;
  private apiUsername: string;
  private apiPassword: string;
  private timeout = 5000;

  private accountId: number | null = null;
  private clientFolderId: number | null = null;

  constructor(appId: string, apiUsername: string, apiPassword: string) {
    this.appId = appId;
    this.apiUsername = apiUsername;
    this.apiPassword = apiPassword;
  }

  public setTimeout(timeout: number) { this.timeout = timeout; }
  public getTimeout() { return this.timeout; }

  public setAccountId(accountId: number) { this.accountId = accountId; }
  public getAccountId() { return this.accountId; }

  public setClientFolderId(clientFolderId: number) { this.clientFolderId = clientFolderId; }
  public getClientFolderId() { return this.clientFolderId; }

  public getContacts(searchParameters: IContact): Promise<IContactSearchResult> {

    return new Promise((resolve, reject) => {

      try {

        const uri = `${this.getBaseURI()}/contacts`;

        const options: request.CoreOptions = {
          headers: this.getHeaders(),
          json: true,
          method: 'GET',
          qs: searchParameters,
          timeout: this.timeout,
        };

        request(uri, options, (err, response, body) => {
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

      } catch (err) {
        reject(err);
      }

    });
  }

  /** adds new contacts--remember to subscribe them to a list */
  public addContacts(contacts: IContact[]): Promise<any> {

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

        const options: request.CoreOptions = {
          body: contacts,
          headers: this.getHeaders(),
          json: true,
          method: 'POST',
          timeout: this.timeout,
        };

        request(uri, options, (err, response, body) => {
          if (err) {
            reject(err);
            return;
          }
          if (response.statusCode !== HTTPStatus.OK) { // note: not 201 CREATED
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

      } catch (err) {
        reject(err);
      }

    });

  }

  /** updates a contact, replacing only the fields supplied */
  public updateContact(id: number, contact: IContact): Promise<any> {

    return new Promise((resolve, reject) => {

      try {

        const uri = `${this.getBaseURI()}/contacts/${id}`;

        const options: request.CoreOptions = {
          body: contact,
          headers: this.getHeaders(),
          json: true,
          method: 'POST', // note: POST updates the contact, PUT replaces the contact
          timeout: this.timeout,
        };

        request(uri, options, (err, response, body) => {
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

      } catch (err) {
        reject(err);
      }

    });
  }

  /** completely replaces a contact, must include email */
  public replaceContact(id: number, contact: IContact): Promise<any> {

    return new Promise((resolve, reject) => {

      if (typeof contact.email === 'undefined') {
        reject(new Error('`listId` is a required field for all creation requests'));
        return;
      }

      try {

        const uri = `${this.getBaseURI()}/contacts/${id}`;

        const options: request.CoreOptions = {
          body: contact,
          headers: this.getHeaders(),
          json: true,
          method: 'PUT', // note: POST updates the contact, PUT replaces the contact
          timeout: this.timeout,
        };

        request(uri, options, (err, response, body) => {
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

      } catch (err) {
        reject(err);
      }

    });
  }

  /** completely replaces a contact, must include email */
  public deleteContact(id: number): Promise<any> {

    return new Promise((resolve, reject) => {

      try {

        const uri = `${this.getBaseURI()}/contacts/${id}`;

        const options: request.CoreOptions = {
          headers: this.getHeaders(),
          json: true,
          method: 'DELETE',
          timeout: this.timeout,
        };

        request(uri, options, (err, response, body) => {
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

      } catch (err) {
        reject(err);
      }

    });
  }

  public getLists(searchParameters: IList): Promise<IListSearchResult> {

    return new Promise((resolve, reject) => {

      try {

        const uri = `${this.getBaseURI()}/lists`;

        const options: request.CoreOptions = {
          headers: this.getHeaders(),
          json: true,
          method: 'GET',
          qs: searchParameters,
          timeout: this.timeout,
        };

        request(uri, options, (err, response, body) => {
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
                } else {
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

      } catch (err) {
        reject(err);
      }

    });
  }

  public createLists(lists: IList[]): Promise<any> {

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

        const options: request.CoreOptions = {
          body: lists,
          headers: this.getHeaders(),
          json: true,
          method: 'POST',
          timeout: this.timeout,
        };

        request(uri, options, (err, response, body) => {
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
                } else {
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

      } catch (err) {
        reject(err);
      }

    });
  }

  public subscribeContactToList(contactId: number, listId: number, status?: IListStatus): Promise<any> {

    if (typeof status === 'undefined') {
      status = 'normal';
    }

    return new Promise((resolve, reject) => {

      try {
        const uri = `${this.getBaseURI()}/subscriptions`;

        const options: request.CoreOptions = {
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

        request(uri, options, (err, response, body) => {
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
              if (typeof s.confirmationMessageId === 'string') {
                s.confirmationMessageId = parseInt(s.confirmationMessageId, 10);
              }
            }
          }
          resolve(body);
        });

      } catch (err) {
        reject(err);
      }

    });
  }

  private getBaseURI(): string {
    if (this.accountId === null) {
      throw new Error('accountId not supplied. use iContact.setAccountId() first.');
    }
    if (this.clientFolderId === null) {
      throw new Error('accountId not supplied. use iContact.setAccountId() first.');
    }
    return `${this.host}/icp/a/${this.accountId}/c/${this.clientFolderId}`;
  }

  private getHeaders() {
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

export type IContactStatus = 'normal' | 'bounced' | 'donotcontact' | 'pending' | 'invitable' | 'deleted';

/** a contact to send to iContact */
export interface IContact {
  /** primary key -- don't supply in creation requests */
  contactId?: number;
  /** email address -- required field for creation and replacement requests */
  email?: string;
  prefix?: string;
  firstName?: string;
  lastName?: string;
  suffix?: string;
  street?: string;
  street2?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  phone?: string;
  fax?: string;
  /** business name */
  business?: string;
  status?: IContactStatus;
  /** number of bounces -- readonly */
  bounceCount?: number;
  /** creation date -- readonly */
  createDate?: string;
  /** custom fields -- can't be used for searching */
  [key: string]: any;
}

/** a contact as returned by iContact */
export interface IContactResult {
  contactId: number;
  email: string;
  prefix: string;
  firstName: string;
  lastName: string;
  suffix: string;
  street: string;
  street2: string;
  city: string;
  state: string;
  postalCode: string;
  phone: string;
  fax: string;
  business: string;
  status: IContactStatus;
  bounceCount: number;
  createDate: string;
}

export interface IContactSearchResult {
  contacts: IContactResult[];
  total: number;
}

export type IListStatus = 'normal' | 'pending' | 'unsubscribed';

/** a list to send to iContact */
export interface IList {
  /** primary key -- don't supply in creation requests */
  listId?: number;
  /** internal list name -- required field for creation and replacement requests */
  name?: string;
  publicName?: string;
  description?: string;
  welcomeMessageId?: number | null;
  emailOwnerOnChange?: boolean;
  welcomeOnManualAdd?: boolean;
  welcomeOnSignupAdd?: boolean;
}

/** a list as returned by iContact  */
export interface IListResult {
  listId: number;
  name: string;
  publicName: string;
  description: string;
  welcomeMessageId: number | null;
  emailOwnerOnChange: boolean;
  welcomeOnManualAdd: boolean;
  welcomeOnSignupAdd: boolean;
}

export interface IListSearchResult {
  lists: IListResult[];
}
