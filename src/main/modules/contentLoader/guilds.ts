import { Guild } from "discord.js";
import { loadChannels } from "./channels";

export * from "./channels";

export async function loadGuilds(): Promise<void> {
    let guilds = await Botcord.client!.guilds.fetch();

    if(guilds.size == 0) {
        dialog.confirm(templates.confirms.NO_GUILDS());
        return;
    }

    let fetches: Promise<Guild>[] = [];
    guilds.forEach(oAuth2Guild => fetches.push(oAuth2Guild.fetch()));
    
    for await (const guild of fetches) Botcord.guilds[guild.id] = guild;

    Botcord.currentGuild = Botcord.guilds[guilds.first()!.id];
    elem("#gName").innerText = Botcord.currentGuild.name;

    for(let id in Botcord.guilds) {
        let guild = Botcord.guilds[id];
        let icon = guild.iconURL({size: 128});

        let li = mkelem("li", "gItem");
        let img = mkelem("img", "gIcon", null, icon);
        let div = mkelem("div", "gIconCont");
        let div2 = mkelem("div", "gIconC");
        let acronym = mkelem("div", "gText");

        acronym.innerText = guild.nameAcronym;
        (icon? img: acronym).title = esc(guild.name);

        div2.setAttribute("gid", guild.id);
        evt(div2, "click", selectGuild);

        div2.appendChild(icon? img: acronym);
        div.appendChild(div2)
        li.appendChild(div);
        elem("#guilds").appendChild(li);
    }

    active(elem("#guilds").firstChild as HTMLLIElement, "guild");

    loadChannels();
}

export async function selectGuild(this: HTMLDivElement): Promise<void> {
    active(this.parentElement!.parentElement!, "guild");

    Botcord.currentGuild = Botcord.guilds[this.getAttribute("gid")!];
    Botcord.channels = {};

    elem("#gName").innerText = Botcord.currentGuild.name;

    loadChannels();
}