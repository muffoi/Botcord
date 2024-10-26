//#region Displays

function displayPresence() {
    let translations = {
        online: "Online",
        idle: "Idle",
        dnd: "Do Not Disturb",
        invisible: "Invisible"
    }

    let readable = translations[client.presence.status];
    let statusIcon = `../resources/status${readable.replace(/\s/g, "")}.svg`;

    elem("#status").textContent = readable;
    elem("#bcmStatus").src = statusIcon;
    elem("#userStatus").src = statusIcon;
}

async function fillBCM(id) {
    let user = await (id? client.users.fetch(id, {force: true}): client.user.fetch(true));
    let avatar = user.avatarURL({ extension: "png" }) || user.defaultAvatarURL;

    if(user.banner) elem("#bcmBanner").style.backgroundImage = `url(${user.bannerURL({size: 512})})`;
        else elem("#bcmBanner").style.backgroundImage = "none";
    elem("#bcmBanner").style.backgroundColor = user.hexAccentColor || (
        await Vibrant.from(avatar).getPalette()
    ).Vibrant.hex;

    elem("#bcmPfp").src = avatar;
    elem("#bcmDisplayName").textContent = user.displayName;
    elem("#bcmTag").textContent = user.discriminator;

    elem("#bcmSince").textContent = dayjs(user.createdAt).format("MMM D, YYYY");
    // elem("#bcmUsername").textContent = user.username;

    return user;
}

function channelIcon(channel, guild) {
    return `https://img.icons8.com/material-rounded/24/${color(theme.colorDark)}/` + (channel.permissionsFor(client.user).has("ViewChannel")?
        (guild.rulesChannel === channel?
            "bookmark": // repository
            resolveChannelIconNamespace(channel)
        ):
        "hide"
    )
}

function resolveChannelIconNamespace(channel) {
    return [
        "hashtag",,
        "speaker",,,
        "commercial",,,,,,,, // megaphone
        "online",,
        "communication" // chat
    ][channel.type];
}

//#endregion
