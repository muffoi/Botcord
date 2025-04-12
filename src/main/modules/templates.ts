import { Channel } from "discord.js";

export const confirms = {
    DISALLOWED_INTENTS() { 
        return {
            title: "Failed To Connect",
            description: `This bot account doesn't allow usage of gateway intents required for ${Botcord.package.productName} to run.<br>`
            + "<b>How to fix:</b><br>"
            + "1. Go to the <a href=\"https://discord.com/developers/applications\">discord developer page</a><br>"
            + "2. Open your bot's <i>Bot</i> tab<br>"
            + "3. Scroll down to <i>Privileged Gateway Intents</i><br>"
            + "4. Enable <b>Messge Content</b> and <b>Server Members</b> intent<br>"
            + "5. Press <b>Try Again</b>",
            options: {
                main: "Try Again"
            }
        }
    },
    INVALID_TOKEN() {
        return {
            title: "Invalid Token",
            description: `Connecting to <b>'${Botcord.current!.tag || "User"}'</b> failed, because the token provided is not a valid token.<br>`
            + `<b>Token:</b><br><span class="codeFull">${Botcord.current!.token}</span>`,
            options: {
                main: "Enter a New Token",
                other: "Remove Account",
                dismissible: false
            }
        }
    },
    REMOVE_ACCOUNT(user: AnyUserData, index: number) {
        return {
            title: `Remove '${user.username || "User"}'?`,
            description: `Are you sure you want to remove <b>${user.username || "User"}</b>${index === Botcord.storage!.userIndex? " (your current user)": ""}? You won't be able to access this account until you log in again.`,
            options: {
                main: "Remove Account",
                other: "Cancel",
                warn: true
            }
        }
    },
    NO_GUILDS() {
        return {
            title: "No servers to load",
            description: "This bot account hasn't joined any servers. "
            + "All server-releated functions won't be available until this bot joins a server.",
            options: { main: "Okay" }
        }
    },
    INVALID_CHANNEL_TYPE(channel: Channel) { 
        return {
            title: "Channel content couldn't be loaded",
            description: Botcord.package.productName + " is still in development and currently only supports basic text channels.<br>"
            + `<b>Channel type:</b> <code>${channel.type}</code>`,
            options: { main: "Okay" }
        }
    }
}