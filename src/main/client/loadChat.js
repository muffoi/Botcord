//#region Load Chat

async function loadChat(add = false) {
    if(!add) chatContent.innerHTML = "";

    let msgs = await currentChannel.messages.fetch(add? {
        before: topLoadedMessage,
        limit: limits.messageFetch
    }: {
        limit: limits.messageFetch
    }), messages = [];

    let previousMessage; // , nextMessage;

    msgs.forEach(message => {
        messages.push(message);
    });

    if(add && messages.length != 0) chatContent.removeChild(chatContent.lastChild);

    for(let id in messages) {
        let li = mkelem("li", "message");
        let message = messages[id];

        previousMessage = messages[+id + 1];
        let isLast = !previousMessage;
        if(logs.messages) {
            // logger.log(`-----`);
            logger.log(message, message.author);
        }


        let followup = (previousMessage?.author === message.author) &&
            (message.createdTimestamp - previousMessage.createdTimestamp < limits.messageGroupingTime),
            attachments = ""; // , nfollowup = nextMessage?.author === message.author;
        // logger.log(prevMsg, nextMsg, followup, nfollowup, isLast);

        if(followup) li.classList.add("no-margin");

        if (message.attachments.size > 0) {
            for (const attachment of message.attachments) {
                let media = attachment[1];

                if(getContentType(media.contentType).category != "image") continue;
                let { width, height } = media;

                if(height > limits.attachmentHeight) {
                    width = resizeDimensions(height, width, limits.attachmentHeight);
                    height = limits.attachmentHeight;
                }

                let maxMsgWidth = styleDimensions.maxMessageWidth();

                if(width > maxMsgWidth) {
                    height = resizeDimensions(width, height, maxMsgWidth);
                    width = maxMsgWidth;
                }

                attachments += `
                <div class="attachmentBox"  style="aspect-ratio:${width}/${height};width:${width}px">
                    <img class="attachment" src="${media.proxyURL}">
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

        if(!isLast) topLoadedMessage = message.id;
        // nextMessage = message;

        afterEffect(li);

        chatContent.appendChild(li);
    }
}

//#endregion
