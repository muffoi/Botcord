const { channelIcon } = require("../utils");
const { loadChat } = require("./chat");

//#region Load Channels

function loadChannels() {
    let el = elem("#channels"), categoryObjs = {}, channelObjs = {}, categoryEls = {}, channelEls = {};
    el.innerHTML = "";

    for(let i in Botcord.channels) {
        let channel = Botcord.channels[i];

        if(channel.type == 4) categoryObjs[i] = channel;
            else channelObjs[i] = channel;
    }

    categoryObjs = sortChannels(categoryObjs);
    channelObjs = sortChannels(channelObjs);
    let channelList = el.appendChild(mkelem("ul", "chList"));

    for(let c of categoryObjs) {
        let sum = mkelem("summary", "catName"), det = mkelem("details", "category"), ul = mkelem("ul", "chList");
        sum.innerText = c.name;
        det.appendChild(sum);

        categoryEls[c.id] = det.appendChild(ul);
        el.appendChild(det);

        evt(det, "toggle", function() {
            let isActive = actives.categoryOf == this;

            if(isActive && this.open) {
                if(Botcord.pinnedOpenChannel) {
                    Botcord.pinnedOpenChannel.remove();
                    Botcord.pinnedOpenChannel = null;
                }
            } else if(isActive) {
                Botcord.pinnedOpenChannel = actives.channel.cloneNode(true);
                categoryEls[Botcord.currentChannel.parentId].parentElement.after(Botcord.pinnedOpenChannel);
            }
        })
    }

    if(Botcord.logs.values) logger.log(`Loaded channels:`, channelObjs);

    for(let channel of channelObjs) {
        if(!channel) continue;

        if(Botcord.logs.channels) {
            // logger.log(`-----`);
            logger.log(`Channel #${channel.name} (type ${channel.type}):`, channel);
        }
        if(channel.type == 11) continue;

        let li = mkelem("li", "channel");

        li.appendChild(mkelem(
            "img", "chIcon", 0,
            channelIcon(channel, Botcord.currentGuild)
        ));

        li.innerHTML += esc(channel.name);
        li.setAttribute("cid", channel.id);

        if(channel.permissionsFor(Botcord.client.user).has("ViewChannel")) {
            evt(li, "click", selectChannel);
        } else {
            li.classList.add("invisible");
            li.title = "Hidden Channel";
        }

        channelEls[channel.id] = (
            channel.parentId?
            categoryEls[channel.parentId]:
            channelList
        ).appendChild(li);
    }

    active( channelEls[Botcord.currentChannel.id], "channel" );

    let parent = actives.channel?.parentElement.parentElement;
    active(parent, "categoryOf");
    if(parent) parent.open = true;

    elem("#chInfoName").textContent = Botcord.currentChannel.name;
    elem("#chInfoImg").src = channelIcon(Botcord.currentChannel, Botcord.currentGuild);

    loadChat();
}

//#endregion
//#region Select Channel

function selectChannel() {
    let target = Botcord.channels[this.getAttribute("cid")];
    let allowedChannelTypes = [0, 5];
    if(allowedChannelTypes.includes(target.type)) {
        if(target.id == Botcord.currentChannel.id) {
            Botcord.chatContent.scrollTo({top: 0})
            return;
        }

        active(this, "channel");
        active(this.parentElement.parentElement, "categoryOf");
        Botcord.currentChannel = target;

        elem("#chInfoName").textContent = Botcord.currentChannel.name;
        elem("#chInfoImg").src = channelIcon(Botcord.currentChannel, Botcord.currentGuild);

        if(Botcord.pinnedOpenChannel) Botcord.pinnedOpenChannel.remove();
        Botcord.chatContent.scrollTop = 0;

        loadChat();
    } else {
        dialog.confirm(...templates.confirms.INVALID_CHANNEL_TYPE(target))
    }
}

//#endregion

module.exports = {
    loadChannels,
    selectChannel,
    loadChat
}