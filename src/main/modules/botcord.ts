import { Client, Guild, GuildChannel, Snowflake } from "discord.js";
import * as helpers from "./helpers";
import { FSStorage as FSStorageType } from "./storage";
import { name, productName, version } from "../../../package.json";

const limits = {
    messageFetch: 20,
    bufferChatScroll: 50,
    attachmentHeight: 350,
    messageGroupingTime: 420_000,
    // get smoothScroll(){
    //     return document.body.clientHeight * 5;
    // }
}

const logs = {
    // Log message parser outputs and elements
    messages: true,

    // Log other generated elements
    elements: false,

    // Log loaded channels
    channels: true,

    // Log other internal values
    values: false,

    // Log setup times
    timings: true
}

const flags = {
    noServerList: false,
    disableLoaderCurtain: false
}

const packagePartial = {
    name,
    productName,
    version
};

const styleDimensions = {
    messagePadding: 120,
    maxMessageWidth() {
        return Botcord.chatContent.clientWidth - this.messagePadding;
    }
}

let arg = (() => {
    try {
        let argv = process.argv;
        let dataLength = +argv[argv.length-2];
        if(isNaN(dataLength) || dataLength == 0) {
            throw new Error("Couldn't separate argv data out of 'process.argv'. Length: " + dataLength);
        }
        const args = argv.slice(-2 - dataLength, -2);
        const argDefs = [
            { key: "appData", type: "string" },
            { key: "isPackaged", type: "bool" }
        ];
        const argObj: RendererArgs = {
            appData: "",
            isPackaged: true
        };

        for (let i = 0; i < args.length; i++) {
            let def = argDefs[i];
            let value;

            switch(def.type) {
                case "string":
                    value = args[i];
                    break;
                case "number":
                    value = +args[i];
                    break;
                case "bool":
                    value = !!+args[i];
                    break;
                default:
                    value = args[i];
            }

            argObj[def.key] = value;
        }

        return argObj;
    } catch(e) {
        logger.report(`Botcord module failed loading`, {cause: e});
    }
})();

// interface RendererArgsMap {
//     appData: string,
//     isPackaged: boolean
// }

type RendererArgs = Record<string, string | number | boolean>;

export class BotcordClient {
    guilds: ListByIDOf<Guild>;
    channels: ListByIDOf<GuildChannel>;

    currentGuild: Guild | null;
    currentChannel: GuildChannel | null;
    topLoadedMessage: Snowflake | null;
    pinnedOpenChannel: HTMLLIElement | null;

    isInitialized: Promise<void>;

    storage: FSStorageType | null;
    client: Client<true> | null;
    helpers: typeof import("./helpers");

    limits: typeof limits;
    logs: typeof logs;
    flags: typeof flags;
    package: typeof packagePartial;
    styleDimensions: typeof styleDimensions;

    args: RendererArgs

    #inits = {
        storage: false,
        client: false
    }

    constructor() {
        this.guilds = {};
        this.channels = {};
        this.currentGuild = null;
        this.currentChannel = null;
        this.topLoadedMessage = null;
        this.pinnedOpenChannel = null;
        
        // Placeholder never-resolving promise
        this.isInitialized = new Promise(() => {});

        this.storage = null;
        this.client = null;
        this.helpers = helpers;

        for (const key in this.helpers) {
            Object.defineProperty(window, key, {
                value: this.helpers[key as keyof typeof helpers]
            });
        }

        this.limits = limits;
        this.logs = logs;
        this.flags = flags;
        this.package = packagePartial;
        this.styleDimensions = styleDimensions;

        /**
         * @type {{
         *  appData: string,
         *  isPackaged: boolean
         * }}
         */
        this.args = arg!;
    }

    get chatContent(): HTMLDivElement {
        return helpers.elem<HTMLDivElement>("#chContent");
    }

    async initStorage(bypassLogin: boolean): Promise<FSStorageType | void> {
        if(this.#inits.storage) return;

        this.storage = await FSStorage.build(bypassLogin);

        this.#inits.storage = true;
        return this.storage;
    }

    assignClient(client: Client<true>): void {
        if(this.#inits.client) return;

        this.client = client;
        this.#inits.client = true;
    }

    get current(): UserData | null {
        if(!this.storage) return null;
        return this.storage.getCurrentUser();
    }
}