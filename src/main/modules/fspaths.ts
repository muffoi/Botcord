import { join } from "path";

export const records = join(
    Botcord.args.appData as string,
    "records"
);