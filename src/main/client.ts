import { GuildChannel } from "discord.js";
import { initializeClientEvents } from "./modules/events";
import { displayPresence, propIcons } from "./modules/displays";
import { newUser } from "./modules/clientApps";
import { loadChat } from "./modules/contentLoader";
import { initClickables } from "./modules/clickables";

times.stamp("client");

//#region Init App

function initializeApp() {
    window.openPersistent = window.open;
    Object.defineProperty(window, "__childWindows", {
        value: [],
        writable: false,
        configurable: false
    })

    Object.defineProperty(window, "open", {
        value: (url?: string | URL, target?: string, features?: string): WindowProxy | null => {
            let win = window.openPersistent(url, target, features);
            if(win) __childWindows.push(win);

            return win;
        }
    })

    window.addEventListener("beforeunload", () => {
        for (const win of window.__childWindows) {
            if(!win.closed) win.close();
        }
    })

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

    propIcons();
    initClickables();
}

//#endregion
//#region Functions

function sortChannels<T extends GuildChannel>(channelsList: ListByIDOf<T>): T[] {
    let sorted = [];

    for (let id in channelsList) {
        let channel = channelsList[id];
        let pos = channel.position;

        if(sorted[pos]) sorted.splice(pos, 0, channel);
            else sorted[pos] = channel;
    }

    return sorted;
}

function setStatus(status: Presence): void {
    Botcord.client?.user.presence.set({status: status});
    Botcord.storage?.updateUser(Botcord.storage.userIndex, {presence: status});
    displayPresence();
}

//#endregion

Botcord.isInitialized = (async () => {

    if(Botcord.flags.disableLoaderCurtain) {
        let l = elem("#loader");
        l.style.transform = "scaleY(0)";
        l.style.opacity = "0";
    }

    //#region Init Storage

    await Botcord.initStorage(false);
    if(Botcord.storage!.status) {
        let errCodes = Botcord.storage!.errorCodes;
        switch(Botcord.storage!.error) {
            case errCodes.noUser:
                newUser();
                break;
        }

        return;
    }

    //#endregion
    //#region Init Client

    Botcord.assignClient(new Client({
        intents: [
            "Guilds",
            "GuildMessages",
            "GuildMembers",
            "MessageContent",
            "DirectMessages"
        ],
        partials: [ Partials.Channel ]
    }));

    initializeClientEvents();

    Botcord.client!.login(Botcord.current!.token).catch(async e => {
        if(e.message == "Used disallowed intents") {
            dialog.confirm(templates.confirms.DISALLOWED_INTENTS());
        } else if(e.code == DiscordjsErrorCodes.TokenInvalid) {
            logger.error(`Failed to Connect: Invalid token`);
            let choice;

            try {
                choice = await dialog.confirm(templates.confirms.INVALID_TOKEN());
            } catch(e) {
                if(e == dialog.errors.DISMISSED) {
                    logger.log(`Primary dialog dismissed.`);
                    return;
                } else throw e;
            }

            if(choice) {
                try {
                    await wait(theme._dat.tr2 + 500);
                    let token = await dialog.newToken(Botcord.current!.tag || "User", Botcord.storage!);
                    await Botcord.storage!.updateUser(Botcord.storage!.userIndex, {token});
                    location.reload();
                } catch(e) {
                    if(e == dialog.errors.DISMISSED) {
                        logger.log(`Secondary dialog dismissed.`);
                        return;
                    } else throw e;
                }
            } else {
                await Botcord.storage!.removeUser(Botcord.storage!.userIndex);
                location.reload();
            }
        } else throw e;
    });

    initializeApp();

    //#endregion

})();