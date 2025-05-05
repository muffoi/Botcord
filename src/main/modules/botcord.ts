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

const debugLogs = {
    // Debug message parser outputs and elements
    messages: false,

    // Debug data about channels
    channels: false,

    // Debug setup times
    timings: true,

    // Debug channel loader handle manager
    handles: true
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
    let arg = process.argv.slice(-2, -1)[0];

    const defaults: RendererArgs = {
        appData: "",
        isPackaged: true
    };

    try {
        let json = JSON.parse(arg);
        if(typeof json !== "object") throw new TypeError(`Type mismatch! Expected to read object, found '${typeof json}'!`);

        Object.assign(defaults, json);
    } catch(e) {
        logger.report(`Botcord module failed loading`, {cause: e});
    }

    return defaults;
})();

interface RendererArgs {
    appData: string,
    isPackaged: boolean
}

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
    debug: typeof debugLogs;
    flags: typeof flags;
    package: typeof packagePartial;
    styleDimensions: typeof styleDimensions;

    args: RendererArgs;

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
        this.debug = debugLogs;
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