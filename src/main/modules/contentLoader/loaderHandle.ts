import { Snowflake } from "discord.js";

let activeHandleID = 0;
let isFullRenderLoading = false;
let isLoading = false;
let channelID: Snowflake;

export class Handle {
    readonly id: number;
    cleared: boolean;

    constructor(id: number) {
        this.id = id;
        this.cleared = false;
    }

    clear(): boolean {
        this.cleared = true;

        if(this.id === activeHandleID) {
            isFullRenderLoading = false;
            isLoading = false;

            return true;
        }

        return false;
    }

    isActive(): boolean {
        return this.id === activeHandleID && !this.cleared;
    }
}

export function obtainHandle(isFull: boolean, channel: Snowflake): Handle | null {
    if(( isLoading && !isFull ) || ( isLoading && isFull && channelID === channel )) {
        logger.debug("handles", `Refused to grant ${isFull? "FULL": "REGULAR"} handle (attempted ID ${activeHandleID + 1})`);
        return null;
    }

    if(isFull) isFullRenderLoading = true;

    isLoading = true;
    channelID = channel;

    logger.debug("handles", `Granted ${isFull? "FULL": "REGULAR"} handle #${activeHandleID + 1}`);

    return new Handle(++activeHandleID);
}

export function getLoadingStatus(): LoadingStatus {
    return {
        isLoading,
        isFull: isFullRenderLoading
    };
}

export interface LoadingStatus {
    isLoading: boolean,
    isFull: boolean
}