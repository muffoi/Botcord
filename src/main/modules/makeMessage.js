const discordMarkdown = require("@odiffey/discord-markdown");

function markdown(message) {
    // let md = MDParser.parse(esc(message.content)).split(/(&lt;|&gt;)/);
    let markdown = discordMarkdown.toHTML(message.content, {
        discordCallback: {
            user: node => {
                try {
                    return "@" + message.mentions.users.get(node.id).displayName;
                } catch {
                    return "@" + node.id;
                }
            },
            role: node => {
                try {
                    return "@" + message.mentions.roles.get(node.id).name;
                } catch {
                    return "@unknown-role";
                }
            },
            channel: node => {
                logger.debug(node);
                try {
                    let channel = Botcord.client.channels.resolve(node.id);
                    return "#" + (channel.guildId != Botcord.currentGuild.id? channel.guild.name + " > ": "") + channel.name;  // message.mentions.roles.get(node.id).name;
                } catch {
                    return "#unknown";
                }
            },
            everyone: () => "@everyone",
            here: () => "@here"
        }
    });

    if(Botcord.logs.messages) {
        logger.log(markdown);
    }
    return markdown;   // .join("");
}

function afterEffect(li) {

    if(!li.classList.contains("text")) return;

    let msgContent = li.children[1].children;
    msgContent = msgContent[msgContent.length - 2];

    if(Botcord.logs.messages) logger.log(msgContent);

    if(msgContent.childNodes.length == 1 &&
        (
            msgContent.children.length == 1 &&
            msgContent.children[0].tagName == "IMG" /* &&
            msgContent.children[0].classList.contains("d-emoji") */
        )
    ) msgContent.children[0].classList.add("d-single");

    for(let elem of msgContent.querySelectorAll("span.d-spoiler")) {
        evt(elem, "click", e => {
            e.preventDefault();
            elem.classList.add("show");
        })
    }
}

module.exports = {
    markdown,
    afterEffect
}