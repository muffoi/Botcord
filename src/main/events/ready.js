const { getBotInfo } = require("../modules/clientApps");
const { loadGuilds } = require("../modules/contentLoader");
const { displayPresence, propIcons, initClickables } = require("../modules/displays");

module.exports = async () => {
    logger.log("Connected.");
    times.stamp("login");

    Botcord.client.presence.set({ status: Botcord.current().presence });

    let user = Botcord.client.user;
    elem("#pfp").src = user.avatarURL({size: 64}) || Botcord.client.user.defaultAvatarURL;
    elem("#username").textContent = user.displayName;
    displayPresence();

    await Botcord.storage.updateUser(
        Botcord.storage.userIndex,
        await getBotInfo({token: Botcord.current().token})
    );

    propIcons();
    initClickables();
    if(!Botcord.flags.noServerList) await loadGuilds();

    let loader = elem("#loader");
    loader.style.transform = "scaleY(0)";
    loader.style.opacity = 0;

    times.stamp("finish");
    if(Botcord.logs.timings) logger.log(`Startup time: ${times.finish}ms; Client time: ${times.client}ms`);

    // Botcord.client.users.fetch()
}