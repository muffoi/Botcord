const limits = {
    messageFetch: 20,
    bufferChatScroll: 50,
    attachmentHeight: 350,
    messageGroupingTime: 420_000
}, logs = {
    // Log message parser outputs and elements
    messages: true,

    // Log other generated elements
    // elements: true,

    // Log loaded channels
    channels: true,

    // Log other internal values
    // values: true,

    // Log setup times
    timings: true
}, flags = {
    // noServerList: true,
    // disableLoaderCurtain: true
}, packagePartial = (() => {
    let {name, productName, version} = require("../../../package.json");
    return {
        name,
        productName,
        version
    }
})(), styleDimensions = {
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
        let args = argv.slice(-2 - dataLength, -2), argDefs = [
            { key: "appData", type: "string" },
            { key: "isPackaged", type: "bool" }
        ], argObj = {};

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
            }

            argObj[def.key] = value;
        }

        return argObj;
    } catch(e) {
        logger.report(`Botcord module failed loading`, {cause: e});
    }
})();

module.exports = class BotcordClient {
    constructor() {
        this.guilds = {};
        this.channels = {};
        this.currentGuild = null;
        this.currentChannel = null;
        this.topLoadedMessage = null;
        this.pinnedOpenChannel = null;
        this.chatContent = document.getElementById("chContent");
        this.storage = null;
        this.client = null;
        /* this.modules = {
            storageInit: require("./storage"),
            dialog: require("./dialog"),
            popouts: require("./popouts"),
            templates: require("./templates")
        }; */
        this.helpers = require("./helpers");

        for (const key in this.helpers) {
            window[key] = this.helpers[key];
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
        this.args = arg;
    }

    initStorage(bypassLogin) {
        if(this.#inits.storage) return;

        this.storage = storageInit(bypassLogin);

        this.#inits.storage = true;
        return this.storage;
    }

    assignClient(client) {
        if(this.#inits.client) return;

        this.client = client;
        this.#inits.client = true;
    }

    current() {
        if(!this.storage) return;
        return this.storage.getCurrentUser();
    }

    #inits = {
        storage: false,
        client: false
    }
}