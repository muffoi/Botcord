module.exports = async () => {
    logger.log("Connected.");
    times.stamp("login");

    client.presence.set({ status: current().presence });

    let user = client.user;
    elem("#pfp").src = user.avatarURL({size: 64}) || client.user.defaultAvatarURL;
    elem("#username").textContent = user.displayName;
    displayPresence();

    await storage.updateUser(
        storage.userIndex,
        await getBotInfo({token: current().token})
    );

    propIcons();
    initClickables();
    if(!flags.noServerList) await loadGuilds();

    let loader = elem('#loader');
    loader.style.transform = "scaleY(0)";
    loader.style.opacity = 0;

    times.stamp("finish");
    if(logs.timings) logger.log(`Startup time: ${times.finish}ms; Client time: ${times.client}ms`);

    // client.users.fetch()
}