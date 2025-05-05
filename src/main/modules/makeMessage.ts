import discordMarkdown from "@odiffey/discord-markdown";
import { GuildChannel, Message } from "discord.js";

export function markdown(message: Message) {
    // let md = MDParser.parse(esc(message.content)).split(/(&lt;|&gt;)/);
    let markdown = discordMarkdown.toHTML(message.content, {
        discordCallback: {
            user: node => {
                let name = message.mentions.users.get(node.id)?.displayName;
                if(!name) return `<@${node.id}>`;

                return "@" + name;
                
            },
            role: node => "@" + (message.mentions.roles.get(node.id)?.name || "unknown-role"),
            channel: node => {
                let channel = Botcord.client?.channels.resolve(node.id) as GuildChannel | null | undefined;
                if(!channel) return "#unknown";

                return "#" + (channel.guildId != Botcord.currentGuild?.id? channel.guild.name + " > ": "") + channel.name;
            },
            everyone: () => "@everyone",
            here: () => "@here"
        }
    });

    logger.debug("messages", markdown);

    return markdown;
}

export function afterEffect(li: HTMLLIElement) {

    if(!li.classList.contains("text")) return;

    li.innerHTML = li.innerHTML.replace(/\n|(\s{4})/g, "");

    let msgContent = li.querySelector<HTMLDivElement>(".msgContent")!;

    logger.debug("messages", msgContent);

    if(msgContent.childNodes.length == 1 &&
        (
            msgContent.children.length == 1 &&
            msgContent.children[0].tagName == "IMG" /* &&
            msgContent.children[0].classList.contains("d-emoji") */
        )
    ) msgContent.children[0].classList.add("d-single");

    for(let elem of msgContent.querySelectorAll<HTMLSpanElement>("span.d-spoiler")) {
        evt(elem, "click", e => {
            if(elem.classList.contains("show")) return;
            e.preventDefault();
            elem.classList.add("show");
        })
    }
}