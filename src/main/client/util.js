//#region Icons, Evt's & NewU

function propIcons() {
    let els = elem(".i:not(.i-done)", true);
    if(logs.elements) logger.log(`Propagated 3rd party icons:`, els);

    for(let i = 0; i < els.length; i++) {
        let el = els[i];
        if(el.hasAttribute("data-icon")) {
            let icon = el.getAttribute("data-icon");
            el.style.backgroundImage = `url(https://img.icons8.com/material-rounded/${color(el.classList.contains("static")?theme.color:theme.colorDark)}/${icon})`;
            // if(el.hasAttribute("data-size")) {
            //     el.style.backgroundSize
            // }
            el.classList.add("i-done");
        } else logger.warn(`Element #${i} lacks "data-icon"! (skipped) -`, el);
    }
}

function initClickables() {
    for(let selector in clickables) {
        let el = elem("#" + selector);
        el.addEventListener(
            "click",
            clickables[selector]
        );
    }
}

async function newUser(free = false) {
    let store = free? storage: await storageInit(true);

    let user;
    try {
        user = await getBotInfo(
            await dialog.addUserModal(free, store)
        );
    } catch(e) {
        switch(e) {
            case dialog.errors.DISMISSED:
                logger.log("Log In modal dismissed: " + e);
                return;
            default:
                throw e;
        }
    }
    logger.log(`User data acquired: `, user);

    await store.addUser(user);
    store.setCurrentUser(store.getUsers().length - 1);

    location.reload();
}

//#endregion
//#region Formatting & Utils

function formatDate(date) {
    /* return d.toLocaleString(undefined, {
        day:"numeric",
        month:"numeric",
        year:"numeric",
        hour: "numeric",
        minute:"numeric"
    }) */

    return dayjs().calendar(date);
}

function color(hex) {
    return hex.match(/#([0-9a-fA-F]+)/)[1];
}

function getBotInfo(obj) {
    return new Promise(r => {
        try {
            let c = new Client({
                intents: []
            });

            c.on("ready", () => {
                let u = c.user;

                let info = {
                    username: u.username,
                    discriminator: u.discriminator,
                    id: u.id,
                    tag: u.tag,
                    avatar: u.avatarURL({size: 64}) || u.defaultAvatarURL,
                    token: obj.token,
                    presence: obj.presence || current().presence
                }

                c.destroy();
                r(info);
            });

            c.login(obj.token);
        } catch {
            r(obj);
        }
    });
}
//#endregion