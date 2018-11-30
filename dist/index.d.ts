export default class IContactAPI {
    host: string;
    private appId;
    private apiUsername;
    private apiPassword;
    private timeout;
    private maxSockets;
    private agent;
    private baseRequest;
    private accountId;
    private clientFolderId;
    constructor(appId: string, apiUsername: string, apiPassword: string, sandbox?: boolean);
    setTimeout(timeout: number): void;
    getTimeout(): number;
    setAccountId(accountId: number): void;
    getAccountId(): number | null;
    setClientFolderId(clientFolderId: number): void;
    getClientFolderId(): number | null;
    getContacts(searchParameters: IContact): Promise<IContactSearchResult>;
    /** adds new contacts--remember to subscribe them to a list */
    addContacts(contacts: IContact[]): Promise<any>;
    /** updates a contact, replacing only the fields supplied */
    updateContact(id: number, contact: IContact): Promise<any>;
    /** completely replaces a contact, must include email */
    replaceContact(id: number, contact: IContact): Promise<any>;
    /** completely replaces a contact, must include email */
    deleteContact(id: number): Promise<any>;
    getLists(searchParameters: IList): Promise<IListSearchResult>;
    createLists(lists: IList[]): Promise<any>;
    subscribeContactToList(contactId: number, listId: number, status?: IListStatus): Promise<any>;
    private getBaseURI;
    private getHeaders;
}
export declare type IContactStatus = 'normal' | 'bounced' | 'donotcontact' | 'pending' | 'invitable' | 'deleted';
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
    subscriptions?: ISubscription[];
}
export interface ISubscription {
    email: string;
    listId: number;
    status: IListStatus;
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
    subscribeContactToList: any;
}
export interface IContactSearchResult {
    contacts: IContactResult[];
    total: number;
}
export declare type IListStatus = 'normal' | 'pending' | 'unsubscribed';
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
