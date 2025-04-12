export async function newUser(free: boolean = false): Promise<void> {
    let store = free? Botcord.storage!: await FSStorage.build(true);

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

export function getBotInfo(data: BaseUserData): Promise<UserData | BaseUserData> {
    return new Promise(resolve => {
        try {
            let c = new Client({
                intents: []
            });

            c.on("ready", () => {
                let user = c.user!;

                let info = {
                    username: user.username,
                    discriminator: user.discriminator,
                    id: user.id,
                    tag: user.tag,
                    avatar: user.avatarURL({size: 64}) || user.defaultAvatarURL,
                    token: data.token,
                    presence: data.presence
                }

                c.destroy();
                resolve(info);
            });

            c.login(data.token);
        } catch {
            resolve(data);
        }
    });
}