/**
 * @typedef {import("../modules/templates")} Templates
 * @typedef {import("../modules/storage")} Storage
 * @typedef {import("../modules/popouts")} Popouts
 * @typedef {import("../modules/dialog")} Dialog
 */

const { Client, Partials, DiscordjsErrorCodes } = require("discord.js");
const discordMarkdown = require("@odiffey/discord-markdown");
const dayjs = require("dayjs");
const Vibrant = require("node-vibrant");

/** @type {Storage} */
const storageInit = require("./modules/storage");

/** @type {Dialog} */
const dialog = require("./modules/dialog");

/** @type {Popouts} */
const popouts = require("./modules/popouts");

/** @type {Templates} */
const templates = require("./modules/templates");


dayjs.extend(require("dayjs/plugin/calendar"));
times.stamp("client");

let guilds = {}, channels = {};
let currentGuild, currentChannel, topLoadedMessage;
let pinnedOpenChannel, chatContent = elem("#chContent");
let storage, current, client;

//#region Sort Channels

function sortChannels(channelsArray) {
    let sorted = []

    for (let i in channelsArray) {
        let channel = channelsArray[i];
        let pos = channel.position;

        if(sorted[pos]) sorted.splice(pos, 0, channel);
            else sorted[pos] = channel;
    }

    return sorted;
}

//#endregion
//#region API Shortcuts

function setStatus(status) {
    client.presence.set({status: status});
    storage.updateUser(storage.userIndex, {presence: status});
    displayPresence();
}

//#endregion

(async () => {

    //#region The Code
    
    await require("./main/client/subs")();

    if(flags.disableLoaderCurtain) {
        let l = elem("#loader");
        l.style.transform = "scaleY(0)";
        l.style.opacity = 0;
    }

    popouts.link(elem("#profilePopout"), elem("#btnSwitch"));

    let loadInProgress = false;

    chatContent.addEventListener("scroll", async () => {
        if( clampNumber(
            chatContent.scrollHeight
            + chatContent.scrollTop
            - chatContent.clientHeight,
            0
        ) <= limits.bufferChatScroll && !loadInProgress) {
            loadInProgress = true;
            await loadChat(true);
            loadInProgress = false;
        }
    })

    //#endregion
    //#region Init Storage

    storage = await storageInit();
    if(storage.status) {
        let ecodes = storage.errorCodes;
        switch(storage.error) {
            case ecodes.noUser:
                newUser();
                break;
        }

        return;
    }

    current = () => storage.getCurrentUser();

    //#endregion
    //#region Init Client

    client = new Client({
        intents: [
            "Guilds",
            "GuildMessages",
            "GuildMembers",
            "MessageContent",
            "DirectMessages"
        ],
        partials: [ Partials.Channel ]
    });

    initClientEvents();

    //#endregion
    //#region Client Login

    try {
        let loginPromise = client.login(current().token);
        loginPromise.catch(e => {
            if(e.message == "Used disallowed intents") {
                dialog.confirm(...templates.confirms.DISALLOWED_INTENTS());
            }
        });

        await loginPromise;
    } catch(e) {
        if(e.code == DiscordjsErrorCodes.TokenInvalid) {
            logger.error(`Failed to Connect: Invalid token`);
            let choice;

            try {
                choice = await dialog.confirm(...templates.confirms.INVALID_TOKEN(current));
            } catch(e) {
                if(e == dialog.errors.DISMISSED) {
                    logger.log(`Primary dialog dismissed.`);
                    return;
                } else throw e;
            }

            if(choice) {
                try {
                    await wait(theme._dat.tr2 + 500);
                    let token = await dialog.newToken(current().tag || "User");
                    await storage.updateUser(storage.userIndex, {token});
                    location.reload();
                } catch(e) {
                    if(e == dialog.errors.DISMISSED) {
                        logger.log(`Secondary dialog dismissed.`);
                        return;
                    } else throw e;
                }
            } else {
                await storage.removeUser(storage.userIndex);
                location.reload();
            }
        } else throw e;
    }

    //#endregion

})();