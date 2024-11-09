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