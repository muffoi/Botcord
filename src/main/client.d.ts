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
//#region Client Variables

declare let guilds: import("discord.js").Guild[];
declare let channels: import("discord.js").Channel[];
declare let currentGuild: import("discord.js").Guild;
declare let currentChannel: import("discord.js").Channel;
declare let topLoadedMessage: import("discord.js").Message;
declare let pinnedOpenChannel: import("discord.js").Channel | null;
declare let chatContent: HTMLDivElement;
declare let current: FSStorage["getCurrentUser"];
declare let client: import("discord.js").Client;

//#endregion
//#region Subs

declare function loadChannels(): void;
declare function selectChannel(): void;

declare function loadGuilds(): Promise<void>;
declare function selectGuild(): Promise<void>;

declare function loadChat(add: boolean | undefined): Promise<void>;

declare const clickables: Object;

declare function initClickables(): void;

interface Limits {
    messageFetch: number,
    bufferChatScroll: number
}
interface Logs {
    messages: boolean | undefined,
    elements: boolean | undefined,
    channels: boolean | undefined,
    values: boolean | undefined,
    timings: boolean | undefined
}
interface Flags {
    noServerList: boolean | undefined,
    disableLoaderCurtain: boolean | undefined
}
interface PackageJsonPartial {
    name: string,
    productName: string,
    version: string
}
declare const limits: Limits, logs: Logs, flags: Flags, package: PackageJsonPartial;

declare function displayPresence(): void;
declare function fillBCM(id: import("discord.js").Snowflake): Promise<import("discord.js").User>;
declare function channelIcon(channel: import("discord.js").Channel, guild: import("discord.js").Guild): string;
declare function resolveChannelIconNamespace(channel: import("discord.js").Channel): string;

declare function initClientEvents(): void;

declare function markdown(message: import("discord.js").Message): string;
declare function afterEffect(li: HTMLLIElement): void;

declare function propIcons(): void;
declare function newUser(free: boolean | undefined): Promise<void>;
declare function formatDate(date: Date): string;
declare function color(hex: string): string;
declare function getBotInfo(obj: BaseUserData): UserData | BaseUserData;
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
    accent: string,
    accentLight: string,
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