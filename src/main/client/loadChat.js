//#region Load Chat

async function loadChat(add = false) {
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

    if(!add) chatContent.innerHTML = "";
        else if(messages.length != 0) chatContent.removeChild(chatContent.lastChild);

    for(let id in messages) {
        let li = mkelem("li", "message");
        let message = messages[id];

        previousMessage = messages[+id + 1];
        let isLast = !previousMessage;
        if(logs.messages) {
            // logger.log(`-----`);
            logger.log(message, message.author);
        }


        let followup = previousMessage?.author === message.author; // , nfollowup = nextMessage?.author === message.author;
        // logger.log(prevMsg, nextMsg, followup, nfollowup, isLast);

        if(followup) li.classList.add("no-margin");

        switch(message.type) {
            case 0: // Text message
                li.innerHTML = followup?`
                <div class="pfpCon">

                </div>
                <div class="msgCon">
                    <div class="msgContent">${markdown(message)}</div>
                </div>`: `
                <div class="pfpCon">
                    <img src="${message.author.avatarURL({size: 64})}">
                </div>
                <div class="msgCon">
                    <div class="msgHeader">
                        <span class="msgAuthor">${esc(message.author.displayName)}</span>
                        <span class="msgDate">${formatDate(message.createdAt)}</span>
                    </div>
                    <div class="msgContent">${markdown(message)}</div>
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
                        <span class="msgDate">${formatDate(message.createdAt)}</span>
                    </div>
                    <div class="msgContent">${markdown(message)}</div>
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
