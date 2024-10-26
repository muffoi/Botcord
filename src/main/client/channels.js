//#region Load Channels

function loadChannels() {
    let el = elem('#channels'), categoryObjs = {}, channelObjs = {}, categoryEls = {}, channelEls = {};
    el.innerHTML = "";

    for(let i in channels) {
        let channel = channels[i];

        if(channel.type == 4) categoryObjs[i] = channel;
            else channelObjs[i] = channel;
    }

    categoryObjs = sortChannels(categoryObjs);
    channelObjs = sortChannels(channelObjs);
    let channelList = el.appendChild(mkelem('ul', "chList"));

    for(let c of categoryObjs) {
        let sum = mkelem('summary', 'catName'), det = mkelem('details', 'category'), ul = mkelem('ul', 'chList');
        sum.innerText = c.name;
        det.appendChild(sum);

        categoryEls[c.id] = det.appendChild(ul);
        el.appendChild(det);

        evt(det, "toggle", function() {
            let isActive = actives.categoryOf == this;

            if(isActive && this.open) {
                if(pinnedOpenChannel) {
                    pinnedOpenChannel.remove();
                    pinnedOpenChannel = null;
                }
            } else if(isActive) {
                pinnedOpenChannel = actives.channel.cloneNode(true);
                categoryEls[currentChannel.parentId].parentElement.after(pinnedOpenChannel);
            }
        })
    }

    if(logs.values) logger.log(`Loaded channels:`, channelObjs);

    for(let channel of channelObjs) {
        if(!channel) continue;

        if(logs.channels) {
            // logger.log(`-----`);
            logger.log(`Channel #${channel.name} (type ${channel.type}):`, channel);
        }
        if(channel.type == 11) continue;

        let li = mkelem('li', 'channel');

        li.appendChild(mkelem(
            'img', 'chIcon', 0,
            channelIcon(channel, currentGuild)
        ));

        li.innerHTML += esc(channel.name);
        li.setAttribute('cid', channel.id);

        if(channel.permissionsFor(client.user).has("ViewChannel")) {
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

    active( channelEls[currentChannel.id], "channel" );

    let parent = actives.channel?.parentElement.parentElement;
    active(parent, "categoryOf");
    if(parent) parent.open = true;

    elem("#chInfoName").textContent = currentChannel.name;
    elem("#chInfoImg").src = channelIcon(currentChannel, currentGuild);

    loadChat();
}

//#endregion
//#region Select Channel

function selectChannel() {
    let target = channels[this.getAttribute("cid")];
    if(target.type === 0) {
        active(this, "channel");
        active(this.parentElement.parentElement, "categoryOf");
        currentChannel = target;
        elem("#chInfoName").textContent = currentChannel.name;
        elem("#chInfoImg").src = channelIcon(currentChannel, currentGuild);
        if(pinnedOpenChannel)pinnedOpenChannel.remove();

        loadChat();
    } else {
        dialog.confirm(...templates.confirms.INVALID_CHANNEL_TYPE(target))
    }
}

//#endregion
