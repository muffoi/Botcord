import { formatDate, resizeDimensions, getContentType } from "../utils";
import { markdown, afterEffect } from "../makeMessage";
import { Message, TextChannel } from "discord.js";
import { obtainHandle } from "./loaderHandle";

export * from "./loaderHandle";

export async function loadChat(add: boolean = false): Promise<void> {
    // Obtain loader handle with correct flag
    const handle = obtainHandle(!add, Botcord.currentChannel!.id);

    // If obtaining handle failed, quit
    if(!handle) return;

    if(!add) Botcord.chatContent.innerHTML = "";

    const collection = await (Botcord.currentChannel as TextChannel).messages.fetch(add? {
        before: Botcord.topLoadedMessage!,
        limit: Botcord.limits.messageFetch
    }: {
        limit: Botcord.limits.messageFetch
    });
    
    let previousMessage: Message, topLoadedMessage = Botcord.topLoadedMessage;
    
    // Convert Collection to an Array
    const messages = collection.reduce((array: Message<true>[], message) => {
        array.push(message);
        return array;
    }, []);
    
    if(add && messages.length <= 1) {
        logger.debug("handles", `Update #${handle!.id} not necessary!`);
        
        // If no additional messages to render are present, release handle and quit
        handle!.clear();
        return;
    }

    const fragment = document.createDocumentFragment();

    for(let id in messages) {
        let li = mkelem("li", "message");
        let message = messages[id];

        previousMessage = messages[+id + 1];
        let isLast = !previousMessage;

        logger.debug("messages", message, message.author);

        let followup = (
            previousMessage?.author === message.author
        ) && (
            message.createdTimestamp - previousMessage.createdTimestamp < Botcord.limits.messageGroupingTime
        );
        let attachments = "";

        if(followup) li.classList.add("no-margin");

        if (message.attachments.size > 0) {
            for (const attachment of message.attachments) {
                let media = attachment[1];

                if(getContentType(media.contentType!)?.category != "image") continue;
                let { width, height } = media;

                if(height! > Botcord.limits.attachmentHeight) {
                    width = resizeDimensions(height!, width!, Botcord.limits.attachmentHeight);
                    height = Botcord.limits.attachmentHeight;
                }

                let maxMsgWidth = Botcord.styleDimensions.maxMessageWidth();

                if(width! > maxMsgWidth) {
                    height = resizeDimensions(width!, height!, maxMsgWidth);
                    width = maxMsgWidth;
                }

                width = Math.round(width!);
                height = Math.round(height!);

                let realW = Math.round(width * devicePixelRatio),
                    realH = Math.round(height * devicePixelRatio);

                attachments += `
                <div class="attachmentBox"  style="aspect-ratio:${width}/${height};width:${width}px">
                    <img class="attachment" src="${media.proxyURL + `width=${realW}&height=${realH}`}">
                </div>
                `;
            }
        }

        let guildMember = Promise.resolve(
            message.author.globalName === null? null: (
                Botcord.currentGuild!.members.resolve(message.author.id)
                || fetchUnfinished(
                    toNull(Botcord.currentGuild!.members.fetch(message.author.id)),
                    "guildMember:" + message.author.id
                )
            )
        );

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
                            <span class="msgDate" title="${message.createdAt}">
                                <span class="visuallyHidden"> — </span>
                                ${formatDate(message.createdAt)}
                            </span>
                        </div>
                        <div class="msgContent">${markdown(message)}</div>
                        <div class="msgAttachment">${attachments}</div>
                    </div>`;
                li.classList.add("text");
                if(!followup) guildMember.then(member => {
                    if(member) li.querySelector<HTMLSpanElement>("span.msgAuthor")!.style.color = member.displayHexColor;
                });
                break;

            case 19: // Response
                li.innerHTML = `
                    <div class="pfpCon">
                        <img src="${message.author.avatarURL({size: 64})}">
                    </div>
                    <div class="msgCon">
                        <div class="msgHeader">
                            <span class="msgAuthor">${esc(message.author.displayName)}</span>
                            <span class="msgAddition"> (responding to ${message.mentions.repliedUser? `<span class="format d-mention">${message.mentions.repliedUser.displayName}</span>`: "a deleted message"})</span>
                            <span class="visuallyHidden"> — </span>
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

        afterEffect(li);

        fragment.appendChild(li);
    }

    // Check for handle validity and clear handle
    // If handle was not obtained by other loader, apply rendered messages
    if(handle!.clear()) {

        logger.debug("handles", `Successfully applied update #${handle!.id}!`);

        if(add) {
            // Clear oldest loaded message to redender it
            // Removing is useful for cases like multiple messages from same author in a row,
            // with a part of this stack being loaded and part unloaded
            Botcord.chatContent.removeChild(Botcord.chatContent.lastChild!);
        }

        Botcord.topLoadedMessage = topLoadedMessage;
        Botcord.chatContent.appendChild(fragment);
    } else logger.debug("handles", `Update #${handle!.id} aborted!`);
}