declare global {
    export var theme: typeof import("./theme").theme;

    export var Client: typeof import("discord.js").Client;
    export var Partials: typeof import("discord.js").Partials;
    export var DiscordjsErrorCodes: typeof import("discord.js").DiscordjsErrorCodes;

    export var dayjs: DayJSType;

    export var Botcord: InstanceType<typeof import("./main/modules/botcord").BotcordClient>;
    export var FSStorage: typeof import("./main/modules/storage").FSStorage;
    export var dialog: typeof import("./main/modules/dialog").api;
    export var popouts: InstanceType<typeof import("./main/modules/popouts").Popouts>;
    export var templates: typeof import("./main/modules/templates");
    export var logger: typeof import("./main/modules/debug").logger;
    export var times: typeof import("./main/modules/debug").times;

    export function sortChannels<T extends import("discord.js").GuildChannel>(channelsList: ListByIDOf<T>): T[];
    export function setStatus(status: Presence): void;

    export var openPersistent: Window["open"];
    export var __childWindows: WindowProxy[];

    //#region Helpers
    
    export var mkelem: typeof import("./main/modules/helpers").mkelem;
    export var elem: typeof import("./main/modules/helpers").elem;
    export var esc: typeof import("./main/modules/helpers").esc;
    export var evt: typeof import("./main/modules/helpers").evt;
    export var active: typeof import("./main/modules/helpers").active;
    export var actives: typeof import("./main/modules/helpers").actives;
    export var anonymize: typeof import("./main/modules/helpers").anonymize;
    export var prepEvt: typeof import("./main/modules/helpers").prepEvt;
    export var pushFrame: typeof import("./main/modules/helpers").pushFrame;
    export var clampNumber: typeof import("./main/modules/helpers").clampNumber;
    export var mergeObjects: typeof import("./main/modules/helpers").mergeObjects;
    export var wait: typeof import("./main/modules/helpers").wait;
    export var logError: typeof import("./main/modules/helpers").logError;
    export var toNull: typeof import("./main/modules/helpers").toNull;
    export var fetchUnfinished: typeof import("./main/modules/helpers").fetchUnfinished;

    //#endregion
    //#region Helper interfaces

    interface ListByIDOf<T> {
        [key: import("discord.js").Snowflake]: T
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
        presence?: Presence
    }

    interface AnyUserData {
        token: string,
        username?: string,
        discriminator?: string,
        id?: import("discord.js").Snowflake,
        tag?: string,
        avatar?: string,
        presence?: Presence
    };

    type Presence = "online" | "invisible" | "idle" | "dnd";

    interface ErrorLike {
        name: string,
        message: string,
        code?: string
    }

    interface MimeTypeDetails {
        mime: string,
        category: string,
        type: string
    }

    type PromiseOrNot<T> = Promise<T> | T;

    type ChatChannel = Exclude<import("discord.js").Channel, import("discord.js").CategoryChannel>;
    // type GuildChatChannel = Omit<import("discord.js").GuildChannel, keyof Omit<import("discord.js").CategoryChannel, keyof import("discord.js").GuildChannel>>

    //#endregion
    //#region Custom types

    type DayJSType = Omit<typeof import("dayjs"), "call"> & InstanceType<typeof import("dayjs").Dayjs> & {
        calendar(): string,
        (date: Date): DayJSType
    }

    interface HTMLElement {
        popoutLinkRef: number | undefined
    }

    //#endregion
}

export {};

// TODO: Do someting with this
//
// interface Logger {
//     log(...args: any[]): void,
//     warn(...args: any[]): void,
//     error(...args: any[]): void,
//     debug(...args: any[]): void,
//     report(message: string, options: LoggerReportOptions): never
// }
// interface LoggerReportOptions {
//     constr?: { new(): object },
//     cause?: any
// }
// declare const logger: Logger;