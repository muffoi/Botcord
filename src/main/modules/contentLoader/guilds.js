const { loadChannels, selectChannel, loadChat } = require("./channels");

//#region Load Guilds

async function loadGuilds() {
    let firstGuild, allGuilds = await Botcord.client.guilds.fetch();
    allGuilds/* .filter(g => g.available === true) */.forEach(guild => {
        if(!firstGuild) firstGuild = guild.id;
        Botcord.guilds[guild.id] = guild;
    });

    for (const guildID in Botcord.guilds) {
        Botcord.guilds[guildID] = await Botcord.guilds[guildID].fetch();
    }

    if(!firstGuild) {
        dialog.confirm(...templates.confirms.NO_GUILD);
        return;
    }

    firstGuild = Botcord.guilds[firstGuild];

    Botcord.currentGuild = Botcord.guilds[firstGuild.id];

    let firstChannel, allChannels = await Botcord.currentGuild.channels.fetch();
    allChannels.forEach(channel => {
        if(!firstChannel) firstChannel = channel;
        Botcord.channels[channel.id] = channel;
    });
    Botcord.currentChannel = Botcord.channels[
        Botcord.currentGuild.systemChannelId?
        Botcord.currentGuild.systemChannelId:
        firstChannel.id
    ];

    elem("#gName").innerText = Botcord.currentGuild.name;

    for(let i in Botcord.guilds) {
        let guild = Botcord.guilds[i];
        let icon = guild.iconURL({size: 128});

        let li = mkelem("li", "gItem"),
            img = mkelem("img", "gIcon", 0, icon?icon:0),
            div = mkelem("div", "gIconCont"),
            div2 = mkelem("div", "gIconC");

        if(typeof icon !== "string") {
            img = mkelem("div", "gText");
            img.innerText = guild.nameAcronym;
        }

        img.title = esc(guild.name);
        div2.setAttribute("gid", guild.id);
        evt(div2, "click", selectGuild);

        div2.appendChild(img);
        div.appendChild(div2)
        li.appendChild(div);
        document.querySelector("#guilds").appendChild(li);
    }

    active(elem("#guilds").children[0], "guild");

    loadChannels();
}

//#endregion
//#region Select Guild

async function selectGuild() {
    active(this.parentElement.parentElement, "guild");

    Botcord.currentGuild = Botcord.guilds[this.getAttribute("gid")];
    Botcord.channels = {};

    let firstChannel, allChannels = await Botcord.currentGuild.channels.fetch();
    allChannels.forEach(channel => {
        if(!firstChannel) firstChannel = channel;
        Botcord.channels[channel.id] = channel;
    });

    Botcord.currentChannel = Botcord.channels[
        Botcord.currentGuild.systemChannelId?
        Botcord.currentGuild.systemChannelId:
        firstChannel.id
    ];

    elem("#gName").innerText = Botcord.currentGuild.name;

    loadChannels();
}

//#endregion

module.exports = {
    loadGuilds,
    selectGuild,
    loadChannels,
    selectChannel,
    loadChat
}