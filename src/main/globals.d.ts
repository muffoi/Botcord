//#region Modules

interface Dialog {
    dom: HTMLDialogElement,
    errors: {
        DISMISSED: string
    },
    open(): void,
    close(): void,
    toggle(): void,
    addUserModal(dismissible: boolean, storage: FSStorage | undefined): Promise<BaseUserData>,
    confirm(title: string, description: string, options: ConfirmOptions | undefined): boolean,
    newToken(username: string | undefined): Promise<string>
}

interface FSStorage {
    storage: StorageData | Object,
    get userIndex(): number,
    status: 0 | 1,
    error: 0 | 1,
    errorCodes: {
        success: 0,
        noUser: 1
    },
    encode(o: Object): Promise<Buffer>,
    decode(buf: Buffer): Promise<Object>,
    load(): Promise<StorageData>,
    save(): Promise<void>,
    plainContent(): {
        bots: []
    },
    setCurrentUser(i: number | UserData | undefined): void,
    getCurrentUser(i: number | undefined): UserData,
    getUsers(): StorageData["bots"],
    addUser(userData: UserData): Promise<void>,
    addUsers(...users: UserData[]): Promise<void>,
    updateUser(index: number, data: UserData, merge: boolean | undefined): Promise<void>,
    removeUser(index: number): Promise<void>,
    hasToken(token: string): boolean
}

interface Popouts {
    active: HTMLElement | null,
    links: {
        occupied: number,
        db: HTMLElement[][],
        ref: "popoutLinkRef"
    },
    enable(el: HTMLElement): true,
    disable(el: HTMLElement): false,
    toggle(el: HTMLElement): boolean,
    isActive(el: HTMLElement): boolean,
    link(mainEl: HTMLElement, secondaryEl: HTMLElement): number
}

interface Templates {
    confirms: {
        DISALLOWED_INTENTS(): ConfirmTemplate,
        INVALID_TOKEN(): ConfirmTemplate,
        REMOVE_ACCOUNT(user: string, index: number): ConfirmTemplate,
        NO_GUILDS: ConfirmTemplate,
        INVALID_CHANNEL_TYPE(target: import("discord.js").Channel): ConfirmTemplate
    }
}

interface ConfirmTemplate extends Array<string | ConfirmOptions> {
    0: string,
    1: string,
    2: ConfirmOptions
}

interface StorageData {
    bots: UserData[]
}

interface UserData extends BaseUserData {
    username: string,
    discriminator: string,
    id: import("discord.js").Snowflake,
    tag: string,
    avatar: string
}

interface BaseUserData {
    token: string,
    presence: Presence
}

interface ConfirmOptionsA {
    main: string | undefined,
    other: string | undefined,
    dismissible: boolean,
    warn: false | undefined
}

interface ConfirmOptionsB {
    main: string,
    other: string,
    dismissible: boolean,
    warn: true
}

type ConfirmOptions = ConfirmOptionsA | ConfirmOptionsB;

type Presence = "online" | "invisible" | "idle" | "dnd";

declare const dialog: Dialog;
declare function storageInit(): Promise<FSStorage>;
declare const storage: FSStorage;
declare const popouts: Popouts;
declare const templates: Templates;

//#endregion
//#region NPM Modules

declare const Client: import("discord.js").Client;
declare const Partials: import("discord.js").Partials;
declare const DiscordjsErrorCodes: import("discord.js").DiscordjsErrorCodes;
declare const dayjs: import("dayjs");
declare const Botcord: import("./modules/botcord");

//#endregion
//#region Client Variables

// declare let guilds: import("discord.js").Guild[];
// declare let channels: import("discord.js").Channel[];
// declare let currentGuild: import("discord.js").Guild;
// declare let currentChannel: import("discord.js").Channel;
// declare let topLoadedMessage: import("discord.js").Message;
// declare let pinnedOpenChannel: import("discord.js").Channel | null;
// declare let chatContent: HTMLDivElement;
declare let current: FSStorage["getCurrentUser"];
// declare let client: import("discord.js").Client;
declare function sortChannels(channelsArray: any): import("discord.js").Channel[];
declare function setStatus(status: Presence): void;

//#endregion
//#region Subs

// declare function loadChannels(): void;
// declare function selectChannel(): void;
// 
// declare function loadGuilds(): Promise<void>;
// declare function selectGuild(): Promise<void>;
// 
// declare function loadChat(add: boolean | undefined): Promise<void>;
// 
// declare const clickables: Object;
// 
// declare function initClickables(): void;
// 
// interface Limits {
    // messageFetch: number,
    // bufferChatScroll: number,
    // attachmentHeight: number,
    // messageGroupingTime: number
// }
// interface Logs {
    // messages: boolean | undefined,
    // elements: boolean | undefined,
    // channels: boolean | undefined,
    // values: boolean | undefined,
    // timings: boolean | undefined
// }
// interface Flags {
    // noServerList: boolean | undefined,
    // disableLoaderCurtain: boolean | undefined
// }
// interface PackageJsonPartial {
    // name: string,
    // productName: string,
    // version: string
// }
// 
// interface StyleDimensions {
    // messagePadding: number,
    // maxMessageWidth(): number
