//#region Load Guilds

async function loadGuilds() {
    let firstGuild, allGuilds = await client.guilds.fetch();
    allGuilds/* .filter(g => g.available === true) */.forEach(guild => {
        if(!firstGuild) firstGuild = guild.id;
        guilds[guild.id] = guild;
    });

    for (const guildID in guilds) {
        guilds[guildID] = await guilds[guildID].fetch();
    }

    if(!firstGuild) {
        dialog.confirm(...templates.confirms.NO_GUILD);
        return;
    }

    firstGuild = guilds[firstGuild];

    currentGuild = guilds[firstGuild.id];

    let firstChannel, allChannels = await currentGuild.channels.fetch();
    allChannels.forEach(channel => {
        if(!firstChannel) firstChannel = channel;
        channels[channel.id] = channel;
    });
    currentChannel = channels[
        currentGuild.systemChannelId?
        currentGuild.systemChannelId:
        firstChannel.id
    ];

    elem('#gName').innerText = currentGuild.name;

    for(let i in guilds) {
        let guild = guilds[i];
        let icon = guild.iconURL({size: 128});

        let li = mkelem('li', "gItem"),
            img = mkelem('img', 'gIcon', 0, icon?icon:0),
            div = mkelem('div', 'gIconCont'),
            div2 = mkelem('div', 'gIconC');

        if(typeof icon !== "string") {
            img = mkelem('div', 'gText');
            img.innerText = guild.nameAcronym;
        }

        img.title = esc(`${guild.name} (${guild.id})`);
        div2.setAttribute("gid", guild.id);
        evt(div2, "click", selectGuild);

        div2.appendChild(img);
        div.appendChild(div2)
        li.appendChild(div);
        document.querySelector('#guilds').appendChild(li);
    }

    active(elem('#guilds').children[0], "guild");

    loadChannels();
}

//#endregion
//#region Select Guild

async function selectGuild() {
    active(this.parentElement.parentElement, "guild");

    currentGuild = guilds[this.getAttribute("gid")];
    channels = {};

    let firstChannel, allChannels = await currentGuild.channels.fetch();
    allChannels.forEach(channel => {
        if(!firstChannel) firstChannel = channel;
        channels[channel.id] = channel;
    });

    currentChannel = channels[
        currentGuild.systemChannelId?
        currentGuild.systemChannelId:
        firstChannel.id
    ];

    elem('#gName').innerText = currentGuild.name;

    loadChannels();
}

//#endregion
