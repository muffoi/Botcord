function channelIcon(channel, guild) {
    return `https://img.icons8.com/material-rounded/24/${color(theme.colorDark)}/` + (channel.permissionsFor(Botcord.client.user).has("ViewChannel")?
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

function formatDate(date) {
    /* return d.toLocaleString(undefined, {
        day:"numeric",
        month:"numeric",
        year:"numeric",
        hour: "numeric",
        minute:"numeric"
    }) */

    return dayjs(date).calendar();
}

function color(hex) {
    return hex.match(/#([0-9a-fA-F]+)/)[1];
}

function resizeDimensions(x, y, x2) {
    return y / x * x2;
}

function getContentType(mimeType) {
    let match = mimeType.match(/([^/]+)\/([^/]+)/);
    return {
        mime: mimeType,
        category: match[1],
        tpye: match[2]
    }
}

module.exports = {
    channelIcon, // usage
    resolveChannelIconNamespace,
    formatDate, // usage
    color,
    resizeDimensions, // usage
    getContentType // usage
}