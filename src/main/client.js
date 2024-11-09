// /**
//  * @typedef {import("../modules/templates")} Templates
//  * @typedef {import("../modules/storage")} Storage
//  * @typedef {import("../modules/popouts")} Popouts
//  * @typedef {import("../modules/dialog")} Dialog
//  */

const { Client, Partials, DiscordjsErrorCodes } = require("discord.js");
const dayjs = require("dayjs");
const Botcord = new (require("./modules/botcord"));

// /** @type {Storage} */
const storageInit = require("./modules/storage");

// /** @type {Dialog} */
const dialog = require("./modules/dialog");

// /** @type {Popouts} */
const popouts = require("./modules/popouts");

// /** @type {Templates} */
const templates = require("./data/templates");

const { displayPresence } = require("./modules/displays");
const { newUser } = require("./modules/clientApps");
const { loadChat } = require("./modules/contentLoader");

dayjs.extend(require("dayjs/plugin/calendar"));
times.stamp("client");

let current;

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
    Botcord.client.presence.set({status: status});
    Botcord.storage.updateUser(Botcord.storage.userIndex, {presence: status});
    displayPresence();
}

//#endregion

(async () => {

    //#region The Code

    if(Botcord.flags.disableLoaderCurtain) {
        let l = elem("#loader");
        l.style.transform = "scaleY(0)";
        l.style.opacity = 0;
    }

    popouts.link(elem("#profilePopout"), elem("#btnSwitch"));

    let loadInProgress = false;

    Botcord.chatContent.addEventListener("scroll", async () => {
        if( clampNumber(
            Botcord.chatContent.scrollHeight
            + Botcord.chatContent.scrollTop
            - Botcord.chatContent.clientHeight,
            0
        ) <= Botcord.limits.bufferChatScroll && !loadInProgress) {
            loadInProgress = true;
            await loadChat(true);
            loadInProgress = false;
        }
    })

    //#endregion
    //#region Init Storage

    Botcord.storage = await storageInit();
    if(Botcord.storage.status) {
        let ecodes = Botcord.storage.errorCodes;
        switch(Botcord.storage.error) {
            case ecodes.noUser:
                newUser();
                break;
        }

        return;
    }

    //#endregion
    //#region Init Client

    Botcord.client = new Client({
        intents: [
            "Guilds",
            "GuildMessages",
            "GuildMembers",
            "MessageContent",
            "DirectMessages"
        ],
        partials: [ Partials.Channel ]
    });

    require("./modules/events")();

    //#endregion
    //#region Client Login

    try {
        let loginPromise = Botcord.client.login(Botcord.current().token);
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
                choice = await dialog.confirm(...templates.confirms.INVALID_TOKEN(Botcord.current));
            } catch(e) {
                if(e == dialog.errors.DISMISSED) {
                    logger.log(`Primary dialog dismissed.`);
                    return;
                } else throw e;
            }

            if(choice) {
                try {
                    await wait(theme._dat.tr2 + 500);
                    let token = await dialog.newToken(Botcord.current().tag || "User");
                    await Botcord.storage.updateUser(Botcord.storage.userIndex, {token});
                    location.reload();
                } catch(e) {
                    if(e == dialog.errors.DISMISSED) {
                        logger.log(`Secondary dialog dismissed.`);
                        return;
                    } else throw e;
                }
            } else {
                await Botcord.storage.removeUser(Botcord.storage.userIndex);
                location.reload();
            }
        } else throw e;
    }

    //#endregion

})();