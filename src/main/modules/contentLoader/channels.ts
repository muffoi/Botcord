import { CategoryChannel, Channel, GuildChannel } from "discord.js";
import { channelIcon } from "../utils";
import { getLoadingStatus, loadChat } from "./chat";

export * from "./chat";

export async function loadChannels(): Promise<void> {
    let el = elem("#channels");
    el.innerHTML = "";

    let channels = await Botcord.currentGuild?.channels.fetch()!;
    channels.forEach(channel => channel && (Botcord.channels[channel.id] = channel));

    Botcord.currentChannel = Botcord.currentGuild?.systemChannelId? 
        Botcord.channels[Botcord.currentGuild?.systemChannelId]:
        channels.find(channel => channel?.type !== 4) || null;

    let categoryObj: ListByIDOf<CategoryChannel> = {};
    let channelObj: ListByIDOf<GuildChannel> = {};
    let categoryEls: ListByIDOf<HTMLUListElement> = {};
    let channelEls: ListByIDOf<HTMLLIElement> = {};

    for(let index in Botcord.channels) {
        let channel = Botcord.channels[index] as GuildChannel;

        if(channel.type == 4) categoryObj[index] = channel as CategoryChannel;
            else channelObj[index] = channel;
    }

    let sortedCategories: CategoryChannel[] = sortChannels(categoryObj);
    let sortedChannels: GuildChannel[] = sortChannels(channelObj);

    let channelList = el.appendChild(mkelem("ul", "chList"));

    for(let c of sortedCategories) {
        let sum = mkelem("summary", "catName"), det = mkelem("details", "category"), ul = mkelem("ul", "chList");
        sum.innerText = c.name;
        det.appendChild(sum);

        categoryEls[c.id] = det.appendChild(ul);
        el.appendChild(det);

        evt(det, "toggle", function() {
            let isActive = actives.category == this;

            if(isActive && this.open) {
                if(Botcord.pinnedOpenChannel) {
                    Botcord.pinnedOpenChannel.remove();
                    Botcord.pinnedOpenChannel = null;
                }
            } else if(isActive) {
                Botcord.pinnedOpenChannel = actives.channel.cloneNode(true) as HTMLLIElement;
                categoryEls[Botcord.currentChannel!.parentId!].parentElement!.after(Botcord.pinnedOpenChannel);
            }
        })
    }

    logger.debug("channels", `Loaded channels:`, sortedChannels);

    for(let channel of sortedChannels) {
        if(!channel) continue;

        logger.debug("channels", `Channel #${channel.name} (type ${channel.type}):`, channel);

        // if(channel.type == 11) continue;

        let li = mkelem("li", "channel");

        li.appendChild(mkelem(
            "img", "chIcon", null,
            channelIcon(channel, Botcord.currentGuild!)
        ));

        li.innerHTML += esc(channel.name);
        li.setAttribute("cid", channel.id);

        if(channel.permissionsFor(Botcord.client!.user)?.has("ViewChannel")) {
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

    active( channelEls[Botcord.currentChannel!.id], "channel" );

    let parent = actives.channel.parentElement!.parentElement! as HTMLDetailsElement;
    active(parent, "category");
    if(parent) parent.open = true;

    elem("#chInfoName").textContent = Botcord.currentChannel!.name;
    elem<HTMLImageElement>("#chInfoImg").src = channelIcon(Botcord.currentChannel!, Botcord.currentGuild!);

    loadChat();
}

export async function selectChannel(this: HTMLLIElement): Promise<void> {
    // if(getLoadingStatus().isFull) return;

    let target = Botcord.channels[this.getAttribute("cid")!];
    let allowedChannelTypes = [0, 5];
    if(allowedChannelTypes.includes(target.type)) {
        if(target.id == Botcord.currentChannel?.id) {
            Botcord.chatContent.scrollTo({top: 0});
            return;
        }

        active(this, "channel");
        active(this.parentElement!.parentElement!, "category");
        Botcord.currentChannel = target;

        elem("#chInfoName").textContent = Botcord.currentChannel.name;
        elem<HTMLImageElement>("#chInfoImg").src = channelIcon(Botcord.currentChannel, Botcord.currentGuild!);

        if(Botcord.pinnedOpenChannel) Botcord.pinnedOpenChannel.remove();
        Botcord.chatContent.scrollTop = 0;

        await loadChat();
    } else {
        try {
            dialog.confirm(templates.confirms.INVALID_CHANNEL_TYPE(target as Channel));
        } catch {}
    }
}