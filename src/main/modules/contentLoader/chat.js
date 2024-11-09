const { formatDate, resizeDimensions, getContentType } = require("../utils");
const { markdown, afterEffect } = require("../makeMessage");

//#region Load Chat

async function loadChat(add = false) {
    if(!add) Botcord.chatContent.innerHTML = "";

    let msgs = await Botcord.currentChannel.messages.fetch(add? {
        before: Botcord.topLoadedMessage,
        limit: Botcord.limits.messageFetch
    }: {
        limit: Botcord.limits.messageFetch
    }), messages = [];

    let previousMessage; // , nextMessage;

    msgs.forEach(message => {
        messages.push(message);
    });

    if(add && messages.length != 0) Botcord.chatContent.removeChild(Botcord.chatContent.lastChild);

    for(let id in messages) {
        let li = mkelem("li", "message");
        let message = messages[id];

        previousMessage = messages[+id + 1];
        let isLast = !previousMessage;
        if(Botcord.logs.messages) {
            // logger.log(`-----`);
            logger.log(message, message.author);
        }


        let followup = (previousMessage?.author === message.author) &&
            (message.createdTimestamp - previousMessage.createdTimestamp < Botcord.limits.messageGroupingTime),
            attachments = ""; // , nfollowup = nextMessage?.author === message.author;
        // logger.log(prevMsg, nextMsg, followup, nfollowup, isLast);

        if(followup) li.classList.add("no-margin");

        if (message.attachments.size > 0) {
            for (const attachment of message.attachments) {
                let media = attachment[1];

                if(getContentType(media.contentType).category != "image") continue;
                let { width, height } = media;

                if(height > Botcord.limits.attachmentHeight) {
                    width = resizeDimensions(height, width, Botcord.limits.attachmentHeight);
                    height = Botcord.limits.attachmentHeight;
                }

                let maxMsgWidth = Botcord.styleDimensions.maxMessageWidth();

                if(width > maxMsgWidth) {
                    height = resizeDimensions(width, height, maxMsgWidth);
                    width = maxMsgWidth;
                }

                width = Math.round(width);
                height = Math.round(height);

                attachments += `
                <div class="attachmentBox"  style="aspect-ratio:${width}/${height};width:${width}px">
                    <img class="attachment" src="${media.proxyURL + `width=${width}&height=${height}`}">
                </div>
                `;
            }
        }

        switch(message.type) {
            case 0: // Text message
                li.innerHTML = followup?`
                    <div class="pfpCon">

                    </div>
                    <div class="msgCon">
                        <div class="msgContent">${markdown(message)}</div>
                        <div class="msgAttachment">${attachments}</div>
                    </div>`: `
                    <div class="pfpCon">
                        <img src="${message.author.avatarURL({size: 64})}">
                    </div>
                    <div class="msgCon">
                        <div class="msgHeader">
                            <span class="msgAuthor">${esc(message.author.displayName)}</span>
                            <span class="msgDate" title="${message.createdAt}">${formatDate(message.createdAt)}</span>
                        </div>
                        <div class="msgContent">${markdown(message)}</div>
                        <div class="msgAttachment">${attachments}</div>
                    </div>`;
                li.classList.add("text");
                break;

            case 19: // Response
                li.innerHTML = `
                    <div class="pfpCon">
                        <img src="${message.author.avatarURL({size: 64})}">
                    </div>
                    <div class="msgCon">
                        <div class="msgHeader">
                            <span class="msgAuthor">${esc(message.author.displayName)}</span>
                            <span class="msgAddition">(responding to ${message.mentions.repliedUser? `<b>${message.mentions.repliedUser.displayName}</b>`: "a deleted message"})</span>
                            <span class="msgDate" title="${message.createdAt}">${formatDate(message.createdAt)}</span>
                        </div>
                        <div class="msgContent">${markdown(message)}</div>
                        <div class="msgAttachment">${attachments}</div>
                    </div>`;
                li.classList.add("text");
                break;

            default: 
                li.innerHTML = `<code>&lt;Unknown Message Type [author: ${message.author.tag}, type: ${message.type}]></code>`;
                li.classList.add("unknown");
        }

        if(!isLast) Botcord.topLoadedMessage = message.id;
        // nextMessage = message;

        afterEffect(li);

        Botcord.chatContent.appendChild(li);
    }
}

//#endregion

module.exports = { loadChat };