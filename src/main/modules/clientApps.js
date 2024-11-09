async function newUser(free = false) {
    let store = free? Botcord.storage: await storageInit(true);

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
                    presence: obj.presence || Botcord.current().presence
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

module.exports = {
    newUser,
    getBotInfo
}