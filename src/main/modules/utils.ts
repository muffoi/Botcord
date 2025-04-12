import { Channel, Guild, GuildChannel } from "discord.js";

export function channelIcon(channel: GuildChannel, guild: Guild): string {
    return `https://img.icons8.com/material-rounded/24/${color(theme.colorDark)}/` + (channel.permissionsFor(Botcord.client?.user!)?.has("ViewChannel")?
        (guild.rulesChannel === channel?
            "bookmark": // repository
            resolveChannelIconNamespace(channel)
        ):
        "hide"
    )
}

export function resolveChannelIconNamespace(channel: Channel | GuildChannel): string | null {
    return [
        "hashtag",,
        "speaker",,,
        "commercial",,,,,,,, // megaphone
        "online",,
        "communication" // chat
    ][channel.type] || null;
}

export function formatDate(date: Date): string {
    /* return d.toLocaleString(undefined, {
        day:"numeric",
        month:"numeric",
        year:"numeric",
        hour: "numeric",
        minute:"numeric"
    }) */

    return dayjs(date).calendar();
}

export function color(hex: string): string | null {
    return hex.match(/#([0-9a-fA-F]+)/)?.[1] || null;
}

export function resizeDimensions(x: number, y: number, x2: number): number {
    return y / x * x2;
}

export function getContentType(mimeType: string): MimeTypeDetails | null  {
    let match = mimeType.match(/([^/]+)\/([^/]+)/);
    if(!match) return null;

    return {
        mime: mimeType,
        category: match[1],
        type: match[2]
    }
}