// } 
// 
// declare const limits: Limits, logs: Logs, flags: Flags, package: PackageJsonPartial, styleDimensions: StyleDimensions;
// 
// declare function displayPresence(): void;
// declare function fillBCM(id: import("discord.js").Snowflake): Promise<import("discord.js").User>;
// declare function channelIcon(channel: import("discord.js").Channel, guild: import("discord.js").Guild): string;
// declare function resolveChannelIconNamespace(channel: import("discord.js").Channel): string;
// 
// declare function initClientEvents(): void;
// 
// declare function markdown(message: import("discord.js").Message): string;
// declare function afterEffect(li: HTMLLIElement): void;
// 
// declare function propIcons(): void;
// declare function newUser(free: boolean | undefined): Promise<void>;
// declare function formatDate(date: Date): string;
// declare function color(hex: string): string;
// declare function getBotInfo(obj: BaseUserData): UserData | BaseUserData;
// 
// declare function resizeDimensions(x: number, y: number, x2: number): number;
// declare function getContentType(mimeType: string): MimeTypeDetails;
// 
// interface MimeTypeDetails {
    // mime: string,
    // category: string,
    // type: string
// }

interface Logger {
    log(...args: any[]): void,
    warn(...args: any[]): void,
    error(...args: any[]): void,
    debug(...args: any[]): void,
    report(message: string, options: LoggerReportOptions): never
}
interface LoggerReportOptions {
    constr: Function | undefined,
    cause: any
}
declare const logger: Logger;

//#endregion
//#region Theme

declare function applyColorVars(): void;

interface ThemeData {
    _dat: {
        tr1: number,
        tr2: number
    },
    background: string,
    backgroundLight: string,
    foreground: string,
    foregroundLight: string,

    color: string,
    colorDark: string,

    accentLightest: string,
    accentLighter: string,
    accentLight: string,
    accentLightTransparent: string,
    accent: string,
    accentTransparent: string,
    accentDark: string,

    error: string,
    errorDark: string,

    shadow: string,
    absolute: string,
    absoluteRgb: string,

    trSmooth: string,
    trLongEase: string,
    iconFilter: string
}

declare const theme: ThemeData;

//#endregion
//#region Helpers

/**
 * Creates a new HTML element
 * @param tag HTML tag of the element
 * @param classes Class or classes to assign to the element
 * @param id ID to assign to the element
 * @param source If `<img>`, `<video>`, `<audio>`, etc., set the source URL for the resource
 * @returns Newly created element
 */
declare function mkelem(tag:string, classes:string | string[] | undefined, id:string | undefined, source:string | undefined):HTMLElement

/**
 * Search for HTML elements (alias for `querySelector` and `querySelectorAll`)
 * @param selector A CSS selector to query
 * @param all If to search for all results (default: `false`)
 * @returns The HTML element(s) found
 */
declare function elem(selector:string, all:false):HTMLElement
declare function elem(selector:string):HTMLElement
declare function elem(selector:string, all:true):NodeList

/**
 * HTML-escapes a string
 * @param txt String to escape
 * @returns Escaped string
 */
declare function esc(txt:string):string

/**
 * Add event listener to a HTML element (alias for `el.addEventListener(ev, fn)`)
 * @param el HTML element to attach event to
 * @param event Type of event to listen to
 * @param fn Function to execute
 */
declare function evt(el:HTMLElement, event:string, fn:Function):void

/**
 * Sets active (selected) element on specified list id. 
 * If there is an active for the id already, it is replace by new one.
 * 
 * An active element means it has the `.active` class.
 * @param el Element to assign active to
 * @param id ID of the list to update / add
 * @returns The element that got active enabled
 */
declare function active(el:HTMLElement, id:string):HTMLElement

// /**
//  * Counts the length of an object
//  * @param o Object to count keys for
//  * @returns Length of the object
//  */
// declare function objLength(o:object):number

// /**
//  * Checks if a number is an integer or a floating-point number
//  * 
//  * - `true` if number is an integer
//  * - `false` if number is a float
//  * @param number Number to check
//  * @returns If number is an integer or a float
//  */
// declare function isInt(number:number):boolean

/**
 * Adds the function provided to the `window` object, anonymizing the function contents and under a random name.
 * @param fn Function to anonymize
 * @returns Function's name in the `window` object
 */
declare function anonymize(fn:Function):string

/**
 * Prepares a portion of HTML code meant to insert into a HTML tag in the format:
 * 
 * `on{event}="{function code}"`
 * 
 * Under the hood, it uses `anonymize()` to access the function out of the script
 * @param fn Function to prepare
 * @param event Event to fire function on (default: `click`)
 * @returns The `on` code
 */
declare function prepEvt(fn:Function, event:string):string

/**
 * Lets a renderer frame happen. Useful to let the user see script progress in the middle of a script.
 */
declare function pushFrame():Promise<void>

/**
 * Clamps a number to a range between `min` and `max`. If any of range bounds is set to `null` or omitted, number is not clamped to that bound.
 * @param num Number to clamp
 * @param min Minimum number value (inclusive)
 * @param max Maximum number value (inclusive)
 * @returns Clamped number
 */
declare function clampNumber(num: number, min: number | undefined, max: number | undefined): number

/**
 * Merges objects into a single object, objects with higher index overwrite lower ones.
 * @param objects Objects to merge
 * @returns Merging result
 */
declare function mergeObjects(...objects: Object[]): Object

/**
 * Returns promise that resolves after an interval given by `ms`
 * @param ms Milliseconds to wait
 */
declare function wait(ms: number): Promise<void>

//#endregion